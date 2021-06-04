![](https://github.com/apivideo/API_OAS_file/blob/master/apivideo_banner.png)
# @api.video/react-native-player
![npm](https://img.shields.io/npm/v/@api.video/react-native-player) ![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)

React Native video player to play vod and lives from api.video 

## Installation

```sh
npm install @api.video/react-native-player
```
or
```sh
yarn add @api.video/react-native-player
```
_Note: if you are on iOS, you will need this extra step:_
Install the native dependencies with Cocoapods
```sh
cd ios && pod install
```

## Usage

```jsx
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ApiVideoPlayer from '@api.video/react-native-player';

const App = () => {
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);

  return (
    <ApiVideoPlayer videoId="vi2G6Qr8ZVE67dWLNymk7qbc" />
  );
}

export default App;
```

## Props & Methods

```ts
// props:
type PlayerProps = {
    videoId: string;
    type?: 'vod' | 'live';
    hideControls?: boolean;
    hideTitle?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    style?: StyleProp<ViewStyle>;

    onControlsDisabled?: () => void;
    onControlsEnabled?: () => void;
    onEnded?: () => void;
    onError?: () => void;
    onFirstPlay?: () => void;
    onFullScreenChange?: () => void;
    onPause?: () => void;
    onPlay?: () => void;
    onPlayerResize?: () => void;
    onQualityChange?: (resolution: { height: number, width: number }) => void;
    onRateChange?: () => void;
    onReady?: () => void;
    onResize?: () => void;
    onSeeking?: () => void;
    onTimeUpdate?: ( currentTime: number ) => void;	
    onUserActive?: () => void;
    onUserInactive?: () => void;
    onVolumeChange?: ( volume: number ) => void;
}

// methods:
play(): void;
pause(): void;
requestFullscreen(): void;
mute(): void;
hideControls(): void;
showControls(): void;
seek(time: number): void;
setCurrentTime(time: number): void;
setLoop(loop: boolean): void;
setPlaybackRate(rate: number): void;
setVolume(volume: number): void;
unmute(): void;
```

### FAQ
If you have any questions, ask us here:  https://community.api.video .
Or use [Issues].

## License

MIT License
Copyright (c) 2021 api.video

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Issues]: <https://github.com/apivideo/react-native-player/issues>