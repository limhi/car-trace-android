var args = arguments[0] || {};

var isDebug = args.isDebug || true;
var ct = require('common_ct');
ct.enableDebug();
var dbmatch = require('common_db_match');
dbmatch.enableDebug();
var myphones = Alloy.Collections.myphones;
var mymatches = Alloy.Collections.mymatches;

function doDownloadSettings(e) {
  Ti.API.info('in serverlist, doDownloadSettings');
  alert("尚未實作 doDownloadSettings");
}

function doEditSettings(e) {
  isDebug && Ti.API.info('in serverlist, doEditSettings');
  var settingsEditController = Alloy.createController('settings/settings_table', {
    isDebug : true
  });
  settingsEditController && settingsEditController.getView() && settingsEditController.getView().open();
  //alert("尚未實作 doEditSettings");
}

function doUploadSettings(e) {
  Ti.API.info('in serverlist, doUploadSettings');
  alert("尚未實作 doUploadSettings");
}

function doAddItemAD(e) {
  Ti.API.info('in serverlist, doAddItemAD');
  //alert("尚未實作 doAddItemAD");
  $.AddItemAD.show();
}

function doADOk(e) {
  //alert("尚未實作 doADOk");
  Ti.API.info('in serverlist, doADOk');
  Ti.API.info('in serverlist, ad_shownameTF = ' + $.ad_shownameTF.value + //
  ', ad_carcodeTF = ' + $.ad_carcodeTF.value);

  var randomid = $.ad_carcodeTF.value;
  if (randomid.length === 0) {
    alert("please enter random id first!");
    return;
  }

  var inputCheck = false;

  var showname = $.ad_shownameTF.value;
  if (showname.length !== 0) {
    inputCheck = true;
  }
  var showcarnum = $.ad_showcarnumTF.value;
  if (showcarnum.length !== 0) {
    inputCheck = true;
  }

  if (!inputCheck) {
    alert("please enter showname or showcarnum first!");
    return;
  }

  $.AddItemAD.hide();
  doMatch(e);
}

function doMatch(e) {
  isDebug && Ti.API.info('in serverlist, doMatch');
  myphones.fetch();
  if (myphones.length !== 1) {
    alert("register first!");
    return;
  }

  var randomid = $.ad_carcodeTF.value;
  var showname = $.ad_shownameTF.value;
  var showcarnum = $.ad_showcarnumTF.value;

  var myphone = myphones.at(0);
  ct.cprandomMatch({
    data : {
      phoneid : myphone.get('encodedKey'),
      randomid : randomid
    },
    success : function(m) {
      isDebug && Ti.API.info('in serverlist, in doMatch, success, message = ' + JSON.stringify(m));
      mymatches.fetch();
      var modelArray = mymatches.where({
        phoneID : m.phoneID,
        carID : m.carID
      });
      isDebug && Ti.API.info('in serverlist, in doMatch, success, modelArray.length = ' + modelArray.length);
      //如果還沒連結過
      if (_.isArray(modelArray) && modelArray.length === 0) {
        var selected = 'N';
        if (mymatches.length === 0)
          selected = 'Y';

        dbmatch.addItem(mymatches, {
          encodedKey : m.encodedKey,
          carID : m.carID,
          phoneID : m.phoneID,
          selected : selected,
          showname : showname,
          showcarnum : showcarnum,
          addTime : m.addTime,
          modTime : m.modTime
        });
        //updateUI();
      }
      //$.ShowTF.value = '配對成功';
      $.ad_carcodeTF.value = '';
    },
    fail : function(m) {
      Ti.API.error('in serverlist, in doMatch, fail, message = ' + JSON.stringify(m));
      //$.ShowTF.value = '配對失敗';
    }
  });
}

function transformData(model) {
  var attrs = model.toJSON();
  Ti.API.info('in serverlist, in transformData, model = ' + JSON.stringify(model));
  // attrs.imageUrl = '/' + attrs.direction + '.png';
  // attrs.upperCaseName = attrs.name.toUpperCase();
  return attrs;
}

// function myback() {
// $.serverlist.close();
// }
//
// $.serverlistVV.addEventListener('androidback', function() {
// myback();
// });

updateUI();
