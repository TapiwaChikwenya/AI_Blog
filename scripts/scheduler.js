import cron from 'node-cron';
import { exec } from 'child_process';

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running the scrape task...');
  exec('npm run scrape', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing scrape: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});
