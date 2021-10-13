const command = require('../command.js');
module.exports = new command({
  name: 'pause',
  description: "Questo mette in pausa la riproduzione",
  run: (message,args,client)=>{
    const musicPlayer = message.client.sessions.get(message.guildId);
    musicPlayer.pause(message);
  }
});
