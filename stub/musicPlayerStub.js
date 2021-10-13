const sinon = require('sinon');
const playerMethods =
{
  on: sinon.fake(),
  stop: sinon.fake(),
  play: sinon.fake(),
  pause: sinon.fake(),
  unpause: sinon.fake(),
};
const voiceChannelMethods = {
  subscribe: sinon.fake(),
  destroy: sinon.fake(),
};
const stub = {
  createAudioPlayer: sinon.fake.returns(playerMethods),
  joinVoiceChannel: sinon.fake.returns(voiceChannelMethods),
  createAudioResource: sinon.fake(),
};
const channelMethods = {
  send: sinon.fake(),
}
const clientStub = {
  sessions: {
    delete: sinon.fake(),
  },
  channels: {
    cache: {
      get: sinon.fake.returns(channelMethods),
    }
  }
}
class YouTube{
  constructor(){
  }
}
YouTube.prototype.searchVideos = sinon.fake.returns({
  link: 'link',
  title: 'title',
  duration: {
    hour: 0,
    minutes: 1,
    seconds: 30,
  }
});
function ytdl(data){
}
ytdl.validateURL = sinon.fake.returns(true);
module.exports = {
  playerMethods:playerMethods,
  voiceChannelMethods: voiceChannelMethods,
  stub: stub,
  clientStub: clientStub,
  channelMethods:channelMethods,
  YouTube: YouTube,
  ytdl: ytdl,
}
