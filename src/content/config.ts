import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    source: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    excerpt: z.string(),
  }),
});

export const collections = { blog };