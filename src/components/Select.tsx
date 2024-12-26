import React from 'react'
import { Picker } from '@react-native-picker/picker'
import tw from 'twrnc'
import { View } from 'react-native'
import { PickerProps } from '@react-native-picker/picker'

const Select: React.FC<PickerProps> = (...props) => {
  return (
    <View style={tw`w-full bg-blue-400 rounded-md mb-4`}>
      <Picker
        style={tw`w-full text-white`}
        dropdownIconColor={tw.color('white')}
        dropdownIconRippleColor={tw.color('white')}
        itemStyle={tw`bg-blue-400`}
      >
        <Picker.Item label="Selecione o método de pagamento" value="" />
        <Picker.Item label="Dinheiro" value="Dinheiro" />
        <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
        <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
        <Picker.Item label="Pix" value="Pix" />

      </Picker>
    </View>
  )
}

export default Select