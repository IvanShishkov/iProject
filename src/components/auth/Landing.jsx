import React from 'react'

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'

export const Landing = ({ navigation }) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={{ ...styles.button, marginRight: 20 }}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ fontSize: 20 }}>Register</Text>
        <Ionicons name="person-add-outline" color="black" size={25} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ fontSize: 20 }}>Login</Text>
        <Ionicons name="log-in-outline" color="black" size={30} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderStartColor: 'black',
    borderWidth: 4,
    borderRadius: 10,
    height: '20%',
    width: '30%',
  },
})
