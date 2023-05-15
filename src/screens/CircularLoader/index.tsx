import {Text} from 'react-native';
import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import Svg, {Circle, Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import Spacer from 'components/Spacer';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const size = 150;
const strokeWidth = 10;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;
const cx = size / 2;
const cy = size / 2;

const CircularSpinner = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 1500, easing: Easing.linear}),
      -1,
    );
  }, [progress]);
  const style = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [0, 360]);
    return {
      transform: [{rotateZ: `${rotate}deg`}],
    };
  }, []);

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="gradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="red" />
            <Stop offset="100%" stopColor="blue" />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          stroke="url(#gradient)"
          fill="none"
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
        />
      </Svg>
    </Animated.View>
  );
};

const fullAngle = 2 * Math.PI;
const stepAngle = fullAngle / 2;

const x = (a: number) => radius * Math.cos(a) + cx;
const y = (a: number) => -radius * Math.sin(a) + cy;

const CircularSpinnerWithAngularGradient = () => {
  const progress = useSharedValue(0);

  const arcs = new Array(2).fill(0).map((_, idx) => {
    const angle = idx * stepAngle;
    return `M ${x(angle)} ${y(angle)} A ${radius} ${radius} 0 0 1 ${x(
      angle + stepAngle,
    )} ${y(angle + stepAngle)}`;
  });

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 1500, easing: Easing.linear}),
      -1,
    );
  }, [progress]);

  const style = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [0, 360]);
    return {
      transform: [{rotateZ: `${rotate}deg`}],
    };
  }, []);
  return (
    <Animated.View style={style}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient
            key={0}
            id={`gradient-${0}`}
            x1="100%"
            y1="50%"
            x2="0%"
            y2="50%">
            <Stop
              offset="30%"
              stopColor="rgba(130, 148, 196 , 0)"
              stopOpacity={0}
            />
            <Stop offset="100%" stopColor="rgb(130, 148, 196 )" />
          </LinearGradient>
          <LinearGradient
            key={1}
            id={`gradient-${1}`}
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%">
            <Stop offset="0%" stopColor="rgb(130, 148, 196 )" />
            <Stop offset="100%" stopColor="rgb(130, 148, 196 )" />
          </LinearGradient>
        </Defs>

        {arcs.map((d, idx) => {
          return (
            <Path
              key={idx}
              fill="transparent"
              strokeWidth={strokeWidth}
              stroke={`url(#gradient-${idx})`}
              strokeLinecap="round"
              d={d}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};

const GoogleSpinner = () => {
  const progress = useSharedValue(0);
  const springProgress = useSharedValue(0);
  const strokeColorProgress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 1500, easing: Easing.linear}),
      -1,
    );
    springProgress.value = withRepeat(
      withTiming(1, {duration: 2000, easing: Easing.linear}),
      -1,
    );
    strokeColorProgress.value = withRepeat(
      withTiming(1, {duration: 8000, easing: Easing.linear}),
      -1,
    );
  }, [progress, springProgress, strokeColorProgress]);
  const style = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [0, 360]);
    return {
      transform: [{rotateZ: `${rotate}deg`}],
    };
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      springProgress.value,
      [0, 0.5, 1],
      [0, -circumference * 0.25, -circumference * 1.05],
    );
    const strokeDasharray = interpolate(
      springProgress.value,
      [0, 0.5, 1],
      [circumference * 0.05, circumference * 0.75, circumference * 0.75],
    );
    const strokeColor = interpolateColor(
      strokeColorProgress.value,
      [0, 0.4, 0.6, 0.8, 1],
      ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#4285F4'],
    );
    return {
      strokeDashoffset,
      strokeDasharray: [strokeDasharray, circumference],
      stroke: strokeColor,
    };
  });
  return (
    <Animated.View style={style}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="gradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="red" />
            <Stop offset="100%" stopColor="blue" />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          stroke="black"
          fill="none"
          r={radius}
          strokeDasharray={[circumference * 0.05, circumference]}
          strokeDashoffset={0}
        />
      </Svg>
    </Animated.View>
  );
};

const CircularLoaderScreen = () => {
  return (
    <Container>
      <Content>
        <Text>CircularLoader</Text>
        <Spacer y={20} />
        <CircularSpinner />
        <Spacer y={20} />
        <CircularSpinnerWithAngularGradient />
        <Spacer y={20} />
        <GoogleSpinner />
      </Content>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  background-color: #ffe194;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    alignItems: 'center',
  },
})``;

export default CircularLoaderScreen;
