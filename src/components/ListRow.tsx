import { Text, TextProps } from "react-native"

import tw from "twrnc"
interface ListRowProps extends TextProps {
  children: React.ReactNode;
}
const ListRow: React.FC<ListRowProps> = ({ children, ...props }) => {
  return <Text style={tw`text-white font-bol text-lg`} {...props} >{children}</Text>
}

export default ListRow;