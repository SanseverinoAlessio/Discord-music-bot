const {Collection} = require('discord.js');
module.exports = (client)=>{
  const fs = require('fs');
  try{
    client.sessions = new Collection();
    fs.readdirSync('./events').filter(file=> file.endsWith('.js')).forEach((file)=>{
      const appEvent = require('../events/'+ file);
      if(appEvent.once){
        client.once(appEvent.name,(...args) => appEvent.execute(...args));
      }
      else{
        client.on(appEvent.name,(...args) => appEvent.execute(...args));
      }
    });
  }
  catch(e){
    console.error(e);
  }
}
