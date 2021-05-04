import React from 'react'

import { useDispatch } from 'react-redux'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import firebase from 'firebase'

import {
  clearData,
  fetchUser,
  fetchUserFollowing,
  fetchUserPosts,
} from '../redux/actions/index'

import { Feed } from './main/Feed'
import { Profile } from './main/Profile'
import { Search } from './main/Search'

import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

export const Main = ({ navigation }) => {
  const dispatch = useDispatch()

  const Empty = () => {
    return null
  }

  React.useEffect(() => {
    dispatch(clearData())
    dispatch(fetchUser())
    dispatch(fetchUserFollowing())
    dispatch(fetchUserPosts())
  }, [])

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      labeled={false}
      barStyle={{ backgroundColor: 'white' }}
      tabBarOptions={{
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="ios-home" color="#242240" size={25} />
            ) : (
              <Ionicons name="ios-home-outline" color="#242240" size={25} />
            ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="search"
                color="#242240"
                size={26}
                navigation={navigation}
              />
            ) : (
              <Ionicons
                name="search-outline"
                color="#242240"
                size={26}
                navigation={navigation}
              />
            ),
        }}
      />
      <Tab.Screen
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault()
            navigation.navigate('Add')
          },
        })}
        name="AddContainer"
        component={Empty}
        options={{
          tabBarIcon: () => (
            <Ionicons name="add-circle-outline" color="#242240" size={26} />
          ),
        }}
      />
      <Tab.Screen
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault()
            navigation.navigate('Profile', {
              uid: firebase.auth().currentUser.uid,
            })
          },
        })}
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person-circle" color="#242240" size={26} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                color="#242240"
                size={26}
              />
            ),
        }}
      />
    </Tab.Navigator>
  )
}
