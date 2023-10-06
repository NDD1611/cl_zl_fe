
import styles from './Conversation.module.scss'
import Avatar from '../Avatar'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { conversationActions } from '../../../redux/actions/conversationAction'
import { updateReceivedMessageStatus } from '../../../reltimeCommunication/socketConnection'
import { tabsActions } from '../../../redux/actions/tabsAction'
import MessageEmoji from '../MessageEmoji'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Conversation = ({ conversation }) => {
    const userDetails = useSelector(state => state.auth.userDetails)
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)
    const countAnnounceMessage = useSelector(state => state.tabs.countAnnounceMessage)
    const [friend, setFriend] = useState({})
    const [message, setMessage] = useState('')
    const [countMessageReceived, setCountMessageReceived] = useState(0)

    const dispatch = useDispatch()

    useEffect(() => {
        // update received message status
        // update in redux 
        if (userDetails) {
            let listMessageStatusEqual1 = []
            conversation?.messages.forEach(message => {
                if (message.sender._id != userDetails._id && message.status == '1') {
                    listMessageStatusEqual1.push(message)
                }
            })
            if (listMessageStatusEqual1.length != 0) {
                updateReceivedMessageStatus({
                    conversationId: conversation._id,
                    listMessage: listMessageStatusEqual1
                })
                dispatch({
                    type: conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES,
                    conversationId: conversation._id,
                    listMessage: listMessageStatusEqual1
                })
            }
        }
    }, [message])
    useEffect(() => {
        const { participants, messages } = conversation
        let friend = null
        if (participants) {
            participants.forEach((user) => {
                if (user._id !== userDetails._id) {
                    setFriend(user)
                    friend = user
                }
            })
        }
        if (messages.length) {
            const lastMessage = messages[messages.length - 1]
            if (lastMessage.type === "accept_friend") {
                if (userDetails._id === lastMessage.sender._id) {
                    let mesTemp = friend.firstName + ' ' + friend.lastName + ' ' + 'đã đồng ý kết bạn'
                    setMessage({ content: mesTemp, type: 'text' })
                } else {
                    let mesTemp = 'Bạn vừa kết bạn với ' + friend.firstName + ' ' + friend.lastName
                    setMessage({ content: mesTemp, type: 'text' })
                }
            } else if (lastMessage.type == 'text') {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({ content: 'Bạn: ' + lastMessage.content, type: 'text' })
                } else {
                    setMessage({ content: lastMessage.content, type: 'text' })
                }
            } else if (lastMessage.type == 'image') {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({ content: 'Bạn: ', type: 'image' })
                } else {
                    setMessage({ content: '', type: 'image' })
                }
            }
        }

        let listMessages = conversation.messages
        let count = 0
        for (let message of listMessages) {
            if ((message.status && message.status == '2' && message.sender._id != userDetails._id)
                || (message.status == 2 && message.type === 'accept_friend')) {
                count++
            }
        }
        setCountMessageReceived(count)
    }, [conversation, conversations])

    const handleChooseConversation = () => {
        localStorage.setItem('receiverUser', JSON.stringify(friend))
        dispatch({
            type: conversationActions.SET_SELECT_CONVERSATION,
            conversationSelected: conversation
        })
        if (window.innerWidth < 700) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_TWO
            })
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_ONE
            })
        }
    }
    return (
        <div className={`${styles.conversationItem} ${conversationSelected && conversation._id == conversationSelected._id && styles.selectedConversation}`} onClick={handleChooseConversation}>
            <div className={styles.left}>
                <Avatar
                    src={friend.avatar ? friend.avatar : ''}
                    width={50}
                />
            </div>
            <div className={styles.center}>
                <div>
                    <div className={styles.name}>{friend.firstName + ' ' + friend.lastName}</div>
                    <div className={styles.message}>
                        {
                            message.type == 'text' &&
                            <MessageEmoji text={message.content} />
                        }
                        {
                            message.type == 'image' &&
                            <div>{message.content}
                                <FontAwesomeIcon className={styles.iconImage} icon={faImage} />
                                Hình ảnh
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                {
                    countMessageReceived !== 0 && <span className={styles.annouceMessage}>
                        {countMessageReceived}
                    </span>
                }
            </div>
        </div>
    )
}

export default Conversation;