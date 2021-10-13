const command = require('../command.js');
module.exports = new command({
  name: 'play',
  description: "Questo comando serve a riprodurre musica",
  run: async (message,args,client)=>{
    const musicPlayer = message.client.sessions.get(message.guildId);
    const {voice} = message.member;
    if(!voice.channel){
      message.reply('Devi prima entrare in un canale vocale');
      return;
    }
    if (!musicPlayer.voiceConnection || musicPlayer.voiceConnection._state.status == 'disconnected' || musicPlayer.voiceConnection._state.status == 'destroyed' ){
      musicPlayer.joinIn({
        channelId: voice.channel.id,
        guildId: message.guild.id,
        voiceAdapterCreator: message.guild.voiceAdapterCreator,
        message: message,
      });
    }
    if(musicPlayer.voiceConnection._state.status != 'signalling' && musicPlayer.voiceConnection.packets.state.channel_id != voice.channel.id){
      message.reply({embeds: [{
        color: 'edda0c',
        title: '',
        description: "Sono già in un altro canale vocale",
      }]});
      return;
    }
    await musicPlayer.findMusic(message);
  }


});
