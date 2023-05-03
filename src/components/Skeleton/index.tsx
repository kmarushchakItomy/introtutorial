import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

import React, {useEffect, useState} from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';

type SkeletonProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const Skeleton = ({width, height, style}: SkeletonProps) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, {duration: 1500}), -1);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-layoutWidth, layoutWidth],
    );
    return {
      transform: [{translateX}],
    };
  });
  return (
    <Container
      h={height}
      w={width}
      style={style}
      onLayout={(e: LayoutChangeEvent) => {
        const {width} = e.nativeEvent.layout;

        setLayoutWidth(width);
      }}>
      <GlareContainer style={animatedStyle}>
        <StyledLinearGradient
          colors={[
            'rgba(210, 210, 210, 0)',
            'rgba(235, 235, 235, 0.8)',
            'rgba(210, 210, 210, 0)',
          ]}
          useAngle
          angle={90}
        />
      </GlareContainer>
    </Container>
  );
};

type ContainerProps = {
  h?: number;
  w?: number;
};

const Container = styled.View<ContainerProps>`
  ${({h}) => (h ? `height:${h}px` : '')}
  ${({w}) => (w ? `width:${w}px` : '')}

  background-color: #d2d2d2;
  align-items: center;
  overflow: hidden;
`;

const GlareContainer = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: red; */
`;

const StyledLinearGradient = styled(LinearGradient)`
  height: 100%;
  width: 100%;
`;

export default Skeleton;
