const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const skip = require('../commands/skip.js');
const MusicPlayer = require('../music/musicPlayer.js');
var musicPlayer = new MusicPlayer();
describe('User skips current song',()=>{
  it('song is skipped',()=>{
    sinon.stub(musicPlayer,'nextMusic').callsFake(sinon.fake());
    const message = {
      reply: sinon.fake(),
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      }
    }
   skip.run(message);
   sinon.assert.calledOnce(message.client.sessions.get);
   sinon.assert.calledOnce(musicPlayer.nextMusic);
  });
});
