
import styles from './Conversation.module.scss'
import Avatar from '../Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import addPathToLinkAvatar from '../../../utils/path'
import { conversationActions } from '../../../redux/actions/conversationAction';

const Conversation = ({ conversation }) => {
    const userDetails = useSelector(state => state.auth.userDetails)
    const [friend, setFriend] = useState({})
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

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
            setMessage(lastMessage.content)
        }
    }, [message, conversation])

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

            </div>
        </div>
    )
}

export default Conversation;