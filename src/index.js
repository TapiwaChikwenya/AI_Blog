import './scripts/scheduler.js'; // Import the scheduler to start it

// Your existing application code
import express from 'express';
const app = express();

// Define your routes and middleware
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(3500, () => {
  console.log('Server is running on port 3500');
});
