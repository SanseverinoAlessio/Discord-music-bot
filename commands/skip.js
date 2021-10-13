const command = require('../command.js');
module.exports = new command({
  name: 'skip',
  description: "Questo comando serve a richiamare la canzone successiva presente nella coda",
  run: (message,args,client)=>{
    const musicPlayer = message.client.sessions.get(message.guildId);
   musicPlayer.nextMusic();
  }
});
