import React from 'react'

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'

import firebase from 'firebase'
import 'firebase/auth'

export const Login = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
  }

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={{ marginTop: 30 }} onPress={onLogin}>
          <Text style={{ fontSize: 15 }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'black',
    borderWidth: 2,
    marginTop: 30,
    height: 40,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
})
