
import styles from './MessageArea.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import Avatar from '../common/Avatar'
import { addSameDayAndSameAuth, checkShowTimeAndStatusInBottom } from '../../utils/message'
import { addPathToLinkAvatar } from '../../utils/path'
import { updateStatusMessage } from '../../reltimeCommunication/socketConnection'
import { conversationActions } from '../../redux/actions/conversationAction'
import MessageLeftAvatar from './messageLeftAvatar'
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
        if (receiverUser && userDetails) {
            // emit update sender
            updateStatusMessage({
                receiverId: userDetails._id,
                senderId: receiverUser._id,
                conversationId: conversationSelected._id
            })
            //update myself
            dispatch({
                type: conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES,
                receiverId: userDetails._id,
                senderId: receiverUser._id,
                conversationId: conversationSelected._id
            })
        }
    }, [messages])

    useEffect(() => {
        let widthChatArea
        if (window.innerWidth < 700) {
            widthChatArea = parseInt((window.innerWidth - 64) * 0.7)  // width cua mainTab and TabTwo  
        } else {
            widthChatArea = parseInt((window.innerWidth - 64 - 344) * 0.7) // width cua mainTab and TabTwo   
        }
        dispatch({
            type: messageActions.SET_MAX_WIDTH_MESSAGE,
            maxWidth: widthChatArea
        })
    }, [])

    useEffect(() => {
        if (messageAreaElement.current) {
            messageAreaElement.current.scrollTop = messageAreaElement.current.scrollHeight
        }
    })
    return (
        <>
            <div
                id='messageArea'
                className={styles.messageArea}
                ref={messageAreaElement}
            >
                {
                    messages && messages.map((message, index) => {
                        if (message.typeAnnounce === "acceptFriend") {
                            if (message.senderId === userDetails._id) {
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
                                                src={receiverUser ? addPathToLinkAvatar(receiverUser.avatar) : ''}
                                                width={20}
                                            />
                                            <p>
                                                {receiverUser ? receiverUser.firstName + ' ' + receiverUser.lastName : ''}
                                            </p>
                                            <p> đã đồng ý kết bạn</p>
                                        </div>
                                        {messages.length - 1 == index && <div className={styles.paddingFooter}></div>}
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
                                                src={receiverUser ? addPathToLinkAvatar(receiverUser.avatar) : ''}
                                                width={20}
                                            />
                                            <p>
                                                {receiverUser ? receiverUser.firstName + ' ' + receiverUser.lastName : ''}
                                            </p>
                                        </div>
                                        {messages.length - 1 == index && <div className={styles.paddingFooter}></div>}
                                    </div>
                                )
                            }
                        }


                        if (index == 0 && message.senderId === receiverUser._id) {
                            return (
                                <div key={message._id} >
                                    <MessageLeftAvatar
                                        message={message}
                                        receiverUser={receiverUser}
                                    />
                                    {messages.length - 1 == index && <div className={styles.paddingFooter}></div>}
                                </div>
                            )
                        }

                        if (message.senderId === receiverUser._id) {
                            if (message.sameAuth === false || message.sameDay === false) {
                                return (
                                    <div key={message._id} >
                                        <MessageLeftAvatar
                                            message={message}
                                            receiverUser={receiverUser}
                                        />
                                        {messages.length - 1 == index && <div className={styles.paddingFooter}></div>}
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={message._id} >
                                        <MessageLeft
                                            message={message}
                                        />
                                        {messages.length - 1 == index && <div className={styles.paddingFooter}></div>}
                                    </div>
                                )
                            }
                        } else if (message.senderId === userDetails._id) {
                            return (
                                <div key={message._id} >
                                    <MessageRight
                                        message={message}
                                    />
                                    {messages.length - 1 == index && <div className={styles.paddingFooter}></div>}
                                </div>
                            )
                        }
                    })
                }
            </div>
        </>
    )
}

export default MessageArea;