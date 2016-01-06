#!/bin/bash

function ap {
  cordova plugin add cordova-plugin-$1
}

ap app-version
ap battery-status
ap camera
ap console
ap contacts
ap crosswalk-webview
ap datepicker
ap device
ap dialogs
ap device-motion
ap device-orientation
ap flashlight
ap file
ap file-opener2
ap file-transfer
ap geolocation
ap globalization
ap media
ap media-capture
ap network-information
ap splashscreen
ap statusbar
ap vibration
ap x-toast

cordova plugin add ionic-plugin-keyboard												# keyboard
cordova plugin add https://github.com/phonegap/phonegap-plugin-barcodescanner.git		# barcode scanner
