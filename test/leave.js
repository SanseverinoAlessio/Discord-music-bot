const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const leave = require('../commands/leave.js');
const MusicPlayer = require('../music/musicPlayer.js');
var musicPlayer = new MusicPlayer();
describe('User remove the bot from voice chat',()=>{
  it('if the bot leaves',()=>{
    sinon.stub(musicPlayer,'leave').callsFake(sinon.fake());
    musicPlayer.voiceConnection = {
      _state:{
        status:'ready',
      },
      packets: {
        state:{
          channel_id: 'simpleId',
        }
      }
    }
    const message = {
      reply: sinon.fake(),
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      }
    }
    leave.run(message);
    sinon.assert.calledOnce(message.client.sessions.get);
    sinon.assert.calledOnce(musicPlayer.leave);
  });
  it("if the bot isn't in voice chat",()=>{
    const message = {
      reply: sinon.fake(),
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      }
    }
    musicPlayer.voiceConnection = '';
    leave.run(message);
    sinon.assert.calledOnce(message.client.sessions.get);
    sinon.assert.calledOnce(message.reply);
    sinon.assert.calledWith(message.reply,{embeds:[{
      color:"c91400",
      description: "Il bot non si trova in alcun canale vocale",
    }]});
  });
});
