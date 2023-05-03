import * as React from 'react';
import {StyleSheet, StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigator from './navigation';

const AppMain = () => {
  return (
    <GestureHandlerRootView style={style.gestureHandlerRootView}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const style = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
  },
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppMain />
      </SafeAreaProvider>
    </>
  );
};

export default App;
