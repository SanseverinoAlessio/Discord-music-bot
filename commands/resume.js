const command = require('../command.js');
module.exports = new command({
  name: 'resume',
  description: "Questo riprende la riproduzione",
  run: (message,args,client)=>{
    const musicPlayer = message.client.sessions.get(message.guildId);
    musicPlayer.resume(message);
  }
});
