import cron from 'node-cron';
import { exec } from 'child_process';
import { appendFile } from 'fs/promises';
import { join } from 'path';

// Function to log with timestamp
async function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  console.log(logMessage);
  
  try {
    await appendFile(join(process.cwd(), 'cron.log'), logMessage);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

// Log when the scheduler starts
logWithTimestamp('Scheduler started');

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  await logWithTimestamp('Running the scheduled scrape task...');
  
  exec('npm run scrape', async (error, stdout, stderr) => {
    if (error) {
      await logWithTimestamp(`Error executing scrape: ${error.message}`);
      return;
    }
    if (stderr) {
      await logWithTimestamp(`stderr: ${stderr}`);
    }
    await logWithTimestamp(`stdout: ${stdout}`);
    await logWithTimestamp('Scheduled scrape task completed');
  });
});

// Add a test cron job that runs every minute for verification
cron.schedule('* * * * *', async () => {
  await logWithTimestamp('Test cron running - checking scheduler is active');
});
