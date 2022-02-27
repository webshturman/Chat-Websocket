import {applyMiddleware, createStore} from "redux";
import { chatReducer } from "./chat-reducer";
import thunk from "redux-thunk";



export const store = createStore(chatReducer, applyMiddleware(thunk))
export type rootStateType = ReturnType<typeof chatReducer>;
