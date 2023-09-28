import { composeWithDevTools } from "redux-devtools-extension";
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

import todoReducer from "./reducers/todoReducer";
import authReducer from './reducers/authReducer'
import tabsReducer from './reducers/tabsReducer'
import modalReducer from './reducers/modalReducer'
import friendReducer from './reducers/friendReducer'
import conversationreducer from './reducers/conversationReducer'
import messageReducer from './reducers/messageReducer'

const rootReducer = combineReducers({
    todo: todoReducer,
    auth: authReducer,
    tabs: tabsReducer,
    modal: modalReducer,
    friend: friendReducer,
    conversation: conversationreducer,
    message: messageReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store;