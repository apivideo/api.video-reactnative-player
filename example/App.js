/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';
import ApiVideoPlayer from '@api.video/react-native-player';

const App: () => React$Node = () => {
  return (
    <>
      <View style={styles.view}>
        <ApiVideoPlayer
          ref={(r) => (this.player = r)}
          muted={true}
          videoId="vi2G6Qr8ZVE67dWLNymk7qbc" />

        <Button onPress={() => this.player.play()} title="Play" />
        <Button onPress={() => this.player.pause()} title="Pause" />

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
