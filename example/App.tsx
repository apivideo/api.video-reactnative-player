/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import ApiVideoPlayer from '@api.video/react-native-player';
import * as React from 'react';
import {
  StyleSheet,
  Text, View, Switch, Picker, Button
} from 'react-native';

const VIDEOS = [{
  id: "vi2BgDGC8r4sspRnMblc4WVX",
  title: "Street video"
},
{
  id: "vi2G6Qr8ZVE67dWLNymk7qbc",
  title: "Time video"
}];

type LabeledSwitchProps = {
  label: string,
  onPress: () => void,
  isOn: boolean,
};

// a switch button with a label
const LabeledSwitch = (props: LabeledSwitchProps) => (
  <View style={{ width: '33%', alignItems: 'center' }}>
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor="#f4f3f4"
      onValueChange={props.onPress}
      value={props.isOn}
    />
    <Text style={{ color: 'black' }}>{props.label}</Text>
  </View>)


const App: () => React$Node = () => {
  const [mute, setMute] = React.useState<boolean>(false);
  const [hideControls, setHideControls] = React.useState<boolean>(false);
  const [hideTitle, setHideTitle] = React.useState<boolean>(false);
  const [autoPlay, setAutoPlay] = React.useState<boolean>(true);
  const [loop, setLoop] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [events, setEvents] = React.useState<string[]>([]);
  const [eventsCount, setEventsCount] = React.useState<number>(1);
  const [videoId, setVideoId] = React.useState<string>(VIDEOS[0].id);
  const player = React.useRef(undefined as ApiVideoPlayer);


  // add a line to the list of events displayed in the app
  const logEvent = (event: string) => {
    const eventsCopy = [...events];
    if (eventsCopy.length > 5) eventsCopy.shift(); // we keep only the 6 last lines
    setEvents([...eventsCopy, `${eventsCount}. ${new Date().toLocaleTimeString()}: ${event}`]);
    setEventsCount(eventsCount + 1);
  }

  return (
    <>
      <View style={styles.view}>
        <ApiVideoPlayer
          // we keep a ref to be able to call the play() & pause() methods
          ref={(r) => (player.current = r)}
          videoId={videoId}
          hideControls={hideControls}
          hideTitle={hideTitle}
          muted={mute}
          autoplay={autoPlay}
          loop={loop}

          // update the current time displayed in the app 
          onTimeUpdate={(time) => setCurrentTime(time)}

          // on play/pause events, update the "isPlaying" state & log the event
          onPlay={() => { logEvent('play'); setIsPlaying(true) }}
          onPause={() => { logEvent('pause'); setIsPlaying(false); }}

          // when the following events are received, simply log them
          onControlsDisabled={() => logEvent('onControlsDisabled')}
          onControlsEnabled={() => logEvent('onControlsEnabled')}
          onEnded={() => logEvent('onEnded')}
          onError={() => logEvent('onError')}
          onFirstPlay={() => logEvent('onFirstPlay')}
          onFullScreenChange={() => logEvent('onFullScreenChange')}
          onPlayerResize={() => logEvent('onPlayerResize')}
          onQualityChange={() => logEvent('onQualityChange')}
          onRateChange={() => logEvent('onRateChange')}
          onReady={() => { setIsPlaying(false); logEvent('onReady'); }}
          onResize={() => logEvent('onResize')}
          onSeeking={() => logEvent('onSeeking')}
          onUserActive={() => logEvent('onUserActive')}
          onUserInactive={() => logEvent('onUserInactive')}
          onVolumeChange={() => logEvent('onVolumeChange')}
        />

      </View>


      <View style={styles.columnsContainer}>
        <LabeledSwitch
          label='mute'
          isOn={mute}
          onPress={() => setMute(!mute)}
        />
        <LabeledSwitch
          label='playing'
          isOn={isPlaying}
          onPress={() => { isPlaying ? player.current.pause() : player.current.play() }} />
        <LabeledSwitch
          label='loop'
          isOn={loop}
          onPress={() => setLoop(!loop)}
        />
      </View>
      <View style={styles.columnsContainer}>
        <LabeledSwitch
          label='hide controls'
          isOn={hideControls}
          onPress={() => setHideControls(!hideControls)}
        />
        <LabeledSwitch
          label='auto play'
          isOn={autoPlay}
          onPress={() => setAutoPlay(!autoPlay)}
        />
      </View>

      <View style={{ flex: 1 }}>
        {VIDEOS.map(video => <Button
          disabled={videoId === video.id}
          title={video.title}
          onPress={() => setVideoId(video.id)} />)}
      </View>

      <View
        style={{
          flex: 3,
          padding: 8,
          backgroundColor: '#00000050',
        }}
      >
        <Text style={{ color: 'white' }}>{`Current time: ${parseInt(`${currentTime * 100}`, 10) / 100}s`}</Text>

        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 20 }}>{`Events:`}</Text>
        {events.map(event => <Text key={event} style={{ color: 'white', fontSize: 12 }}>{event}</Text>)}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 2,
  },
  columnsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  }
});

export default App;
