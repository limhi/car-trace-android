var args = arguments[0] || {};
var isDebug = args.isDebug || true;

function myClick(e) {
  isDebug && Ti.API.info('in camera, in myClick, e = ' + JSON.stringify(e));
}
