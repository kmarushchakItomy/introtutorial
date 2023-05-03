import {ScrollView} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

type NavButtonProps = {
  onPress: () => void;
  text: string;
};

const NavButton = ({onPress, text}: NavButtonProps) => {
  return (
    <Button onPress={onPress}>
      <Text>{text}</Text>
    </Button>
  );
};

const Button = styled.TouchableOpacity`
  height: 40px;
  margin-bottom: 20px;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
  shadow-opacity: 0.4;
  shadow-radius: 8px;
  shadow-color: #5243aa;
  shadow-offset: 0px 4px;
  elevation: 3;
`;

const Text = styled.Text`
  color: black;
`;

const Main = ({navigation}) => {
  return (
    <Container style={{flex: 1}}>
      <ScrollView>
        <NavButton
          onPress={() => navigation.navigate('IntroGuide')}
          text={'IntroGuide'}
        />
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

export default Main;
