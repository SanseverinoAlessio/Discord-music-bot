module.exports = (client)=>{
  const {Collection} = require('discord.js');
  const fs = require('fs');
  client.commands = new Collection();
  try{
    fs.readdirSync('./commands').filter(file => file.endsWith('.js')).forEach((file)=>{
      let command = require('../commands/' + file);
      client.commands.set(command.name,command);
    });
  }
  catch(e){
    console.error(e);
  }
}
