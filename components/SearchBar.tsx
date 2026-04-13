import { View, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

interface Props {
    onPress?: () => void;
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

const SearchBar = ({ onPress, placeholder, value, onChangeText }: Props) => {
  return (
    <View className='flex-row bg-dark-200 rounded-full px-5 py-4 items-center'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor="#AB8BFF" />
        <TextInput 
            onPress={onPress}
            placeholder={placeholder}
            value={value}
            onChangeText ={onChangeText}
            placeholderTextColor="#A8B5DB"
            className='flex-1 mal-2 text-white'
        />
    </View>
  )
}

export default SearchBar