import { Pressable, PressableProps, Text } from "react-native";
import tw from "twrnc";
interface ButtonProps extends PressableProps {
  children: React.ReactNode;
}
const style = tw`flex-row bg-blue-500 p-2 items-center justify-center rounded-md w-32 h-14`;
const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        tw`flex-row bg-blue-700 p-2 items-center justify-center rounded-md w-32 h-14`,
        pressed && style,
      ]}
      {...props}
      android_ripple={{ color: "rgba(255, 255,255, 0.7)" }}
    >
      <Text style={tw`text-white text-3xl font-bold`}>{children}</Text>
    </Pressable>
  );
};

export default Button;
