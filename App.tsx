/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import JailMonkey from 'jail-monkey'
import { Provider } from 'react-redux';
import { store } from './src/store';
import NotAuthorized from './src/screens/session/NotAuthorized';
import AppNavigator from './src/screens/navigators/AppNavigator';

type SectionProps = PropsWithChildren<{
  title: string;
}>;




function App(): JSX.Element {
  const [isRooted, setIsRooted] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    console.log("rooted", JailMonkey.isJailBroken())
    setIsRooted(JailMonkey.isJailBroken())
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    !isRooted ?
      <Provider store={store}>
        < AppNavigator />
      </Provider >
      :
      <NotAuthorized />
  );
}

export default App;
