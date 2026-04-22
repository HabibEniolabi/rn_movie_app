import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import Octicons from "react-native-vector-icons/Octicons"
import Feather from "react-native-vector-icons/Feather"
import { images } from '@/constants/images'

const Profile = () => {
  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-between mt-20 mb-10 items-center flex-row'>
        <Text className='text-white font-bold text-lg'>Profile</Text>
        <View className='flex items-center bg-dark-100 border-light-300 border p-3 rounded-md'>
          <TouchableOpacity>
            <Octicons name={"gear"} size={18} color="#000000"/>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex justify-center item-center mt-3 flex-col">
        <Image source={images.profile} className='w-[140px] h-[140px]'/>
        <TouchableOpacity className='w-[35px] h-[35px] bg-orange rounded-[15px] justify-center items-center mt-[-20 px] ml-40'>
          <Feather name={"edit-3"} saize={12} color="#ffffff "/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile