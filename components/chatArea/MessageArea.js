
import styles from './MessageArea.module.scss'
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import Avatar from '../common/Avatar'
import { addSameDayAndSameAuth, checkShowTimeInBottom } from '../../utils/message';
import addPathToLinkAvatar from '../../utils/path'

const MessageArea = () => {
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)
    const [messages, setMessages] = useState([])
    const [maxWidthMessage, setMaxWidthMessage] = useState('300px')
    const [receiverUser, setReceiverUser] = useState({})
    const [userDetails, setUserDetails] = useState({})


    const messageAreaElement = useRef()

    useEffect(() => {
        setReceiverUser(JSON.parse(localStorage.getItem('receiverUser')))
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
        const conversationId = conversationSelected._id
        conversations.forEach((conversation) => {
            if (conversationId === conversation._id) {

                addSameDayAndSameAuth(conversation.messages)
                checkShowTimeInBottom(conversation.messages)

                setMessages(conversation.messages)
            }
        })
        if (messageAreaElement.current) {
            setMaxWidthMessage((messageAreaElement.current.clientWidth * 0.75) + 'px')
            messageAreaElement.current.scrollTop = messageAreaElement.current.scrollHeight
        }
    }, [conversationSelected, conversations])

    useEffect(() => {
        if (messageAreaElement.current) {
            messageAreaElement.current.scrollTop = messageAreaElement.current.scrollHeight
        }
    }, [messages])
    return (
        <>
            <div
                id='messageArea'
                className={styles.messageArea}
                ref={messageAreaElement}
            >
                {messages.length < 100 &&
                    <div className={styles.paddingHeader}>
                    </div>
                }
                {
                    messages && messages.map((message) => {
                        // console.log(message)
                        if (message.typeAnnounce === "acceptFriend") {
                            if (message.senderId === userDetails._id) {
                                return (
                                    <div key={message._id}>
                                        {
                                            message.sameDay === false &&
                                            <div className={styles.dateShow}>
                                                <p>
                                                    {message.dateShow}
                                                </p>
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
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={message._id}>
                                        {
                                            message.sameDay === false &&
                                            <div className={styles.dateShow}>
                                                <p>
                                                    {message.dateShow}
                                                </p>
                                            </div>
                                        }
                                        <div className={styles.acceptFriend}>
                                            <p> bạn vừa mới kết bạn với</p>
                                            <Avatar
                                                src={receiverUser ? addPathToLinkAvatar(receiverUser.avatar) : ''}
                                                width={20}
                                            />
                                            <p>
                                                {receiverUser ? receiverUser.firstName + ' ' + receiverUser.lastName : ''}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }
                        }
                        if (message.senderId === receiverUser._id) {
                            if (message.sameAuth === false || message.sameDay === false) {
                                return (
                                    <div key={message._id}>
                                        {
                                            message.sameDay === false &&
                                            <div className={styles.dateShow}>
                                                <p>
                                                    {message.dateShow}
                                                </p>
                                            </div>
                                        }
                                        <div className={styles.messageLeft} >
                                            <Avatar
                                                src={receiverUser ? addPathToLinkAvatar(receiverUser.avatar) : ''}
                                                width={30}
                                            />
                                            <div className={styles.content}
                                                style={{ maxWidth: maxWidthMessage ? maxWidthMessage : '' }}>
                                                {message.content}
                                                <div className={styles.footerDate}>{message.showTime ? message.hourMinute : ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={message._id}>
                                        {
                                            message.sameDay === false &&
                                            <div className={styles.dateShow}>
                                                <p>
                                                    {message.dateShow}
                                                </p>
                                            </div>
                                        }
                                        <div
                                            className={`${styles.messageLeft} ${styles.sameAuth}`}
                                        >
                                            <div className={styles.content}
                                                style={{ maxWidth: maxWidthMessage ? maxWidthMessage : '' }}>
                                                {message.content}
                                                <div className={styles.footerDate}>{message.showTime ? message.hourMinute : ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        }
                        else if (message.senderId === userDetails._id) {
                            return (
                                <div key={message._id}>
                                    {
                                        message.sameDay === false &&
                                        <div className={styles.dateShow}>
                                            <p>
                                                {message.dateShow}
                                            </p>
                                        </div>
                                    }
                                    <div className={styles.messageRight}
                                    >
                                        <div className={styles.content}
                                            style={{ maxWidth: maxWidthMessage ? maxWidthMessage : '' }}
                                        >
                                            {message.content}
                                            <div className={styles.footerDate}>{message.showTime ? message.hourMinute : ''}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })
                }

                <div className={styles.paddingfooter}></div>
            </div>
        </>
    )
}

export default MessageArea;