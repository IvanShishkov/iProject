import React from 'react'

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'

import firebase from 'firebase'
import 'firebase/firestore'

import { useSelector } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'

export const Profile = (props) => {
  const [userPosts, setUserPosts] = React.useState([])
  const [user, setUser] = React.useState(null)
  const [following, setFollowing] = React.useState(false)
  const [openPost, setOpenPost] = React.useState(false)
  const [modal, setModal] = React.useState(null)

  const currentUser = useSelector((state) => state.userState.currentUser)
  const posts = useSelector((state) => state.userState.posts)
  const follows = useSelector((state) => state.userState.following)

  React.useEffect(() => {
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data())
          }
        })
      firebase
        .firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((i) => {
            const data = i.data()
            const id = i.id

            return { id, ...data }
          })
          setUserPosts(posts)
        })
    }

    if (follows.indexOf(props.route.params.uid) > -1) {
      setFollowing(true)
    } else {
      setFollowing(false)
    }
  }, [props.route.params.uid, follows])

  const onFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .set({})
  }

  const onUnFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .delete()
  }

  const onLogout = () => {
    firebase.auth().signOut()
  }

  if (user === null) {
    return <View />
  }

  const onDeletePost = (id) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .doc(id)
      .delete()
  }

  const onOpenPost = (image, caption, id) => {
    setOpenPost(true)

    setModal(
      <View style={styles.modal}>
        <TouchableOpacity
          onPress={() => setOpenPost(false)}
          style={{
            width: '100%',
            alignItems: 'flex-end',
            paddingRight: 5,
            paddingTop: 5,
          }}
        >
          <Ionicons name="close-outline" color="black" size={30} />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 15 }}>
          <Image
            style={{ height: '50%', width: '100%', marginBottom: 10 }}
            source={{ uri: image }}
          />
          <ScrollView
            style={{ height: '24%', marginBottom: 10 }}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          >
            <Text>{caption}</Text>
          </ScrollView>
          <TouchableOpacity onPress={() => onDeletePost(id)}>
            <Ionicons name="trash-outline" color="red" size={30} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user.name}</Text>
          <Text>{user.email}</Text>
        </View>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <TouchableOpacity style={styles.fBtn} onPress={onUnFollow}>
                <Text>Unfollow</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.fBtn} onPress={onFollow}>
                <Text>Follow</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={onLogout}>
            <Ionicons name="exit-outline" color="black" size={30} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.containerGallary}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                onOpenPost(item.downloadURL, item.caption, item.id)
              }
              style={styles.containerImage}
            >
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </TouchableOpacity>
          )}
        />

        {openPost ? modal : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  containerInfo: {
    zIndex: 9997,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
  },

  containerGallary: {
    zIndex: 9997,
    flex: 1,
  },

  containerImage: {
    flex: 1 / 3,
    padding: 0.5,
  },

  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },

  modal: {
    zIndex: 9999,
    position: 'absolute',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  fBtn: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
})
