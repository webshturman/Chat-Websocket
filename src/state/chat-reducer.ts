import { api } from "./api"

export const initialState={
    messages:[],
    typingUsers:[]
}

export const chatReducer =(state:any = initialState, action:any)=>{
    switch(action.type){
        case 'GET_INIT_MESSAGES':
            return {...state, messages: action.messages}
        case 'ADD_NEW_MESSAGE':
            //удаляем печатающего пользователя из массива после добавления сообщения
            return {...state, messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter((user:any)=>user.id !== action.message.user.id)
            }
        case 'ADD_TYPING_USER':
            return {...state,
                typingUsers: [...state.typingUsers.filter((user:any)=>user.id!==action.user.id), action.user]}
        //фильтруем массив, чтобы один пользователь не добавлялся каждый раз
        default:
            return state
    }
}
export const createConnection=()=>(dispatch:any)=>{
    api.createConnection()
    api.subscribe(
        (messages:any)=>dispatch(getInitMessages(messages)),
        (message:any)=>dispatch(addNewMessage(message)),
        (user:any)=>dispatch(addTypingUser(user))
    )
}
export const destroyConnection=()=>(dispatch:any)=>{
    api.destroyConnection()
}

export const setClientName=(name:string)=>(dispatch:any)=>{
    api.sendUserName(name)
}
export const sendClientMessage=(message:string)=>(dispatch:any)=>{
    api.sendClientMessage(message)
}
export const typeMessage=()=>(dispatch:any)=>{
    api.typeMessage()
}

//=================================================

export const getInitMessages = (messages:any)=>{
    return {type:'GET_INIT_MESSAGES', messages}
}
export const addNewMessage = (message:any)=>{
    return {type:'ADD_NEW_MESSAGE', message}
}
export const addTypingUser = (user:any)=>{
    return {type:'ADD_TYPING_USER', user}
}
