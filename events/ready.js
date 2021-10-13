const event = require('../event.js');

module.exports = new event({
  name: 'ready',
  once: true,
  execute: ()=>{
    console.log('Il bot è stato avviato!');
    return true;
  }
})
