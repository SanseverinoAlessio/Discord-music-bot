const command = require('../command.js');
module.exports = new command({
  name: 'stop',
  description: "Questo comando serve per interrompere",
  run: (message,args,client)=>{
    const musicPlayer = message.client.sessions.get(message.guildId);
    musicPlayer.stop(message);
  }
});
