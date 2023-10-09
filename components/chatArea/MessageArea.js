
import styles from './MessageArea.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import Avatar from '../common/Avatar'
import { addSameDayAndSameAuth, checkShowTimeAndStatusInBottom } from '../../utils/message'
import { updateStatusMessage } from '../../reltimeCommunication/socketConnection'
import { conversationActions } from '../../redux/actions/conversationAction'
import MessageLeft from './messageLeft'
import MessageRight from './messageRight'
import { messageActions } from '../../redux/actions/messageActions'


const MessageArea = () => {
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)
    const [messages, setMessages] = useState([])
    const [receiverUser, setReceiverUser] = useState({})
    const [userDetails, setUserDetails] = useState({})
    const messageAreaElement = useRef()
    const dispatch = useDispatch()
    useEffect(() => {
        setReceiverUser(JSON.parse(localStorage.getItem('receiverUser')))
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
        const conversationId = conversationSelected._id
        if (conversations) {
            conversations.forEach((conversation) => {
                if (conversationId === conversation._id) {
                    addSameDayAndSameAuth(conversation.messages)
                    checkShowTimeAndStatusInBottom(conversation.messages)
                    setMessages(conversation.messages)
                }
            })
        }
    }, [conversationSelected, conversations])

    useEffect(() => {
        if (userDetails) {
            let listMessageStatusEqual2 = []
            messages?.forEach(message => {
                if (message.sender._id != userDetails._id && message.status == '2') {
                    listMessageStatusEqual2.push(message)
                }
            })
            if (listMessageStatusEqual2.length != 0) {
                dispatch({
                    type: conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES,
                    listMessage: listMessageStatusEqual2,
                    conversationId: conversationSelected._id
                })
                // emit update sender

                updateStatusMessage({
                    listMessage: listMessageStatusEqual2,
                    conversationId: conversationSelected._id
                })
            }
        }
        let messageAreaElement = document.getElementById('messageArea')
        if (messageAreaElement) {
            messageAreaElement.scrollTop = messageAreaElement.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        let widthChatArea
        if (window.innerWidth < 700) {
            widthChatArea = parseInt((window.innerWidth - 64) * 0.8)  // width of mainTab and TabTwo  
        } else {
            widthChatArea = parseInt((window.innerWidth - 64 - 344) * 0.8) // width of mainTab and TabTwo   
        }
        dispatch({
            type: messageActions.SET_MAX_WIDTH_MESSAGE,
            maxWidth: widthChatArea
        })
    }, [])

    useEffect(() => {
        let id = setTimeout(() => {
            let messageAreaElement = document.getElementById('messageArea')
            if (messageAreaElement) {
                messageAreaElement.scrollTop = messageAreaElement.scrollHeight
            }
        }, 50)
        return () => {
            clearTimeout(id)
        }
    })
    return (
        <>
            <div
                id='messageArea'
                className={styles.messageArea}
                ref={messageAreaElement}
            >
                <div style={{ height: '30px' }}></div>
                {
                    messages && messages.map((message, index) => {
                        if (message.type === "accept_friend") {
                            if (message.sender._id === userDetails._id) {
                                return (
                                    <div key={message._id}>
                                        {
                                            message.sameDay === false &&
                                            <div className={styles.dateShow}>
                                                <p>{message.dateShow} </p>
                                            </div>
                                        }
                                        <div className={styles.acceptFriend}>
                                            <Avatar
                                                src={message?.sender?.avatar ? message?.sender?.avatar : ''}
                                                width={20}
                                            />
                                            <p>
                                                {message?.sender ? message?.sender?.firstName + ' ' + message?.sender?.lastName : ''}
                                            </p>
                                            <p> đã đồng ý kết bạn</p>
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={message._id} >
                                        {
                                            message.sameDay === false &&
                                            <div className={styles.dateShow}>
                                                <p>{message.dateShow}</p>
                                            </div>
                                        }
                                        <div className={styles.acceptFriend}>
                                            <p>bạn vừa mới kết bạn với</p>
                                            <Avatar
                                                src={message?.sender?.avatar ? message?.sender?.avatar : ''}
                                                width={20}
                                            />
                                            <p>
                                                {message?.sender ? message?.sender?.firstName + ' ' + message?.sender?.lastName : ''}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }
                        }

                        if (message.sender._id === userDetails._id) {
                            return (
                                <div key={message._id} >
                                    <MessageRight
                                        message={message}
                                    />
                                </div>
                            )
                        } else {
                            return (
                                <div key={message._id} >
                                    {
                                        message.sameDay === false &&
                                        <div className={styles.dateShow}>
                                            <p>{message.dateShow}</p>
                                        </div>
                                    }
                                    <div className={styles.containerMessageLeft} >
                                        <div className={styles.containerLeft}>
                                            {(message.sameAuth === false || message.sameDay === false
                                                || (index == 0 && message?.sender?._id != userDetails._id)
                                            ) && <Avatar
                                                    src={message?.sender?.avatar ? message?.sender?.avatar : ''}
                                                    width={30}
                                                />
                                            }
                                        </div>
                                        <MessageLeft
                                            message={message}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                <div style={{ height: '20px' }}></div>
            </div>
        </>
    )
}

export default MessageArea;