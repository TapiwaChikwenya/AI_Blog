import '../scripts/scheduler.js'; // Import the scheduler to start it
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Your existing application code
import express from 'express';
const app = express();

// Define your routes and middleware
//app.get('/', (req, res) => {
//  res.send('Hello, World!');
//});
// Serve static files from the Astro build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


// Start the server
app.listen(3500, () => {
  console.log('Server is running on port 3500');
});
