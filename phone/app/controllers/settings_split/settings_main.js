var args = arguments[0] || {};

var isDebug = args.isDebug || 'true';
var controller;

function doserverlist(e) {
  // alert("serverlist");
  isDebug && Ti.API.debug('doserverlist');
  hideAllViews();
  resetAllLabelImages();
  $.serverlistV.show();
  $.serverlistI.backgroundImage = "/images/sh_set_ser_list_btn_down.png";
}

function docamera(e) {
  // alert("camera");
  isDebug && Ti.API.debug('docamera');
  hideAllViews();
  resetAllLabelImages();
  $.cameraV.show();
  $.cameraI.backgroundImage = "/images/sh_set_camera_btn_down.png";
}

function dosnapshot(e) {
  // alert("snapshot");
  isDebug && Ti.API.debug('dosnapshot');
  hideAllViews();
  resetAllLabelImages();
  $.snapshotV.show();
  $.snapshotI.backgroundImage = "/images/sh_set_snapshot_btn_down.png";
}

function dorecording(e) {
  // alert("recording");
  isDebug && Ti.API.debug('dorecording');
  hideAllViews();
  resetAllLabelImages();
  $.recordingV.show();
  $.recordingI.backgroundImage = "/images/sh_set_recording_btn_down.png";
}

function dogsensor(e) {
  // alert("gsensor");
  isDebug && Ti.API.debug('dogsensor');
  hideAllViews();
  resetAllLabelImages();
  $.gsensorV.show();
  $.gsensorI.backgroundImage = "/images/sh_set_gsensor_btn_down.png";
}

function doaudio(e) {
  // alert("audio");
  isDebug && Ti.API.debug('doaudio');
  hideAllViews();
  resetAllLabelImages();
  $.audioV.show();
  $.audioI.backgroundImage = "/images/sh_set_audio_btn_down.png";
}

function doclient(e) {
  // alert("client");
  isDebug && Ti.API.debug('doclient');
  hideAllViews();
  resetAllLabelImages();
  $.clientV.show();
  $.clientI.backgroundImage = "/images/sh_set_client_btn_down.png";
}

function doback(e) {
  isDebug && Ti.API.debug('doback');
  $.settings_main.close();
}

function hideAllViews() {
  $.serverlistV.hide();
  $.cameraV.hide();
  $.snapshotV.hide();
  $.recordingV.hide();
  $.gsensorV.hide();
  $.audioV.hide();
  $.clientV.hide();
}

function resetAllLabelImages() {
  $.serverlistI.backgroundImage = "/images/sh_set_ser_list_btn_nor.png";
  $.cameraI.backgroundImage = "/images/sh_set_camera_btn_nor.png";
  $.snapshotI.backgroundImage = "/images/sh_set_snapshot_btn_nor.png";
  $.recordingI.backgroundImage = "/images/sh_set_recording_btn_nor.png";
  $.gsensorI.backgroundImage = "/images/sh_set_gsensor_btn_nor.png";
  $.audioI.backgroundImage = "/images/sh_set_audio_btn_nor.png";
  $.clientI.backgroundImage = "/images/sh_set_client_btn_nor.png";
}

$.settings_main.addEventListener('open', function() {
  hideAllViews();
  resetAllLabelImages();
  $.serverlistV.show();
  $.serverlistI.backgroundImage = "/images/sh_set_ser_list_btn_down.png";
});

$.settings_main.open();
$.settings_main.addEventListener('androidback', function() {
  doback();
});

