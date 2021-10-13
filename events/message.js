const event = require('../event.js');
const musicPlayer = require('../music/musicPlayer.js');
module.exports = new event({
  name: 'messageCreate',
  once: false,
  execute: (message)=>{
    let guildId = message.guildId;
    let prefix = "!";
    if(message.content[0] != prefix) return;
    let client = message.client;
    try{
      let command = client.commands.get(message.content.split(' ')[0].replace('!',''));
      if(!command){
        return;
      }
      if(!client.sessions.get(guildId)){
        client.sessions.set(guildId,new musicPlayer());
      }
      command.run(message,[]);
    }
    catch(e){
      console.error(e);
    }
  }
});
