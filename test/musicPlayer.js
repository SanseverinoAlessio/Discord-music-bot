const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
let message = {};
proxyquire.noCallThru();
const {playerMethods,
  voiceChannelMethods,
  stub,
  channelMethods,
  clientStub,
  YouTube,
  ytdl} = require('../stub/musicPlayerStub');
  const MusicPlayer = proxyquire('../music/musicPlayer',{'@discordjs/voice':stub,
  '../client.js':clientStub,
  'discord-youtube-api':YouTube,
  'ytdl-core':ytdl
});
var musicPlayer;
describe('Test the musicPlayer logic',()=>{
  beforeEach(()=>{
    message.reply = sinon.fake();
    musicPlayer = new MusicPlayer();
    musicPlayer.player = playerMethods;
    musicPlayer.voiceConnection = voiceChannelMethods;
  });
  afterEach(()=>{
    sinon.reset();
  });
  it('Join',()=>{
    musicPlayer.joinIn({
      channelId: 'channelId',
      guildId: 'guildId',
      voiceAdapterCreator: sinon.fake()
    });
    expect(musicPlayer.queue).to.have.lengthOf(0);
    sinon.assert.calledOnce(musicPlayer.player.stop);
    sinon.assert.calledOnce(stub.joinVoiceChannel);
    sinon.assert.calledOnce(musicPlayer.voiceConnection.subscribe);
  });
  it('leave',()=>{
    musicPlayer.leave();
    expect(musicPlayer.queue).to.have.lengthOf(0);
    sinon.assert.calledOnce(clientStub.sessions.delete);
    sinon.assert.calledOnce(musicPlayer.voiceConnection.destroy);
  });
  it("Stop if there isn't current song",()=>{
    musicPlayer.player = {
      _state:{
        status: 'idle',
      }
    }
    musicPlayer.stop(message);
    sinon.assert.calledWith(message.reply,'Attualmente non è in riproduzione alcuna traccia audio!');
  });

  it('Stop if there is a current song',()=>{
    musicPlayer.player._state =
    {
      status: 'playing',
    };
    musicPlayer.stop(message);
    sinon.assert.calledOnce(musicPlayer.player.stop);
    sinon.assert.calledOnce(message.reply)
    sinon.assert.calledWith(message.reply,'Riproduzione interrotta!');
  });
  it('setResource',()=>{
    let song =
    {
      query: 'query',
      title: 'title',
      duration: 'duration',
      link: 'link',
    }
    musicPlayer.queue.push(song);
    musicPlayer.setResource();
    sinon.assert.calledOnce(clientStub.channels.cache.get);
    sinon.assert.calledOnce(channelMethods.send);
    sinon.assert.calledWith(channelMethods.send,{embeds:[{
      color: '2bbf0a',
      title: 'Brano cercato: ' + song.query,
      description: 'Sto avviando: ' + song.title,
      fields:[{
        name: 'Durata:',
        value: song.duration,
      }]
    }]});
    expect(musicPlayer.queue).to.have.lengthOf(0);
  });
  it('Play music',()=>{
    musicPlayer.playMusic();
    sinon.assert.calledOnce(playerMethods.play);
  });
  it('Pause',()=>{
    musicPlayer.pause(message);
    sinon.assert.calledOnce(playerMethods.pause);
    sinon.assert.calledOnce(message.reply);
    sinon.assert.calledWith(message.reply,{embeds:[{
      color:"c91400",
      description: "Riproduzione in pausa. Per riprendere digitare !resume",
    }]});
  });
  it('Resume',()=>{
    musicPlayer.resume(message);
    sinon.assert.calledOnce(playerMethods.unpause);
    sinon.assert.calledOnce(message.reply);
    sinon.assert.calledWith(message.reply,{embeds:[{
      color:"2bbf0a",
      description: "Riprendo la riproduzione!",
    }]});
  });
  it('findMusic',async ()=>{
    message.channelId = 'id';
    message.content = '!play music';
    sinon.stub(musicPlayer,'setNewMusic').callsFake(sinon.fake());
    await musicPlayer.findMusic(message);
    sinon.assert.calledOnce(YouTube.prototype.searchVideos);
    sinon.assert.calledWith(YouTube.prototype.searchVideos,'music');
    expect(musicPlayer.queue).to.have.lengthOf(1);
    sinon.assert.calledOnce(musicPlayer.setNewMusic);
  });
  it('setNewMusic if there is a song playing',()=>{
    musicPlayer.queue = [{
      query: 'query',
      title: 'title',
      duration: 'duration',
      link: 'link',
    },
    {
      query: 'query',
      title: 'title',
      duration: 'duration',
      link: 'link',
    }
  ];
  musicPlayer.player = {
    _state: {
      status: 'playing',
    }
  }
  musicPlayer.setNewMusic(message);
  sinon.assert.calledOnce(ytdl.validateURL);
  sinon.assert.calledOnce(message.reply);
  sinon.assert.calledWith(message.reply,{
    embeds:[{
      color: '2bbf0a',
      title: "Brano aggiunto alla coda",
      description: musicPlayer.queue[musicPlayer.queue.length -1].title,
      fields:[{
        name: 'Durata:',
        value: musicPlayer.queue[musicPlayer.queue.length -1].duration,
      }]
    }]
  });
});
it('setNewMusic if there isn\'t a song playing',()=>{
  sinon.stub(musicPlayer,'setResource').callsFake(sinon.fake());
  sinon.stub(musicPlayer,'playMusic').callsFake(sinon.fake());
  musicPlayer.queue.push({
    query: 'query',
    title: 'title',
    duration: 'duration',
    link: 'link',
  });
  musicPlayer.player = {
    _state: {
      status: 'ready',
    }
  }
  musicPlayer.setNewMusic(message);
  sinon.assert.calledOnce(ytdl.validateURL);
  sinon.assert.calledOnce(musicPlayer.setResource);
  sinon.assert.calledOnce(musicPlayer.playMusic);
});
it('nextMusic if there isn\'t a song after current',function(done){
  sinon.stub(musicPlayer,'leave').callsFake(sinon.fake());
  musicPlayer.timeBeforeLeft = 1;
  musicPlayer.nextMusic();
  sinon.assert.calledOnce(musicPlayer.player.stop);
  setTimeout(()=>{
    sinon.assert.calledOnce(musicPlayer.leave);
    sinon.assert.calledOnce(channelMethods.send);
    sinon.assert.calledWith(channelMethods.send,{
      embeds: [{
        color: 'c91400',
        title:'Disconnesso',
        description: "Mi sono disconnesso per inattività!",
      }]});
        done();
    },1);
  });
  it('nextMusic if there is a song after current',function(){
    musicPlayer.queue.push({
      query: 'query',
      title: 'title',
      duration: 'duration',
      link: 'link'
    });
    sinon.stub(musicPlayer,'setResource').callsFake(sinon.fake());
    sinon.stub(musicPlayer,'playMusic').callsFake(sinon.fake());
    musicPlayer.nextMusic();
    sinon.assert.calledOnce(musicPlayer.setResource);
    sinon.assert.calledOnce(musicPlayer.playMusic);
    expect(musicPlayer.queue).to.have.lengthOf(1);
  });
});
