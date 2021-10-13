const command = require('../command.js');
module.exports = new command({
  name: 'leave',
  description: "Questo comando termina la sessione",
  run: (message,args,client)=>{
    const musicPlayer = message.client.sessions.get(message.guildId);
    if(!musicPlayer.voiceConnection){
      message.reply({embeds:[{
        color:"c91400",
        description: "Il bot non si trova in alcun canale vocale",
      }]});
      return;
    }
    musicPlayer.leave(message);


  }
});
