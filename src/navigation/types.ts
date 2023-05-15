import {RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  //Intro
  Main: undefined;
  DynamicTabs: undefined;
  Skeletons: undefined;
  IntroGuide: undefined;
  CircularLoader: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export type BottomTabParamList = {
  // Main
  Home: undefined;
  Points: {tab?: 'physicalActivity' | 'financialKnowledge'};
  Settings: undefined;
  Resources: undefined;
  Rewards: undefined;
};

export type MainNavigatorScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
