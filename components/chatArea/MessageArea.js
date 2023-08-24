
import styles from './MessageArea.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import Avatar from '../common/Avatar'
import { addSameDayAndSameAuth, checkShowTimeAndStatusInBottom } from '../../utils/message';
import addPathToLinkAvatar from '../../utils/path'
import { updateStatusMessage } from '../../reltimeCommunication/socketConnection';
import { conversationActions } from '../../redux/actions/conversationAction';

const MessageArea = () => {
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)
    const [messages, setMessages] = useState([])
    const [maxWidthMessage, setMaxWidthMessage] = useState('300px')
    const [receiverUser, setReceiverUser] = useState({})
    const [userDetails, setUserDetails] = useState({})


    const messageAreaElement = useRef()

    const dispatch = useDispatch()

    useEffect(() => {
        setReceiverUser(JSON.parse(localStorage.getItem('receiverUser')))
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
        const conversationId = conversationSelected._id

        conversations.forEach((conversation) => {
            if (conversationId === conversation._id) {
                addSameDayAndSameAuth(conversation.messages)
                checkShowTimeAndStatusInBottom(conversation.messages)

                setMessages(conversation.messages)
            }
        })
        if (messageAreaElement.current) {
            setMaxWidthMessage((messageAreaElement.current.clientWidth * 0.75) + 'px')
            messageAreaElement.current.scrollTop = messageAreaElement.current.scrollHeight
        }

    }, [conversationSelected, conversations])

    // useEffect(() => {
    //     dispatch({
    //         type: conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES,
    //         conversationId: conversationSelected._id
    //     })
    // }, [conversationSelected])
    useEffect(() => {
        if (messageAreaElement.current) {
            messageAreaElement.current.scrollTop = messageAreaElement.current.scrollHeight
        }
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
                                                style={{ maxWidth: maxWidthMessage ? maxWidthMessage : '' }}
                                            >
                                                {message.content}
                                                <div className={styles.footerDate}>{message.showTime ? message.hourMinute : ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        } else if (message.senderId === userDetails._id) {
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
                                    <div className={styles.status}>
                                        {message.showStatus ? <span className={styles.contentStatus}>{message.statusText}</span> : ''}
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