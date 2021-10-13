const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const resume = require('../commands/resume.js');
const MusicPlayer = require('../music/musicPlayer.js');
var musicPlayer = new MusicPlayer();
describe('user restarts the bot',()=>{
  it('bot resumes the current song',()=>{
    sinon.stub(musicPlayer,'resume').callsFake(sinon.fake());
    const message = {
      reply: sinon.fake(),
      client: {
        sessions: {
          get: sinon.fake.returns(musicPlayer),
        }
      }
    }
    resume.run(message);
    sinon.assert.calledOnce(message.client.sessions.get);
    sinon.assert.calledOnce(musicPlayer.resume);
  });
});
