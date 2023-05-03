import {useWindowDimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import Animated, {
  FadeIn,
  FadeInDown,
  SharedValue,
  interpolate,
  interpolateColor,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {withPause} from 'react-native-redash';
import {SvgProps} from 'react-native-svg';
import Step1 from '../../assets/images/step1.svg';
import Step2 from '../../assets/images/step2.svg';
import Step3 from '../../assets/images/step3.svg';
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import useTimer from './useTimer';

type Step = {
  title: string;
  text: string;
  Image: React.FC<SvgProps>;
  viewDuration: number;
  backgroundColor: string;
};

const steps: Step[] = [
  {
    title: 'Quis autem vel',
    text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    Image: Step1,
    viewDuration: 4000,
    backgroundColor: '#E07A5F',
  },
  {
    title: 'Nam libero tempore',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    Image: Step2,
    viewDuration: 4000,
    backgroundColor: '#3D405B',
  },
  {
    title: 'Et harum quidem',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    Image: Step3,
    viewDuration: 4000,
    backgroundColor: '#81B29A',
  },
];

type ProgressIndicatorProps = {
  duration: number;
  isPaused: boolean | null;
  status: number;
};

const ProgressIndicator = ({
  duration,
  isPaused,
  status,
}: ProgressIndicatorProps) => {
  const progress = useSharedValue(0);
  const isAnimationPaused = useSharedValue(false);
  useEffect(() => {
    if (status > 0) {
      cancelAnimation(progress);
      progress.value = 1;
    } else if (status === 0) {
      progress.value = 0;
      progress.value = withPause(withTiming(1, {duration}), isAnimationPaused);
    } else {
      progress.value = 0;
    }
  }, [status, progress, duration, isAnimationPaused]);

  useEffect(() => {
    isAnimationPaused.value = !!isPaused;
  }, [isPaused, isAnimationPaused]);

  const style = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [0, 100]);
    return {
      width: `${width}%`,
    };
  });
  return (
    <IndicatorContainer>
      <Progress style={style} />
    </IndicatorContainer>
  );
};

const IndicatorContainer = styled.View`
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  flex: 1;
  border-radius: 3px;
`;

const Progress = styled(Animated.View)`
  height: 4px;
  background-color: white;
  border-radius: 3px;
`;

type GuideStepProps = {
  step: Step;
  width: number;
  onPausePress: () => void;
  onPausePressRelease: () => void;
};

const GuideStep = ({
  step,
  width,
  onPausePress,
  onPausePressRelease,
}: GuideStepProps) => {
  const {title, text, Image} = step;

  return (
    <TouchableWithoutFeedback
      onLongPress={onPausePress}
      onPressOut={onPausePressRelease}
      style={{flex: 1}}
      containerStyle={{flex: 1}}>
      <GuideStepContainer width={width}>
        <Title entering={FadeIn.delay(400).duration(1000).springify()}>
          {title}
        </Title>
        <StepText entering={FadeIn.delay(400).duration(1000).springify()}>
          {text}
        </StepText>
        <ImageContainer
          entering={FadeInDown.delay(200).duration(1000).springify()}>
          <Image width={width - 16 * 2 - 50} />
        </ImageContainer>
      </GuideStepContainer>
    </TouchableWithoutFeedback>
  );
};

const GuideStepContainer = styled.View<{width: number}>`
  flex: 1;
  padding: 16px;
  width: ${({width = 0}) => width}px;
`;
const StepText = styled(Animated.Text)`
  font-size: 16px;
  color: white;
`;
const Title = styled(Animated.Text)`
  font-size: 32px;
  color: white;
  margin-bottom: 16px;
`;

const ImageContainer = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const IntroGuideScreen = () => {
  const insets = useSafeAreaInsets();
  const aref = useAnimatedRef<Animated.ScrollView>();
  const {width} = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const [isPaused, setIsPaused] = useState<boolean | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const {pause, start, resume} = useTimer({
    onExpire: () => {
      console.log('currentSlide!!!', currentSlide);
      if (currentSlide < steps.length - 1) {
        currentIndex.value += 1;
        console.log('here!!');
        setCurrentSlide(currentSlide + 1);
      }
    },
  });

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        scrollX.value = event.contentOffset.x;
        // console.log('onScroll', event.contentOffset.x);
      },
      onMomentumEnd(event) {
        console.log('<onMomentumEnd>');
        const nextSlide = Math.floor(event.contentOffset.x / width);
        console.log('nextSlide', nextSlide, currentSlide);
        if (currentSlide !== nextSlide) {
          console.log('nextSlide2', nextSlide);
          runOnJS(setCurrentSlide)(nextSlide);
        }
      },
    },
    [currentSlide],
  );

  useDerivedValue(() => {
    scrollTo(aref, currentSlide * width, 0, true);
  }, [currentSlide]);

  useEffect(() => {
    console.log('currentSlide', currentSlide);
    const {viewDuration} = steps[currentSlide];
    const expireDate = new Date(new Date().getTime() + viewDuration);
    console.log('expireDate', new Date(), expireDate);
    start(viewDuration);
    // const timeout = setTimeout(() => {
    //   if (currentSlide < steps.length - 1) {
    //     currentIndex.value += 1;
    //     setCurrentSlide(currentSlide + 1);
    //   } else {
    //     clearTimeout(timeout);
    //   }
    // }, viewDuration);
  }, [currentSlide, currentIndex]);

  useEffect(() => {
    if (isPaused) {
      pause();
    } else if (isPaused === false) {
      resume();
    }
  }, [isPaused]);

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      steps.map((_, index) => index * width),
      steps.map(step => step.backgroundColor),
    );
    return {
      backgroundColor,
    };
  }, []);

  const onButtonPress = () => {
    withPause;
    console.log(' currentIndex.value', currentIndex.value);
    console.log(' steps.length - 1', steps.length - 1);
    if (currentIndex.value < steps.length - 1) {
      currentIndex.value += 1;
      setCurrentSlide(currentSlide + 1);
    }
  };

  console.log('isPaused', isPaused);
  return (
    <Background style={backgroundStyle}>
      <Container
        style={{paddingBottom: insets.bottom + 20, paddingTop: insets.top}}>
        <ContentContainer>
          <Row style={{gap: 10}}>
            {steps.map((step, index) => {
              return (
                <ProgressIndicator
                  key={index}
                  status={currentSlide - index}
                  duration={step.viewDuration}
                  isPaused={isPaused}
                />
              );
            })}
          </Row>
          <Animated.ScrollView
            ref={aref}
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            snapToStart
            snapToEnd
            horizontal
            decelerationRate="fast"
            bounces={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            {steps.map((step, index) => {
              return (
                <GuideStep
                  onPausePress={() => {
                    setIsPaused(true);
                    pause();
                  }}
                  onPausePressRelease={() => {
                    setIsPaused(false);
                    resume();
                  }}
                  width={width}
                  key={index}
                  step={step}
                />
              );
            })}
          </Animated.ScrollView>
          <ButtonContainer
            entering={FadeInDown.delay(400).duration(1000).springify()}>
            <Button onPress={onButtonPress}>
              <ButtonText>Next</ButtonText>
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </Background>
  );
};

const Row = styled.View`
  flex-direction: row;
  padding: 16px;
`;

const Container = styled.View`
  flex: 1;
`;
const ContentContainer = styled.View`
  flex: 1;
`;

const Background = styled(Animated.View)`
  height: 100%;
  flex: 1;
`;

const ButtonContainer = styled(Animated.View)`
  padding: 0 16px;
`;

const Button = styled.TouchableOpacity`
  background-color: white;
  padding: 12px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled.Text`
  color: black;
  font-size: 16px;
`;

export default IntroGuideScreen;
