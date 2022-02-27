import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import { rootStateType } from './state/store';
import {destroyConnection, createConnection, setClientName, sendClientMessage, typeMessage} from './state/chat-reducer';



// const socket = io("https://sockets-chat88.herokuapp.com/", { transports : ['websocket'] });
// const socket = io("http://localhost:3009", {transports: ['websocket']});

function App() {
    // useEffect(() => {
    //     socket.on('init-messages-published', (data) => {
    //         setMessages(data)
    //     })
    //     socket.on('new-message-sent', (newMessage) => {
    //         setMessages(messages => [...messages, newMessage])
    //     })
    // }, [])
    const messages = useSelector<rootStateType, Array<any>>(state => state.messages)
    const typingUsers = useSelector<rootStateType, Array<any>>(state => state.typingUsers)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(createConnection())
        return ()=>{
            dispatch(destroyConnection())
        }
    }, [])
    const [name, setName] = useState<string>('Vova')
    const [message, setMessage] = useState<string>('Hello')
    const [autoScroll, setAutoScroll] = useState<boolean>(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)


    const stopAutoScroll=(e:any)=>{
        let element = e.currentTarget
        let autoScrollCondition = element.scrollHeight - element.scrollTop === element.clientHeight //проверяем дошел ли скрол до самого низа
        if(element.scrollTop>lastScrollTop && autoScrollCondition){ //если прокручиваем вниз, то включаем автоскрол
            setAutoScroll(true)
        } else{
            setAutoScroll(false)
        }
        setLastScrollTop(element.scrollTop)
    }

    useEffect(()=>{
        if(autoScroll){
            //скролим чат в самы низ при появлении нового сообщения
            bottomContainerRef.current?.scrollIntoView({behavior: "smooth"})
        }
    },[messages])
    const bottomContainerRef = useRef<HTMLDivElement>(null)

    return (
        <div className="App">
            <div>
                <div className={'chat-container'} onScroll={stopAutoScroll}>
                    {messages.map(({message, user, id}) => {
                        return <div key={id}>
                            <b>{user.name}:</b> {message}
                            <hr/>
                        </div>
                    })}
                    {typingUsers.map(({name, id}) => {
                        return <div key={id}>
                            <b>{name}:</b> ...typing
                        </div>
                    })}
                    {/*блок для скролинга вниз*/}
                    <div ref={bottomContainerRef}></div>
                </div>
                  <div>
                      <input value={name}
                             onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}>
                      </input>
                      <button onClick={() => dispatch(setClientName(name))}>User</button>
                  </div>
                  <div className={'send-container'}>
                    <textarea value={message} onKeyPress={()=>dispatch(typeMessage())}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.currentTarget.value)}>
                  </textarea>
                      <button onClick={() => {
                          dispatch(sendClientMessage(message))
                          setMessage('')
                      }}>
                          Send
                      </button>
                  </div>
            </div>
        </div>
    );
}

export default App;
