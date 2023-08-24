
import styles from './Conversation.module.scss'
import Avatar from '../Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import addPathToLinkAvatar from '../../../utils/path'
import { conversationActions } from '../../../redux/actions/conversationAction';
import { updateReceivedMessageStatus } from '../../../reltimeCommunication/socketConnection';
import { maintabActions } from '../../../redux/actions/maintabAction';

const Conversation = ({ conversation }) => {
    const userDetails = useSelector(state => state.auth.userDetails)
    const conversations = useSelector(state => state.conversation.conversations)
    const countAnnounceMessage = useSelector(state => state.maintab.countAnnounceMessage)
    const [friend, setFriend] = useState({})
    const [message, setMessage] = useState('')
    const [countMessageReceived, setCountMessageReceived] = useState(0)

    const dispatch = useDispatch()

    useEffect(() => {
        // update received message status
        // update in redux 
        if (friend && userDetails) {
            dispatch({
                type: conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES,
                conversationId: conversation._id,
                receiverId: userDetails._id,
                senderId: friend._id
            })

            // update in sender user
            updateReceivedMessageStatus({
                conversationId: conversation._id,
                receiverId: userDetails._id,
                senderId: friend._id
            })
        }

    }, [friend])
    useEffect(() => {
        const { participants, messages } = conversation
        if (participants) {
            participants.forEach((user) => {
                if (user._id !== userDetails._id) {
                    setFriend(user)
                }
            })
        }
        const lastMessage = messages[messages.length - 1]
        if (lastMessage.isAnnounceFromServer && lastMessage.typeAnnounce === "acceptFriend") {
            if (userDetails._id === lastMessage.senderId) {
                let mesTemp = friend.firstName + ' ' + friend.lastName + ' ' + 'đã đồng ý kết bạn'
                setMessage(mesTemp)
            } else if (userDetails._id === lastMessage.receiverId) {
                let mesTemp = 'Bạn vừa kết bạn với ' + friend.firstName + ' ' + friend.lastName
                setMessage(mesTemp)
            }
        } else {
            if (lastMessage.senderId === userDetails._id) {
                setMessage('Bạn: ' + lastMessage.content)
            } else {
                setMessage(lastMessage.content)
            }
        }


        let listMessages = conversation.messages
        let count = 0
        for (let message of listMessages) {
            if (message.status && message.status == 2 && message.receiverId == userDetails._id) {
                count++
            }
        }
        setCountMessageReceived(count)
    }, [message, conversation, conversations])

    const handleChooseConversation = () => {
        localStorage.setItem('receiverUser', JSON.stringify(friend))
        dispatch({
            type: conversationActions.SET_SELECT_CONVERSATION,
            conversationSelected: conversation
        })
    }

    return (
        <div className={styles.conversationItem} onClick={handleChooseConversation}>
            <div className={styles.left}>
                <Avatar
                    src={addPathToLinkAvatar(friend.avatar)}
                    width={50}
                />
            </div>
            <div className={styles.center}>
                <div>
                    <div className={styles.name}>{friend.firstName + ' ' + friend.lastName}</div>
                    <div className={styles.message}>{message}</div>
                </div>
            </div>
            <div className={styles.right}>
                {
                    countMessageReceived !== 0 ? <pan className={styles.annouceMessage}>
                        {countMessageReceived}
                    </pan> : ''
                }
            </div>
        </div>
    )
}

export default Conversation;