const { spawn } = require('child_process');

function startBot() {
    const bot = spawn('node', ['index.js'], { stdio: 'inherit' });

    bot.on('exit', (code) => {
        console.log(`Bot exited with code ${code}. Restarting...`);
        if (code === 1) {
            startBot(); // Restart the bot if it exited with code 1
        }
    });
}

// Start the bot for the first time
startBot();
