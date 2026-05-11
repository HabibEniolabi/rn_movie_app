import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import Feather from 'react-native-vector-icons/Feather'

const Language = () => {
  return (
    <View className='bg-primary flex-1 px-5'>
      <View className='flex-row items-center mt-16 mb-4'>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className='rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center px-2 py-2'
        >
          <Feather name="chevron-left" size={24} color="#8B88A8" />
        </TouchableOpacity>
        <Text className='text-white font-bold text-[24px] text-center'>Language</Text>
      </View>
    </View>
  )
}
export default Language