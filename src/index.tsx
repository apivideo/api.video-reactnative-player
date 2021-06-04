import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

const PLAYER_HOST = 'https://embed.api.video';
const DEFAULT_STYLE = { width: '100%', height: '100%' };
type PlayerState = {
  status: string;
};

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
  onQualityChange?: (resolution: { height: number; width: number }) => void;
  onRateChange?: () => void;
  onReady?: () => void;
  onResize?: () => void;
  onSeeking?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onUserActive?: () => void;
  onUserInactive?: () => void;
  onVolumeChange?: (volume: number) => void;
};

export default class ApiVideoPlayer extends Component<
  PlayerProps,
  PlayerState
> {
  webref?: WebView;
  /*
    constructor(props: Readonly<PlayerProps>) {
        super(props);
        this.webref = null;
    }*/

  play() {
    this.webref?.injectJavaScript(`player.play(); true;`);
  }
  pause() {
    this.webref?.injectJavaScript(`player.pause(); true;`);
  }
  requestFullscreen() {
    this.webref?.injectJavaScript(`player.requestFullscreen(); true;`);
  }
  mute() {
    this.webref?.injectJavaScript(`player.muted(true); true;`);
  }
  hideControls() {
    this.webref?.injectJavaScript(
      `apiVideoPlayer.setControlsVisibility(false); true;`
    );
  }
  showControls() {
    this.webref?.injectJavaScript(
      `apiVideoPlayer.setControlsVisibility(true); true;`
    );
  }
  seek(time: number) {
    if (isNaN(time)) throw new Error('Invalid time');

    this.webref?.injectJavaScript(
      `player.currentTime(player.currentTime() + ${time}); true;`
    );
  }
  setCurrentTime(time: number) {
    if (isNaN(time)) throw new Error('Invalid time');

    this.webref?.injectJavaScript(`player.currentTime(${time}); true;`);
  }
  setLoop(loop: boolean) {
    this.webref?.injectJavaScript(`player.loop(${!!loop}); true;`);
  }
  setPlaybackRate(rate: number) {
    if (isNaN(rate)) throw new Error('Invalid rate');

    this.webref?.injectJavaScript(`player.playbackRate(${rate}); true;`);
  }
  setVolume(volume: number) {
    if (isNaN(volume)) throw new Error('Invalid volume');

    this.webref?.injectJavaScript(`player.volume(${volume}); true;`);
  }
  unmute() {
    this.webref?.injectJavaScript(`player.muted(false); true;`);
  }

  private onMessage(message: any) {
    if (!message.type) {
      return;
    }
    switch (message.type) {
      case 'controlsdisabled':
        if (this.props.onControlsDisabled) this.props.onControlsDisabled();
        break;
      case 'controlsenabled':
        if (this.props.onControlsEnabled) this.props.onControlsEnabled();
        break;
      case 'ended':
        if (this.props.onEnded) this.props.onEnded();
        break;
      case 'error':
        if (this.props.onError) this.props.onError();
        break;
      case 'firstplay':
        if (this.props.onFirstPlay) this.props.onFirstPlay();
        break;
      case 'fullscreenchange':
        if (this.props.onFullScreenChange) this.props.onFullScreenChange();
        break;
      case 'pause':
        if (this.props.onPause) this.props.onPause();
        break;
      case 'play':
        if (this.props.onPlay) this.props.onPlay();
        break;
      case 'playerresize':
        if (this.props.onPlayerResize) this.props.onPlayerResize();
        break;
      case 'qualitychange':
        if (this.props.onQualityChange)
          this.props.onQualityChange(message.resolution);
        break;
      case 'ratechange':
        if (this.props.onRateChange) this.props.onRateChange();
        break;
      case 'ready':
        if (this.props.onReady) this.props.onReady();
        break;
      case 'resize':
        if (this.props.onResize) this.props.onResize();
        break;
      case 'seeking':
        if (this.props.onSeeking) this.props.onSeeking();
        break;
      case 'timeupdate':
        if (this.props.onTimeUpdate)
          this.props.onTimeUpdate(message.currentTime);
        break;
      case 'useractive':
        if (this.props.onUserActive) this.props.onUserActive();
        break;
      case 'userinactive':
        if (this.props.onUserInactive) this.props.onUserInactive();
        break;
      case 'volumechange':
        if (this.props.onVolumeChange)
          this.props.onVolumeChange(message.volume);
        break;
    }
  }

  private buildEmbedUrl() {
    const fragmentsMap = {
      hideControls: 'hide-controls',
      hideTitle: 'hide-title',
      autoplay: 'autoplay',
      loop: 'loop',
    };
    const fragments = Object.keys(fragmentsMap).filter(
      (fragment: string) => (this.props as any)[fragment] === true
    );

    let url = `${PLAYER_HOST}/${this.props.type || 'vod'}/${
      this.props.videoId
    }`;
    if (fragments.length > 0) {
      url +=
        '#' + fragments.map((f: any) => (fragmentsMap as any)[f]).join(';');
    }
    return url;
  }

  render() {
    return (
      <WebView
        ref={(r: any) => (this.webref = r)}
        source={{ uri: this.buildEmbedUrl() }}
        style={this.props.style || DEFAULT_STYLE}
        onMessage={(msg: any) =>
          this.onMessage(JSON.parse(msg.nativeEvent.data))
        }
        allowsInlineMediaPlayback={true}
        injectedJavaScriptBeforeContentLoaded={`window.addEventListener('message', (m) => window.ReactNativeWebView.postMessage(JSON.stringify(m.data)))`}
      />
    );
  }
}
