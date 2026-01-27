import { View, Text } from "react-native"
import React from "react"
import DashboardHeader from "@/components/Header";

const Wiki = () => {
  return (
    <>
    <DashboardHeader />
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl text-center">Wiki</Text>
    </View>
    </>
    
  )
}

export default Wiki
