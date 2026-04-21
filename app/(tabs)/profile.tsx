import { Image, Text, View } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

const Profile = () => {
  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-between mt-20 items-center flex-row'>
        <Text className='text-white font-bold text-lg'>Profile</Text>
        <View className='flex items-center bg-dark-100 p-3 rounded-md'>
          <Image source={icons.person} className='size-5' tintColor={"#fff"} resizeMode='contain'/>
        </View>
      </View>
    </View>
  )
}

export default Profile