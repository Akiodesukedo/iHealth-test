import React, { useEffect, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter, Pressable } from 'react-native'
import { Button, Text } from '@rneui/themed';

const ResultScreen = ({ navigation, BGL }) => {
  return (
    <View>
      <Text>Here is the result</Text>
      <Text>number {BGL}</Text>
    </View>
  )
}

export default ResultScreen;