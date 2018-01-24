import {NativeTransitionOptions} from '@ionic-native/native-page-transitions';

export class OptionsTransitions {
  optionsSlide: NativeTransitionOptions = {
    "direction": "up", // 'left|right|up|down', default 'left' (which is like 'next')
    "duration": 500, // in milliseconds (ms), default 400
    "slowdownfactor": 3, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
    "slidePixels": 20, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
    "iosdelay": 100, // ms to wait for the iOS webview to update before animation kicks in, default 60
    "androiddelay": 150, // same as above but for Android, default 70
    "winphonedelay": 250, // same as above but for Windows Phone, default 200,
    "fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    "fixedPixelsBottom": 60  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
  }

  optionsFlip: NativeTransitionOptions = {
    "direction": "up", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
    "duration": 600, // in milliseconds (ms), default 400
    "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
    "androiddelay": 100,  // same as above but for Android, default 70
    "winphonedelay": 150 // same as above but for Windows Phone, default 200
  };

  optionsFade: NativeTransitionOptions = {
    "duration": 600, // in milliseconds (ms), default 400
    "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
    "androiddelay": 100
  };

  optionsDrawer: NativeTransitionOptions = {
    "origin": "left", // 'left|right', open the drawer from this side of the view, default 'left'
    "action": "open", // 'open|close', default 'open', note that close is not behaving nicely on Crosswalk
    "duration": 300, // in milliseconds (ms), default 400
    "iosdelay": 50 // ms to wait for the iOS webview to update before animation kicks in, default 60
  };

  //SOLO IOS
  optionsCurl: NativeTransitionOptions = {
    "direction": "up", // 'up|down', default 'up'
    "duration": 600, // in milliseconds (ms), default 400
    "iosdelay": 50  // ms to wait for the iOS webview to update before animation kicks in, default 60
  };
}
