const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const stop = require('../commands/stop.js');
const MusicPlayer = require('../music/musicPlayer.js');
var musicPlayer = new MusicPlayer();
describe('User stops current song',()=>{
  it('Song stops',()=>{
    sinon.stub(musicPlayer,'stop').callsFake(sinon.fake());
    const message = {
      reply: sinon.fake(),
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      }
    }
   stop.run(message);
   sinon.assert.calledOnce(message.client.sessions.get);
   sinon.assert.calledOnce(musicPlayer.stop);
  });
});
