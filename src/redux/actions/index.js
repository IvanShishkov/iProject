import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  CLEAR_DATA,
} from '../types'

import firebase from 'firebase'

export const clearData = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA })
  }
}

export const fetchUser = () => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, payload: snapshot.data() })
        }
      })
  }
}

export const fetchUserPosts = () => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((i) => {
          const data = i.data()
          const id = i.id

          return { id, ...data }
        })
        dispatch({ type: USER_POSTS_STATE_CHANGE, payload: posts })
      })
  }
}

export const fetchUserFollowing = () => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((i) => {
          const id = i.id
          return id
        })
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, payload: following })

        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true))
        }
      })
  }
}

export const fetchUsersData = (uid, getPosts) => {
  return async (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid)

    if (!found) {
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data()
            user.uid = snapshot.id

            dispatch({ type: USERS_DATA_STATE_CHANGE, payload: user })
          }
        })
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid))
      }
    }
  }
}

export const fetchUsersFollowingPosts = (uid) => {
  return async (dispatch, getState) => {
    await firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const user = getState().usersState.users.find((el) => el.uid === uid)

        let posts = snapshot.docs.map((i) => {
          const data = i.data()
          const id = i.id

          return { id, ...data, user }
        })

        for (let i = 0; i < posts.length; i++) {
          dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
        }

        dispatch({
          type: USERS_POSTS_STATE_CHANGE,
          posts,
          uid,
        })
      })
  }
}

export const fetchUsersFollowingLikes = (uid, postId) => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        let currentUserLike = false
        if (snapshot.exists) {
          currentUserLike = true
        }

        dispatch({
          type: USERS_LIKES_STATE_CHANGE,
          postId,
          currentUserLike,
        })
      })
  }
}
