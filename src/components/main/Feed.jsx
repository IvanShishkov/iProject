import React from 'react'

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import firebase from 'firebase'
import 'firebase/firestore'

import { useSelector } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'

export const Feed = (props) => {
  const [posts, setPosts] = React.useState([])
  const [showText, setShowText] = React.useState(false)

  const follows = useSelector((state) => state.userState.following)
  const feed = useSelector((state) => state.usersState.feed)
  const usersFollowingLoaded = useSelector(
    (state) => state.usersState.usersFollowingLoaded
  )

  React.useEffect(() => {
    if (usersFollowingLoaded === follows.length && follows.length !== 0) {
      feed.sort(function (x, y) {
        return x.creation - y.creation
      })
      setPosts(feed)
    }
  }, [usersFollowingLoaded, feed])

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .set({})

    firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .update({
        likesCount: firebase.firestore.FieldValue.increment(1),
      })
  }

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .delete()

    firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .update({
        likesCount: firebase.firestore.FieldValue.increment(-1),
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerGallary}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <View style={styles.infoContainer}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {item.user.name}
                </Text>
              </View>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              <View style={styles.toolbarContainer}>
                <TouchableOpacity
                  onPress={() => {
                    item.currentUserLike
                      ? onDislikePress(item.user.uid, item.id)
                      : onLikePress(item.user.uid, item.id)
                  }}
                  style={styles.toolbarButtons}
                >
                  <Ionicons
                    name={item.currentUserLike ? 'heart' : 'heart-outline'}
                    color={item.currentUserLike ? '#E94956' : '#242240'}
                    size={26}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('Comment', {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }
                  style={styles.toolbarButtons}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    color="#242240"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.likes}>{item.likesCount} likes</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    numberOfLines={showText ? 0 : 2}
                    ellipsizeMode="clip"
                    style={styles.caption}
                  >
                    <Text style={{ fontWeight: 'bold' }}>{item.user.name}</Text>
                    <Text> </Text>
                    {item.caption}
                  </Text>
                  {item.caption.length > 50 ? (
                    showText ? null : (
                      <TouchableOpacity
                        style={styles.more}
                        onPress={() => setShowText(true)}
                      >
                        <Text style={{ color: 'grey' }}>... more</Text>
                      </TouchableOpacity>
                    )
                  ) : null}
                </View>
                <Text
                  onPress={() =>
                    props.navigation.navigate('Comment', {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }
                >
                  View Comments...
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#242240',
  },

  containerGallary: {
    flex: 1,
    marginTop: 25,
  },

  containerImage: {
    flex: 1 / 3,
    marginBottom: 20,
  },

  infoContainer: {
    flex: 1,
    padding: 10,
  },

  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },

  toolbarContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  toolbarButtons: {
    padding: 10,
  },

  textContainer: {
    paddingHorizontal: 10,
  },

  likes: {
    paddingBottom: 5,
    fontWeight: 'bold',
  },

  caption: {
    flex: 1,
    paddingBottom: 5,
  },

  more: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingVertical: 5,
    marginRight: 15,
  },
})
