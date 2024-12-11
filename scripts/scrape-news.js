import { parse } from 'node:url';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { format } from 'date-fns';
import pLimit from 'p-limit';
import { LRUCache } from 'lru-cache';

const parser = new Parser();

// Configure rate limiting
const limit = pLimit(3); // Limit concurrent requests
const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 60 // 1 hour cache
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, {
      ...options,
      timeout: 10000, // 10 second timeout
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Define news sources
const sources = [
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    contentSelector: 'article.article-body',
    cleanupSelectors: ['.advertisement', '.newsletter-signup', '.social-share']
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    contentSelector: '.article-content',
    cleanupSelectors: ['.advertisement', '.social-share-buttons', '.newsletter-signup']
  },
  {
    name: 'Google AI Blog',
    url: 'http://feeds.feedburner.com/blogspot/gJZg',
    contentSelector: '.post-content',
    cleanupSelectors: ['.social-share', '.comments']
  }
];

async function fetchFullArticleContent(url, source) {
  // Check cache first
  const cached = cache.get(url);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const $ = cheerio.load(html, {
      decodeEntities: true,
      xmlMode: false
    });
    
    const contentElement = $(source.contentSelector);
    source.cleanupSelectors.forEach(selector => {
      contentElement.find(selector).remove();
    });
    
    const content = contentElement.html();
    if (content) {
      cache.set(url, content);
    }
    
    return content || '';
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
    return null;
  }
}

async function fetchRSSFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const articlePromises = feed.items.map(item => 
      limit(() => processArticle(item, source))
    );
    
    const articles = await Promise.allSettled(articlePromises);
    return articles
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(Boolean);
  } catch (error) {
    console.error(`Error fetching ${source.name}:`, error);
    return [];
  }
}

async function processArticle(item, source) {
  try {
    const fullContent = await fetchFullArticleContent(item.link, source);
    if (!fullContent) return null;

    return {
      title: item.title,
      content: sanitizeHtml(fullContent || item.content || item.description, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt']
        }
      }),
      date: new Date(item.pubDate || item.date),
      source: source.name,
      url: item.link
    };
  } catch (error) {
    console.error(`Error processing article ${item.title}:`, error);
    return null;
  }
}

async function createMDXPost(article) {
  try {
    const slug = slugify(article.title, { lower: true, strict: true });
    const date = format(article.date, 'yyyy-MM-dd');
    const formattedDate = format(article.date, 'MMMM d, yyyy');
    
    const content = `---
title: "${article.title.replace(/"/g, '\\"')}"
date: "${date}"
source: "${article.source}"
sourceUrl: "${article.url}"
excerpt: "${cleanExcerpt(article.content)}"
---

# ${article.title}

<div class="text-sm text-gray-500 mb-4">
  Published on ${formattedDate} | Source: [${article.source}](${article.url})
</div>

${sanitizeAndFixHTML(article.content)}

---

*This article was originally published on [${article.source}](${article.url}). Visit the source for more information.*
`;

  const filePath = join(process.cwd(), 'src', 'content', 'blog', `${date}-${slug}.mdx`);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf-8');
  
  return {
    slug: `${date}-${slug}`,
    title: article.title,
    date: formattedDate,
    source: article.source,
    excerpt: article.content.substring(0, 160) + '...'
  };
  } catch (error) {
    console.error(`Error creating MDX post for "${article.title}":`, error);
    return null;
  }
}

function cleanExcerpt(excerpt) {
  // First sanitize and fix HTML
  const cleanedHtml = sanitizeAndFixHTML(excerpt);
  
  // Then remove all HTML tags
  return cleanedHtml
    .replace(/<[^>]*>/g, '')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove newlines
    .replace(/\n/g, ' ')
    // Trim
    .trim()
    // Limit length and add ellipsis
    .slice(0, 200) + '...';
}

function sanitizeAndFixHTML(html) {
  // First use cheerio to parse and clean the HTML
  const $ = cheerio.load(html, {
    xmlMode: true,
    decodeEntities: true
  });
  
  // Get the cleaned HTML
  let cleanedHtml = $.html();
  
  // Remove any empty div tags
  cleanedHtml = cleanedHtml.replace(/<div>\s*<\/div>/g, '');
  
  // Ensure all divs are properly closed
  const openDivs = (cleanedHtml.match(/<div/g) || []).length;
  const closeDivs = (cleanedHtml.match(/<\/div>/g) || []).length;
  
  // Add missing closing tags if needed
  if (openDivs > closeDivs) {
    cleanedHtml += '</div>'.repeat(openDivs - closeDivs);
  }
  
  return cleanedHtml;
}

async function main() {
  console.log('Starting news scraping...');
  
  const articles = [];
  
  for (const source of sources) {
    console.log(`Fetching from ${source.name}...`);
    const items = await fetchRSSFeed(source);
    articles.push(...items);
  }
  
  // Sort by date
  articles.sort((a, b) => b.date - a.date);
  
  // Take the latest 20 articles
  const latestArticles = articles.slice(0, 20);
  
  console.log(`Creating ${latestArticles.length} MDX files...`);
  
  const posts = [];
  for (const article of latestArticles) {
    const post = await createMDXPost(article);
    if (post) {
      posts.push(post);
      console.log(`Created post: ${post.slug}`);
    }
  }
  
  // Create index file
  const indexContent = `export const posts = ${JSON.stringify(posts, null, 2)};`;
  const indexPath = join(process.cwd(), 'src', 'content', 'blog', '_index.js');
  
  await writeFile(indexPath, indexContent, 'utf-8');
  console.log(`Index file written to: ${indexPath}`);
  
  // List all files in the blog directory
  const blogDir = join(process.cwd(), 'src', 'content', 'blog');
  const files = await readdir(blogDir);
  console.log('Files in blog directory:', files);
  
  console.log(`Scraping completed successfully! Created ${posts.length} valid posts.`);
}

main().catch(error => {
  console.error('Error during scraping:', error);
  process.exit(1);
});
