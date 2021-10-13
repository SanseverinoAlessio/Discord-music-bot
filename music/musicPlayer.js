const ytdl = require('ytdl-core');
const client = require('../client.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus} = require('@discordjs/voice');
  const isUrl = require("is-valid-http-url");
  const YouTube = require("discord-youtube-api");
  const youtube = new YouTube(process.env.youtubeapikey);
  class musicPlayer{
    constructor(data){
      this.timeBeforeLeft = 60 * 1000;
      this.voiceConnection;
      this.player = createAudioPlayer();
      this.queue = [];
      this.resource;
      this.channelId;
      this.guildId;
      this.timeout;
      this.events();
    }
    events(){
     this.player.on('idle',this.nextMusic.bind(this));
      this.player.on('error',(err)=>{
        console.error(err);
      });
    }
    nextMusic(){
      if(this.queue.length <= 0) {
        this.player.stop();
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
          this.leave();
          client.channels.cache.get(this.channelId).send({
            embeds: [{
              color: 'c91400',
              title:'Disconnesso',
              description: "Mi sono disconnesso per inattività!",
            }],
          });
        }, this.timeBeforeLeft);
        return;
      }
      this.setResource();
      this.playMusic();
    }
    leave(){
      client.sessions.delete(this.guildId);
      this.voiceConnection.destroy();
      this.queue = [];
    }
    pause(message){
      this.player.pause();
      message.reply({embeds:[{
        color:"c91400",
        description: "Riproduzione in pausa. Per riprendere digitare !resume",
      }]});
    }
    resume(message){
      this.player.unpause();
      message.reply({embeds:[{
        color:"2bbf0a",
        description: "Riprendo la riproduzione!",
      }]});
    }
    joinIn(data){
      this.player.stop();
      this.queue = [];
      this.guildId = data.guildId;
      this.voiceConnection = joinVoiceChannel({
        channelId: data.channelId,
        guildId: data.guildId,
        adapterCreator: data.voiceAdapterCreator
      });
      this.voiceConnection.subscribe(this.player);
    }
    async findMusic(message){
      this.channelId = message.channelId;
      let query = message.content.split(' ');
      query.shift();
      query = query.join(' ');
      try{
        let video = await youtube.searchVideos(query);
        this.queue.push({
          link: video.url,
          query: query,
          title: video.title,
          duration: video.duration.minutes + ':' + video.duration.seconds,
        });
        this.setNewMusic(message);
      }
      catch(e){
        console.error(e);
        return;
      }
    }
    setNewMusic(message){
      if(!ytdl.validateURL(this.queue[0].link)){
        return;
      }
      if(this.player._state.status == 'playing'){
        message.reply({
          embeds:[{
            color: '2bbf0a',
            title: "Brano aggiunto alla coda",
            description: this.queue[this.queue.length -1].title,
            fields:[{
              name: 'Durata:',
              value: this.queue[this.queue.length -1].duration,
            }]
          }]
        });
        return;
      }
      this.setResource();
      this.playMusic();
    }
    setResource(title){
      client.channels.cache.get(this.channelId).send({
        embeds:[{
          color: '2bbf0a',
          title: 'Brano cercato: ' + this.queue[0].query,
          description: 'Sto avviando: ' + this.queue[0].title,
          fields:[{
            name: 'Durata:',
            value: this.queue[0].duration,
          }]
        }]
      });
      this.resource = createAudioResource(ytdl(this.queue[0].link,{
        filter: 'audioonly',
        quality: 'highestaudio',
      }));
      this.queue.shift();
    }
    stop(message){
      if(this.player._state.status != 'playing'){
        message.reply('Attualmente non è in riproduzione alcuna traccia audio!');
        return;
      }
      this.player.stop();
      this.queue = [];
      message.reply('Riproduzione interrotta!');
    }
    playMusic(){
      clearTimeout(this.timeout);
      console.log('avviato ora');
      console.log(this.timeout);
      this.player.play(this.resource);
    }
  }
  module.exports = musicPlayer;
