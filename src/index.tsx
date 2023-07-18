import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

const PLAYER_HOST = 'https://embed.api.video';
const DEFAULT_STYLE = { width: '100%', height: '100%' };

export type PlayerProps = {
  videoId: string;
  privateToken?: string;
  sessionToken?: string;
  type?: 'vod' | 'live';
  hideControls?: boolean;
  hideTitle?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
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

const FRAGMENTS = {
  hideControls: 'hide-controls',
  hideTitle: 'hide-title',
  autoplay: 'autoplay',
  loop: 'loop',
};

export default class ApiVideoPlayer extends Component<PlayerProps, {}> {
  webref?: WebView;
  playerUrl: string;

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
  unmute() {
    this.webref?.injectJavaScript(`player.muted(false); true;`);
  }
  hideTitle() {
    this.webref?.injectJavaScript(`player.setTitleVisibility(false); true;`);
  }
  showTitle() {
    this.webref?.injectJavaScript(`player.setTitleVisibility(true); true;`);
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
  loadConfigFromUrl(url: string) {
    this.webref?.injectJavaScript(
      `apiVideoPlayer.loadConfigFromUrl('${url}'); true;`
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

  constructor(props: PlayerProps) {
    super(props);
    this.playerUrl = this.buildEmbedUrl(props);
  }

  componentDidUpdate(prevProps: PlayerProps) {
    if (
      typeof this.props.hideControls !== 'undefined' &&
      prevProps.hideControls !== this.props.hideControls
    ) {
      this.props.hideControls ? this.hideControls() : this.showControls();
    }
    if (
      typeof this.props.loop !== 'undefined' &&
      prevProps.loop !== this.props.loop
    ) {
      this.setLoop(this.props.loop);
    }
    if (
      typeof this.props.muted !== 'undefined' &&
      prevProps.muted !== this.props.muted
    ) {
      this.props.muted ? this.mute() : this.unmute();
    }
    if (
      typeof this.props.hideTitle !== 'undefined' &&
      prevProps.hideTitle !== this.props.hideTitle
    ) {
      this.props.hideTitle ? this.hideTitle() : this.showTitle();
    }
    if (
      typeof this.props.videoId !== 'undefined' &&
      prevProps.videoId !== this.props.videoId
    ) {
      this.loadConfigFromUrl(this.buildEmbedUrl(this.props));
    }
    if (
      typeof this.props.type !== 'undefined' &&
      prevProps.type !== this.props.type
    ) {
      this.loadConfigFromUrl(this.buildEmbedUrl(this.props));
    }
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

  buildQueryParameters(originalProps: any): string {
    if (
      'privateToken' in originalProps ||
      'sessionToken' in originalProps ||
      ('muted' in originalProps && originalProps.muted)
    ) {
      let query = '?';
      const keyToQueryParameMap: any = {
        privateToken: 'token',
        sessionToken: 'avh',
        muted: 'muted',
      };
      for (const key in originalProps) {
        if (
          key === 'privateToken' ||
          key === 'sessionToken' ||
          key === 'muted'
        ) {
          query += `${keyToQueryParameMap[key]}=${originalProps[key]}&`;
        }
      }
      return query;
    } else {
      return '';
    }
  }

  buildEmbedUrl(props: PlayerProps) {
    let url = `${PLAYER_HOST}/${this.props.type || 'vod'}/${props.videoId}`;

    url += this.buildQueryParameters(props);

    const fragments = Object.keys(FRAGMENTS).filter(
      (fragment: string) => (props as any)[fragment] === true
    );

    if (fragments.length > 0) {
      url += '#' + fragments.map((f: any) => (FRAGMENTS as any)[f]).join(';');
    }
    return url;
  }

  render() {
    return (
      <WebView
        ref={(r: any) => (this.webref = r)}
        source={{ uri: this.playerUrl }}
        style={this.props.style || DEFAULT_STYLE}
        scrollEnabled={false}
        onMessage={(msg: any) =>
          this.onMessage(JSON.parse(msg.nativeEvent.data))
        }
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScriptBeforeContentLoaded={`window.addEventListener('message', (m) => window.ReactNativeWebView.postMessage(JSON.stringify(m.data)))`}
      />
    );
  }
}
