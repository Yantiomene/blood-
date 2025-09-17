const wkx = require('wkx');

const wkbValue = '0101000020E61000000000000000002A40000000000000F03F';

const point = wkx.Geometry.parse(Buffer.from(wkbValue, 'hex'));

const latitude = point.y;
const longitude = point.x;

console.log('Latitude:', latitude);
console.log('Longitude:', longitude);
