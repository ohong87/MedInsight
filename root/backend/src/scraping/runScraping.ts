import { exec } from 'child_process';


function runScraping(fileData: any) {
  exec('python3 your_script.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}
// The file should after it's run, send json data to be stored in the database.
export default runScraping;