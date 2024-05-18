const Buffer = require('buffer').Buffer;
window.Buffer = Buffer;
var wkx = require('wkx');


export const convertGeoToPoint = (geo) => {
    if (geo === undefined || !geo) {
        return [0, 0];
    }
    const point = wkx.Geometry.parse(Buffer.from(geo, 'hex'));
    return [point.x, point.y]; // { longitude: y, latitude: x }
}