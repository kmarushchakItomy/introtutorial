import {View, Text} from 'react-native';
import React, {useEffect, useRef} from 'react';

type UseTimerProps = {
  onExpire: () => void;
};

const useTimer = ({onExpire}: UseTimerProps) => {
  const remaining = useRef(0);
  const endTime = useRef<Date>(new Date());
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const start = (duration: number) => {
    timeout.current && clearTimeout(timeout.current);
    console.log('START');
    endTime.current = new Date(new Date().getTime() + duration);
    timeout.current = setTimeout(() => {
      onExpire();
      console.log('onExpire');
    }, duration);
    console.log('duration', duration);
  };
  const pause = () => {
    timeout.current && clearTimeout(timeout.current);
    if (endTime.current) {
      remaining.current = endTime.current.getTime() - new Date().getTime();
      console.log('remaining.current', remaining.current);
    }
  };

  const resume = () => {
    timeout.current = setTimeout(() => {
      onExpire();
    }, remaining.current);
  };

  useEffect(() => {
    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);
  return {
    start,
    pause,
    resume,
  };
};

export default useTimer;
