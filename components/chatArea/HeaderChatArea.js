
import { useSelector, useDispatch } from "react-redux"
import styles from './HeaderChatArea.module.scss'
import Avatar from "../common/Avatar"
import { useEffect, useState } from "react"
import { addPathToLinkAvatar } from "../../utils/path"
import { tabsActions } from "../../redux/actions/tabsAction"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import LoaderModal from '../common/Modal/LoaderModal'
import api from '../../api/api'
import { modalActions } from "../../redux/actions/modalActions"
import { toast } from "react-toastify"
import { friendActions } from "../../redux/actions/friendAction"

const HeaderChatArea = () => {
    const dispatch = useDispatch()
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const activeUsers = useSelector(state => state.auth.activeUsers)
    const listFriends = useSelector(state => state.friend.listFriends)
    const isFriend = useSelector(state => state.friend.isFriend)
    const [receiverUser, setReceiverUser] = useState({})
    const [showLodaer, setShowLoader] = useState(false)
    useEffect(() => {
        let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
        if (receiverUser) {
            setReceiverUser(receiverUser)
            if (listFriends) {
                let check = false
                listFriends.forEach(friend => {
                    if (friend._id == receiverUser._id) {
                        check = true
                    }
                })
                if (check) {
                    dispatch({
                        type: friendActions.SET_IS_FRIEND
                    })
                } else {
                    dispatch({
                        type: friendActions.SET_IS_NOT_FRIEND
                    })
                }
            }
        }
    }, [conversationSelected, listFriends])

    const handleBackConversation = () => {
        dispatch({
            type: tabsActions.SET_SHOW_TAB_TWO
        })
        dispatch({
            type: tabsActions.SET_CLOSE_TAB_THREE
        })
        dispatch({
            type: tabsActions.SET_SHOW_TAB_ONE
        })
    }

    const addFriend = async () => {
        let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        setShowLoader(true)
        const response = await api.friendInvitation({
            senderId: userDetails._id,
            receiverId: receiverUser._id
        })
        if (response.err) {
            setShowLoader(false)
            toast.error(response?.exception?.response?.data)
            dispatch({ type: modalActions.SET_HIDE_MODAL_FIND_FRIEND })
        } else {
            setShowLoader(false)
            toast.success(response?.data)
            dispatch({ type: modalActions.SET_HIDE_MODAL_FIND_FRIEND })
        }
    }

    return (
        conversationSelected &&
        <div id='headerChat' className={styles.headerChatArea}>
            {showLodaer && <LoaderModal />}
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    {
                        window.innerWidth < 700 &&
                        <div className={styles.backButton} onClick={handleBackConversation}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    }
                    <div className={styles.headerAvatar}>
                        <Avatar
                            src={addPathToLinkAvatar(receiverUser && receiverUser.avatar)}
                            width={50}
                        />
                        {activeUsers.includes(receiverUser._id) && <span className={styles.iconUserOnline}></span>}
                    </div>
                    <div className={styles.headerName}>
                        <p className={styles.name}> {receiverUser && receiverUser.firstName + ' ' + receiverUser.lastName}</p>
                        {activeUsers.includes(receiverUser._id) && isFriend && <p className={styles.minuteActive}>vừa truy cập</p>}
                        {!isFriend && <p className={styles.stranger}>Người lạ</p>}
                    </div>
                </div>
            </div>
            {
                !isFriend &&
                <div className={styles.sendInviteFriend}>
                    <div>
                        <FontAwesomeIcon icon={faUserPlus} />
                        <span>Gửi lời mời kết bạn tới người này</span>
                    </div>
                    <div className={styles.sendInvite} onClick={addFriend} >Gửi kết bạn</div>
                </div>
            }
        </div>
    )
}

export default HeaderChatArea;