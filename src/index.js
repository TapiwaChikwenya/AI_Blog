import '../scripts/scheduler.js';
import express from 'express';
import { handler as ssrHandler } from '../dist/server/entry.mjs';

const app = express();

// Use the Astro SSR handler
app.use(ssrHandler);

app.listen(3500, '0.0.0.0', () => {
  console.log('Server is running on port 3500');
});
