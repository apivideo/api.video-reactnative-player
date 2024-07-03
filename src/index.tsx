import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type Ref,
} from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

const PLAYER_HOST = 'https://embed.api.video';
const DEFAULT_STYLE: StyleProp<ViewStyle> = { width: '100%', height: '100%' };

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
  onDurationChange?: (duration: number) => void;
  onVideoSizeRatioChange?: (ratio: number) => void;
  onRatioChange?: (ratio: number) => void;

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

export interface ApiVideoPlayerRef {
  play: () => void;
  pause: () => void;
  requestFullscreen: () => void;
  mute: () => void;
  unmute: () => void;
  hideTitle: () => void;
  showTitle: () => void;
  hideControls: () => void;
  showControls: () => void;
  loadConfigFromUrl: (url: string) => void;
  seek: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setLoop: (loop: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
}

const ApiVideoPlayer = forwardRef(
  (props: PlayerProps, ref: Ref<ApiVideoPlayerRef>) => {
    const webref = useRef<WebView>(null);
    const [playerUrl, setPlayerUrl] = React.useState<string>('');
    const [ratio, setRatio] = React.useState<number>();

    const buildQueryParameters = (originalProps: any): string => {
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
    };

    useEffect(() => {
      setPlayerUrl(buildEmbedUrl(props));
    }, [props.videoId, props.type]);

    const buildEmbedUrl = (props: PlayerProps) => {
      let url = `${PLAYER_HOST}/${props.type || 'vod'}/${props.videoId}`;
      url += buildQueryParameters(props);
      const fragments = Object.keys(FRAGMENTS).filter(
        (fragment: string) => (props as any)[fragment] === true
      );
      if (fragments.length > 0) {
        url += '#' + fragments.map((f: any) => (FRAGMENTS as any)[f]).join(';');
      }
      return url;
    };

    const injectJavaScript = (script: string) => {
      webref.current?.injectJavaScript(`${script} true;`);
    };

    useImperativeHandle(ref, () => ({
      play: () => injectJavaScript('player.play();'),
      pause: () => injectJavaScript('player.pause();'),
      requestFullscreen: () => injectJavaScript('player.requestFullscreen();'),
      mute: () => injectJavaScript('player.muted(true);'),
      unmute: () => injectJavaScript('player.muted(false);'),
      hideTitle: () => injectJavaScript('player.setTitleVisibility(false);'),
      showTitle: () => injectJavaScript('player.setTitleVisibility(true);'),
      hideControls: () =>
        injectJavaScript('apiVideoPlayer.setControlsVisibility(false);'),
      showControls: () =>
        injectJavaScript('apiVideoPlayer.setControlsVisibility(true);'),
      loadConfigFromUrl: (url: string) =>
        injectJavaScript(`apiVideoPlayer.loadConfigFromUrl('${url}');`),
      seek: (time: number) => {
        if (isNaN(time)) throw new Error('Invalid time');
        injectJavaScript(`player.currentTime(player.currentTime() + ${time});`);
      },
      setCurrentTime: (time: number) => {
        if (isNaN(time)) throw new Error('Invalid time');
        injectJavaScript(`player.currentTime(${time});`);
      },
      setLoop: (loop: boolean) => injectJavaScript(`player.loop(${!!loop});`),
      setPlaybackRate: (rate: number) => {
        if (isNaN(rate)) throw new Error('Invalid rate');
        injectJavaScript(`player.playbackRate(${rate});`);
      },
      setVolume: (volume: number) => {
        if (isNaN(volume)) throw new Error('Invalid volume');
        injectJavaScript(`player.volume(${volume});`);
      },
    }));

    useEffect(() => {
      if (props.hideControls !== undefined) {
        props.hideControls
          ? injectJavaScript('apiVideoPlayer.setControlsVisibility(false);')
          : injectJavaScript('apiVideoPlayer.setControlsVisibility(true);');
      }
    }, [props.hideControls]);

    useEffect(() => {
      if (props.loop !== undefined) {
        injectJavaScript(`player.loop(${props.loop});`);
      }
    }, [props.loop]);

    useEffect(() => {
      if (props.muted !== undefined) {
        props.muted
          ? injectJavaScript('player.muted(true);')
          : injectJavaScript('player.muted(false);');
      }
    }, [props.muted]);

    useEffect(() => {
      if (props.hideTitle !== undefined) {
        props.hideTitle
          ? injectJavaScript('player.setTitleVisibility(false);')
          : injectJavaScript('player.setTitleVisibility(true);');
      }
    }, [props.hideTitle]);

    useEffect(() => {
      if (props.videoId !== undefined || props.type !== undefined) {
        injectJavaScript(
          `apiVideoPlayer.loadConfigFromUrl('${buildEmbedUrl(props)}');`
        );
      }
    }, [props.videoId, props.type]);

    const onMessage = (message: any) => {
      if (!message.type) return;
      switch (message.type) {
        case 'controlsdisabled':
          props.onControlsDisabled && props.onControlsDisabled();
          break;
        case 'controlsenabled':
          props.onControlsEnabled && props.onControlsEnabled();
          break;
        case 'ended':
          props.onEnded && props.onEnded();
          break;
        case 'error':
          props.onError && props.onError();
          break;
        case 'firstplay':
          props.onFirstPlay && props.onFirstPlay();
          break;
        case 'fullscreenchange':
          props.onFullScreenChange && props.onFullScreenChange();
          break;
        case 'pause':
          props.onPause && props.onPause();
          break;
        case 'play':
          props.onPlay && props.onPlay();
          break;
        case 'playerresize':
          props.onPlayerResize && props.onPlayerResize();
          break;
        case 'qualitychange':
          if (message.resolution.height) {
            const newRatio =
              message.resolution.width / message.resolution.height;
            if (newRatio !== ratio) {
              setRatio(newRatio);
              props.onRatioChange && props.onRatioChange(newRatio);
            }
          }
          props.onQualityChange && props.onQualityChange(message.resolution);
          break;
        case 'ratechange':
          props.onRateChange && props.onRateChange();
          break;
        case 'ready':
          props.onReady && props.onReady();
          break;
        case 'resize':
          props.onResize && props.onResize();
          break;
        case 'seeking':
          props.onSeeking && props.onSeeking();
          break;
        case 'timeupdate':
          props.onTimeUpdate && props.onTimeUpdate(message.currentTime);
          break;
        case 'useractive':
          props.onUserActive && props.onUserActive();
          break;
        case 'userinactive':
          props.onUserInactive && props.onUserInactive();
          break;
        case 'volumechange':
          props.onVolumeChange && props.onVolumeChange(message.volume);
          break;
        default:
          break;
      }
    };

    return playerUrl ? (
      <WebView
        ref={webref}
        source={{ uri: playerUrl }}
        style={props.style || DEFAULT_STYLE}
        scrollEnabled={false}
        onMessage={(msg) => onMessage(JSON.parse(msg.nativeEvent.data))}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScriptBeforeContentLoaded={`window.addEventListener('message', (m) => window.ReactNativeWebView.postMessage(JSON.stringify(m.data)))`}
      />
    ) : null;
  }
);

export default ApiVideoPlayer;
