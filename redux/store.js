import { composeWithDevTools } from "redux-devtools-extension";
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

import todoReducer from "./reducers/todoReducer";
import authReducer from './reducers/authReducer'
import maintabReducer from './reducers/maintabReducer'
import modalReducer from './reducers/modalReducer'
import friendReducer from './reducers/friendReducer'
import conversationreducer from './reducers/conversationReducer'

const rootReducer = combineReducers({
    todo: todoReducer,
    auth: authReducer,
    maintab: maintabReducer,
    modal: modalReducer,
    friend: friendReducer,
    conversation: conversationreducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store;