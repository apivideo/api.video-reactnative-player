/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Text,
} from 'react-native';
import ApiVideoPlayer from '@api.video/react-native-player';



const App: () => React$Node = () => {
var muteTitle = "mute"
const [mute, setMute] = React.useState<true | false>(false);
const [hideControls, setHideControls] = React.useState<true | false>(false);
const [hideTitle, setHideTitle] = React.useState<true | false>(false);
const [actions, setActions] = React.useState<'play' | 'pause'>('pause');
const [autoPlay, setAutoPlay] = React.useState<true | false>(false);
const [loop, setLoop] = React.useState<true | false>(false);
  return (
    <>
      <View style={styles.view}>
        <ApiVideoPlayer
          ref={(r) => (this.player = r)}
          videoId="vi7UI8yyf9QUO0EMy5wExsj0"
          hideControls={hideControls}
          hideTitle={true}
          muted={mute}
          loop={loop}
        />

      </View>
      <View
        style={{
          padding: 8,
          backgroundColor: '#00000050',
        }}
      >
        <Text style={{ color: 'white' }}>{`Current Settings:`}</Text>
        <Text style={{ color: 'white' }}>{`Action: ${actions}`}</Text>
        <Text style={{ color: 'white' }}>{`Hide controls: ${hideControls}`}</Text>
        <Text style={{ color: 'white' }}>{`Hide title: ${hideTitle}`}</Text>
        <Text style={{ color: 'white' }}>{`Muted: ${mute}`}</Text>
        <Text style={{ color: 'white' }}>{`Auto play: ${autoPlay}`}</Text>
        <Text style={{ color: 'white' }}>{`Loop: ${loop}`}</Text>
      </View>
      <View style={{ position: 'absolute', bottom: 40, right: 20 }}>
        <Text style={{ color: 'black' }}>{`Hide Controls`}</Text>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: 'blue',
            width: 50,
            height: 50,
          }}
          onPress={() => {
            if (hideControls) {
              setHideControls(false);
            } else {
              setHideControls(true);
            }
          }}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 40, left: 20 }}>
        <Text style={{ color: 'black' }}>{`Mute`}</Text>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: 'yellow',
            width: 50,
            height: 50,
          }}
          onPress={() => {
            if (mute === true) {
              setMute(false);
              //this.player.mute();
              muteTitle = "Unmute";
            } else {
              setMute(true);
              //this.player.unmute();
              muteTitle = "Mute";
            }
          }}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 110, right: 20 }}>
      <Text style={{ color: 'black' }}>{actions}</Text>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: 'green',
            width: 50,
            height: 50,
          }}
          onPress={() => {
            if (actions === 'pause') {
              this.player.play()
              setActions('play');
            } else {
              this.player.pause()
              setActions('pause');
            }
          }}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 110, left: 20 }}>
      <Text style={{ color: 'black' }}>{'Hide Title'}</Text>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: 'purple',
            width: 50,
            height: 50,
          }}
          onPress={() => {
            if (hideTitle === true) {
              setHideTitle(false);
            } else {
              setHideTitle(true);
            }
          }}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 180, left: 20 }}>
      <Text style={{ color: 'black' }}>{'Auto Play'}</Text>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: 'orange',
            width: 50,
            height: 50,
          }}
          onPress={() => {
            if (autoPlay === true) {
              setAutoPlay(false);
            } else {
              setAutoPlay(true);
            }
          }}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 180, right: 20 }}>
      <Text style={{ color: 'black' }}>{'Loop'}</Text>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: 'red',
            width: 50,
            height: 50,
          }}
          onPress={() => {
            if (loop === true) {
              setLoop(false);
            } else {
              setLoop(true);
            }
          }}
        />
      </View>
    </>
  );
};



const styles = StyleSheet.create({
  view: {
    flex: 0.5,
  },
});

export default App;
