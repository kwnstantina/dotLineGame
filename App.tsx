/**
 * Dot Line Game - React Native App
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import GameScreen from './src/screens/GameScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <GameScreen />
    </>
  );
}

export default App;
