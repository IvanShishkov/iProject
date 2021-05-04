import React from 'react'

import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/firebase-storage'

import Ionicons from 'react-native-vector-icons/Ionicons'

export const Save = (props) => {
  const [caption, setCaption] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onUploadImage = async () => {
    setLoading(true)
    const uri = props.route.params.image
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`

    const response = await fetch(uri)
    const blob = await response.blob()

    const task = firebase.storage().ref(childPath)

    task
      .put(blob)
      .then(function (snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      })
      .then(function () {
        task.getDownloadURL().then(function (downloadURL) {
          savePostData(downloadURL)
        })
      })
  }

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .add({
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        downloadURL,
      })
      .then(function () {
        setLoading(false)
        props.navigation.popToTop()
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Ionicons name="arrow-back-outline" color="black" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onUploadImage}>
          <Ionicons name="checkmark-done-outline" color="black" size={30} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : null}
      <Image style={styles.image} source={{ uri: props.route.params.image }} />
      <TextInput
        style={styles.input}
        placeholder="Write a Caption..."
        multiline={true}
        numberOfLines={10}
        onChangeText={(caption) => setCaption(caption)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },

  loading: {
    zIndex: 9999,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  image: { height: '65%', width: '100%', marginTop: 10, zIndex: 9997 },

  input: {
    marginTop: 15,
    padding: 5,
    height: '20%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
})
