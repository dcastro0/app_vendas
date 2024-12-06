import React from 'react';
import { Text, TextProps } from 'react-native-paper';

interface TextWhiteProps extends TextProps<{}> {
  text: string;
  size: number;
}

const TextWhite: React.FC<TextWhiteProps> = ({ text, size, ...rest }) => {
  return (
    <Text style={{ color: 'white', fontSize: size }} {...rest}>
      {text}
    </Text>
  );
};

export default TextWhite;
