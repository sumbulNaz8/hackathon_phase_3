const { spawn } = require('child_process');
const path = require('path');

// Spawn the next dev process
const nextProcess = spawn('npx', ['next', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

nextProcess.on('error', (err) => {
  console.error('Failed to start next dev:', err);
});

nextProcess.on('close', (code) => {
  console.log(`Next dev process exited with code ${code}`);
});