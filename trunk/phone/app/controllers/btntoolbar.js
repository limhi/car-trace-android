var args = arguments[0] || {};

var isDebug = true;

var ct = require('common_ct');
ct.enableDebug();

var myphones = Alloy.Collections.myphones;
var mymatches = Alloy.Collections.mymatches;

// $.headerTitle.text = args.title || '';
// $.functionButton.visible = args.hideFunctionButton !== 'true';
// $.functionButton.title = args.functionTitle || '功能按鈕';tion fireFunctionEvent(e) {
//	$.trigger('rightFunction', e);
//}

// function doBack(e) {
// $.trigger('back', e);
// }

function doCamera(e) {
  Ti.API.info('in btntoolbar, doCamera');
  //alert("尚未實作 doCamera");

  isDebug && Ti.API.info('in btntoolbar, doCamera');
  var carid = '';
  var modelArray = mymatches.where({
    'selected' : 'Y'
  });
  if (modelArray.length > 0) {
    var mymatch = modelArray[0];
    isDebug && Ti.API.info('in btntoolbar, doCamera, mymatch = ' + JSON.stringify(mymatch));
    carid = mymatch.get('carID');
  }
  var phoneid = myphones.at(0).get('encodedKey');

  mySendPushNotification(carid, phoneid, "sendPicture", 'request for Picture', {
    "type" : "mytype",
    "data" : "mydata"
  });
}

function doSend(e) {
  Ti.API.info('in btntoolbar, doSend');
  //alert("尚未實作 doSend");
}

function doGPS(e) {
  Ti.API.info('in btntoolbar, doGPS');
  //alert("尚未實作 doGPS");

  isDebug && Ti.API.info('in btntoolbar, doGPS');
  var carid = '';
  var modelArray = mymatches.where({
    'selected' : 'Y'
  });
  if (modelArray.length > 0) {
    var mymatch = modelArray[0];
    isDebug && Ti.API.info('in btntoolbar, doGPS, mymatch = ' + JSON.stringify(mymatch));
    carid = mymatch.get('carID');
  }
  var phoneid = myphones.at(0).get('encodedKey');

  mySendPushNotification(carid, phoneid, "sendGPS", 'request for GPS', {
    "type" : "mytype",
    "data" : "mydata"
  });
}

function doTalk(e) {
  Ti.API.info('in btntoolbar, doTalk');
  //alert("尚未實作 doTalk");
}

function doSettings(e) {
  isDebug && Ti.API.info('in btntoolbar, doEditSettings');
  var settingsEditController = Alloy.createController('settings_split/settings_main', {
    isDebug : true
  });
  settingsEditController && settingsEditController.getView() && settingsEditController.getView().open();
}

function mySendPushNotification(carid, phoneid, title, message, rowdata) {
  isDebug && Ti.API.info('in btntoolbar, mySendPushNotification');

  isDebug && Ti.API.info('in btntoolbar->mySendPushNotification, carid = ' + JSON.stringify(carid));
  isDebug && Ti.API.info('in btntoolbar->mySendPushNotification, phoneid = ' + JSON.stringify(phoneid));
  isDebug && Ti.API.info('in btntoolbar->mySendPushNotification, title = ' + JSON.stringify(title));
  isDebug && Ti.API.info('in btntoolbar->mySendPushNotification, message = ' + JSON.stringify(message));
  isDebug && Ti.API.info('in btntoolbar->mySendPushNotification, rowdata = ' + JSON.stringify(rowdata));
  ct.pcpnMerge({
    data : {
      title : title,
      message : message,
      rowdata : rowdata,
      phoneid : phoneid,
      carid : carid
    },
    success : function(e) {
      isDebug && Ti.API.info('in btntoolbar->mySendPushNotification->pcpnMerge, success, message = ' + JSON.stringify(e));
      var messageid = e.messageID;
      isDebug && Ti.API.info('in btntoolbar->mySendPushNotification->pcpnMerge, success, messageid = ' + messageid);

      ct.pcpnSend({
        data : {
          phoneid : phoneid,
          messageid : messageid
        },
        success : function(ev) {
          isDebug && Ti.API.info('in btntoolbar->mySendPushNotification->pcpnMerge, success->pcpnSend, success, title = ' + title + ', message = ' + JSON.stringify(ev));
          //$.MessageTA.value = 'in btntoolbar->mySendPushNotification->pcpnMerge, success->pcpnSend, success, title = ' + title + ', message = ' + JSON.stringify(ev);
        },
        fail : function(ev) {
          Ti.API.error('in btntoolbar->mySendPushNotification->pcpnMerge, success->pcpnSend, fail, title = ' + title + ', message = ' + JSON.stringify(ev));
          //$.MessageTA.value = 'in btntoolbar->mySendPushNotification->pcpnMerge, success->pcpnSend, fail, title = ' + title + ', message = ' + JSON.stringify(ev);
        }
      });
    },
    fail : function(e) {
      Ti.API.error('in btntoolbar->mySendPushNotification->pcpnMerge, fail, title = ' + title + ', message = ' + JSON.stringify(m));
      //$.MessageTA.value += '\nin btntoolbar->mySendPushNotification->pcpnMerge, fail, title = ' + title + ', message = ' + JSON.stringify(m);
    }
  });
}
