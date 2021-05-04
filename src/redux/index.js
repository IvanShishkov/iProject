import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { user } from './reducers/user'
import { users } from './reducers/users'

const rootReducer = combineReducers({
  userState: user,
  usersState: users,
})

export default createStore(rootReducer, applyMiddleware(thunk))
