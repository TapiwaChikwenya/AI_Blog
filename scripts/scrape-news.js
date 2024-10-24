import { parse } from 'node:url';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { format } from 'date-fns';

const parser = new Parser();

const sources = [
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    type: 'rss'
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    type: 'rss'
  },
  {
    name: 'Google AI Blog',
    url: 'http://googleaiblog.blogspot.com/atom.xml',
    type: 'rss'
  }
];

async function fetchRSSFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.map(item => ({
      title: item.title,
      content: sanitizeHtml(item.content || item.description, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt']
        }
      }),
      date: new Date(item.pubDate || item.date),
      source: source.name,
      url: item.link
    }));
  } catch (error) {
    console.error(`Error fetching ${source.name}:`, error);
    return [];
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
excerpt: "${article.content.substring(0, 160).replace(/"/g, '\\"')}..."
---

# ${article.title}

<div class="text-sm text-gray-500 mb-4">
  Published on ${formattedDate} | Source: [${article.source}](${article.url})
</div>

${article.content}

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
    }
  }
  
  // Create index file
  const indexContent = `export const posts = ${JSON.stringify(posts, null, 2)};`;
  await writeFile(
    join(process.cwd(), 'src', 'content', 'blog', '_index.js'),
    indexContent,
    'utf-8'
  );
  
  console.log(`Scraping completed successfully! Created ${posts.length} valid posts.`);
}

main().catch(console.error);
