import React from 'react'

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import firebase from 'firebase'
import 'firebase/firestore'

import Ionicons from 'react-native-vector-icons/Ionicons'

export const Search = (props) => {
  const [users, setUsers] = React.useState([])

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection('users')
      .where('name', '>=', search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((i) => {
          const data = i.data()
          const id = i.id

          return { id, ...data }
        })
        setUsers(users)
      })
  }

  return (
    <View style={{ paddingVertical: 30, paddingHorizontal: 5 }}>
      <View style={styles.input}>
        <Ionicons name="search" color="grey" size={20} />
        <TextInput
          placeholder="Search"
          onChangeText={(search) => fetchUsers(search)}
          style={{ width: '90%', height: '100%' }}
        />
      </View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.list}
            onPress={() =>
              props.navigation.navigate('Profile', { uid: item.id })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(123, 129, 138, 0.3)',
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  list: { padding: 5 },
})
