import React, { useEffect, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter, Pressable } from 'react-native'
import { Button, Image, Text } from '@rneui/themed';

const ResultScreen = ({ navigation, route }) => {
  const { BGL } = route.params;

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Image 
        source={require('../../assets/imgs/gluco-chan-result.png')}
        style={{width: 250, height: 250}}
      />
      <Text style={{fontSize: '22px'}} >{BGL} mmol/L</Text>
    </View>
  )
}

export default ResultScreen;