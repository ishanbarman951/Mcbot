const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'mcfleet.net',
    username: 'deadishan',
    version: '1.21.8'
  });

  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log('Spawned. Starting verification.');

    let verified = 0;

    const verify = () => {
      if (verified < 3) {
        verified++;
        bot.chat('1'); // replace with real verification if needed
        setTimeout(verify, 2000 + Math.random() * 1000);
      } else {
        setTimeout(() => {
          bot.chat('/login ishan%995'); // safe login
          console.log('Logged in.');

          // wait for server to fully load before switching
          setTimeout(() => {
            bot.chat('/server survival-4');
            console.log('Switching to survival-4...');
          }, 5000); // extra delay to ensure login processed
        }, 2000);
      }
    };

    verify();
  });

  // Keep the bot “alive” to avoid AFK timeout
  function startAntiAFK() {
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * 0.5;
      bot.look(yaw, pitch, true);

      if (Math.random() > 0.5) {
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), 1000 + Math.random() * 1000);
      }
    }, 10000 + Math.random() * 5000);
  }

  // Start anti-AFK once server switch is detected
  bot.on('message', (message) => {
    const text = message.toString();
    if (text.includes('You have connected to survival-4')) { // server-specific success message
      console.log('Bot is now in survival-4');
      startAntiAFK();
    }
  });

  // Owner chat commands
  bot.on('chat', (username, message) => {
    if (username === 'ItzIshan_') {
      if (message.toLowerCase() === 'server') {
        bot.chat('/server survival-4');
      }
    }
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason);
    setTimeout(createBot, 10000);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Error:', err));
}

createBot();
