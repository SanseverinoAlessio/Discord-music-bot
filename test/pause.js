const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const pause = require('../commands/pause.js');
const MusicPlayer = require('../music/musicPlayer.js');
var musicPlayer = new MusicPlayer();
describe('User pauses the bot',()=>{
  it('bot pauses',()=>{
    sinon.stub(musicPlayer,'pause').callsFake(sinon.fake());
    const message = {
      reply: sinon.fake(),
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      }
    }
    pause.run(message);
    sinon.assert.calledOnce(message.client.sessions.get);
    sinon.assert.calledOnce(musicPlayer.pause);
  });
});
