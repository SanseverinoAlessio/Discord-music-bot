const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const play = require('../commands/play.js');
const MusicPlayer = require('../music/musicPlayer.js');
var musicPlayer = new MusicPlayer();
describe('Play a song',()=>{
  it('if the user is not in voice chat',()=>{
    let message = {
      client: {
        sessions: {
          get: sinon.fake(),
        }
      },
      reply: sinon.fake(),
      member:{
        voice:{
          channel:undefined
        }
      }
    }
    play.run(message);
    sinon.assert.calledOnce(message.client.sessions.get);
    sinon.assert.calledOnce(message.reply);
    sinon.assert.calledWith(message.reply,'Devi prima entrare in un canale vocale');
  });
  it('if the user is in voice chat, but the bot is disconnected',()=>{
    sinon.stub(musicPlayer,'joinIn').callsFake(sinon.fake());
    sinon.stub(musicPlayer,'findMusic').callsFake(sinon.fake());
    musicPlayer.voiceConnection = {
      _state:{
        status:'signalling',
      },
      packets: {
        state:{
          channel_id: 'simpleId',
        }
      }
    }
    let message = {
      guild:{
        id: 'id',
        voiceAdapterCreator: '',
      },
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      },
      reply: sinon.fake(),
      member:{
        voice:{
          channel:{
            id:'simpleId',
          }
        }
      }
    }
    play.run(message);
    sinon.assert.calledOnce(message.client.sessions.get);
    sinon.assert.calledOnce(musicPlayer.findMusic);
  });
  it('If the user is in another voice chat',()=>{
    musicPlayer.voiceConnection = {
      _state:{
        status:'ready',
      },
      packets: {
        state:{
          channel_id: 'differentId',
        }
      }
    }
    let message = {
      guild:{
        id: 'id',
        voiceAdapterCreator: '',
      },
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      },
      reply: sinon.fake(),
      member:{
        voice:{
          channel:{
            id:'simpleId',
          }
        }
      }
    }
    play.run(message);
    sinon.assert.calledOnce(message.client.sessions.get);
    sinon.assert.calledOnce(message.reply);
    sinon.assert.calledWith(message.reply,{embeds: [{
      color: 'edda0c',
      title: '',
      description: "Sono già in un altro canale vocale",
    }]});
  });
});
