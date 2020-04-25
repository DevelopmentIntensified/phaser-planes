module.exports = class Match{
  constructor(config){
    this.type = config.type;
    this.timer = 0;
    this.timelimit = config.timelimit;
    this.players = config.players;
    this.teams = {}
  }
}