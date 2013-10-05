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

