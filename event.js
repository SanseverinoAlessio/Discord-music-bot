class event {
  constructor(data){
    this.name = data.name;
    this.once = data.once;
    this.execute = data.execute;
  }
}


module.exports = event;
