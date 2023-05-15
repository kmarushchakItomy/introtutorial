import React, {FunctionComponent} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from './types';

import Main from '../screens/Main';
import IntroGuideScreen from '../screens/IntroGuide';
import CircularLoaderScreen from '../screens/CircularLoader';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator: FunctionComponent = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        orientation: 'portrait',
      }}>
      <RootStack.Screen
        key={'Main'}
        name={'Main'}
        component={Main}
        options={{}}
      />
      <RootStack.Screen
        key={'IntroGuide'}
        name={'IntroGuide'}
        component={IntroGuideScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        key={'CircularLoader'}
        name={'CircularLoader'}
        component={CircularLoaderScreen}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
