import React from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import firebase from 'firebase'

import { Landing } from './src/components/auth/Landing'
import { Register } from './src/components/auth/Register'
import { Login } from './src/components/auth/Login'
import { Main } from './src/components/Main'
import { Add } from './src/components/main/Add'
import { Save } from './src/components/main/Save'
import { Comment } from './src/components/main/Comment'

import store from './src/redux/index'

const firebaseConfig = {
  apiKey: 'AIzaSyBTV-rZNfLdJfOFzl-ccEuferuVF0kHraI',
  authDomain: 'insta-8d0ee.firebaseapp.com',
  projectId: 'insta-8d0ee',
  storageBucket: 'insta-8d0ee.appspot.com',
  messagingSenderId: '378725303074',
  appId: '1:378725303074:web:e4fbce57470e7c81275b7b',
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator()

export default function App({ navigation }) {
  const [loaded, setLoaded] = React.useState(false)
  const [loggedIn, setLoggedIn] = React.useState(false)

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false)
        setLoaded(true)
      } else {
        setLoggedIn(true)
        setLoaded(true)
      }
    })
  }, [])

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Landing"
        >
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Main"
        >
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Add" component={Add} navigation={navigation} />
          <Stack.Screen name="Save" component={Save} navigation={navigation} />
          <Stack.Screen
            name="Comment"
            component={Comment}
            navigation={navigation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
})
