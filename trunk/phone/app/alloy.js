// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.appEngineIP = 'https://car-trace.appspot.com/_ah/api/';
Alloy.Globals.appVersion = '1.0';
Alloy.Globals.senderID = '283904388775';
Alloy.Globals.registerID = '';
Alloy.Globals.deviceID = Ti.Platform.id;

//=====define myPhoneInfo model=====
Alloy.Collections.myphones = Alloy.createCollection('myphones');
Alloy.Collections.myphones.fetch();

//=====define myMatches model=====
Alloy.Collections.mymatches = Alloy.createCollection('mymatches');
Alloy.Collections.mymatches.fetch();

Alloy.Globals.getValue = function(s, r, v) {
	var array = Alloy.Globals.ValueArray;
	var length = array.length;
	
	if (!_.isArray(array) || s >= array.length)
		return "none";	
	array = array[s];
	
	if(!_.isArray(array) || r >= array.length)
		return "none";
	array = array[r];
	
	if(!_.isArray(array) || v >= array.length)	
		return "none";
	var node = array[v];
	
	if(null == node)
		node = "none";
	
	return node;
};

//@formatter:off
Alloy.Globals.ValueArray =
[
  [
    ["-1", "0", "1"],
    ["50 Hz", "60Hz"],
    ["自動", "白熾燈", "日光", "螢光燈", "陰天", "鎢絲燈"],
    ["自動","關"]
  ],
  [
    ["1", "3", "5", "10"],
    ["0.5", "1", "2", "3", "5", "10", "15", "30", "60"],
    [""]
  ],
  [
    ["開車啟動", "手動啟動"],
    ["關", "錄滿循環", "2 min", "3 mins", "5 mins"],
    ["開", "關"],
    ["年/月/日", "月/日/年", "日/月/年"],
    ["上午/下午", "24時制"]
  ],
  [
    ["開", "關"],
    ["開", "關"],
    ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100"]
  ],
  [
    ["開", "關"],
    ["1", "2", "3"]
  ]
];
