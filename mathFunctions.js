function random(min, max) {
  max -= min;
  return Math.random() * max + min;
}

var dist = function(x1,y1,x2,y2){
   return Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2));
}

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

function d2r(degrees) {
  return (degrees / 180) * Math.PI;
}

function r2d(degrees) {
  return (degrees * 180) / Math.PI;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports =  {random:random,dist:dist,lerp:lerp,d2r:d2r,r2d:r2d,getRandomInt:getRandomInt}