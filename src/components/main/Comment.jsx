import React from 'react'

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'

import { useDispatch, useSelector } from 'react-redux'

import firebase from 'firebase'
import 'firebase/firestore'

import { fetchUsersData } from '../../redux/actions/index'

export const Comment = (props) => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.usersState.users)

  const [comments, setComments] = React.useState([])
  const [postId, setPostId] = React.useState('')
  const [text, setText] = React.useState('')

  React.useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty('user')) {
          continue
        }

        const user = users.find((x) => x.uid === comments[i].creator)

        if (user === undefined) {
          dispatch(fetchUsersData(comments[i].creator, false))
        } else {
          comments[i].user = user
        }
      }
      setComments(comments)
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .get()
        .then((snapshots) => {
          let comments = snapshots.docs.map((i) => {
            const data = i.data()
            const id = i.id
            return { id, ...data }
          })
          matchUserToComment(comments)
        })
      setPostId(props.route.params.postId)
    } else {
      matchUserToComment(comments)
    }
  }, [props.route.params.postId, users])

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection('posts')
      .doc(props.route.params.uid)
      .collection('userPosts')
      .doc(props.route.params.postId)
      .collection('comments')
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      })
  }

  return (
    <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            {item.user !== undefined ? (
              <Text style={{ fontWeight: 'bold' }}>{item.user.name}</Text>
            ) : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.bottom}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          onChangeText={(text) => setText(text)}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
          }}
          onPress={onCommentSend}
        >
          <Text>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: 'rgba(123, 129, 138, 0.3)',
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },

  input: {
    width: '85%',
    borderRightColor: 'grey',
    borderRightWidth: 0.2,
    paddingHorizontal: 10,
  },
})
