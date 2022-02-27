import {io, Socket} from "socket.io-client";

// const socket = io("https://sockets-chat88.herokuapp.com/", { transports : ['websocket'] });
// const socket = io("http://localhost:3009", {transports: ['websocket']});

export const api={
    socket: null as null | Socket,
    createConnection(){ //создаем соединение
        this.socket = io("https://sockets-chat88.herokuapp.com/", {transports: ['websocket']});
    },
    //функция-подписчик уведомляет всех пользователей об изменениях
    subscribe(initMessagesHandler: (messages:any)=>void,
              newMessageHandler: (message:any)=>void, userTypingHandler: (user:any)=>void){
        this.socket?.on('init-messages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessageHandler)
        this.socket?.on('user-typing', userTypingHandler)
    },
    destroyConnection(){
        this.socket?.disconnect()
        this.socket = null
    },
    sendUserName(name:any){
        this.socket?.emit('user-name-sent', name) //запрос на сервер
    },
    sendClientMessage(message:any){
        this.socket?.emit('client-message-sent', message, (error:string | null)=>{
            if(error)alert(error)
        }) //запрос на сервер
    },
    typeMessage(){
        this.socket?.emit('message-typing') //запрос на сервер
    },
}
