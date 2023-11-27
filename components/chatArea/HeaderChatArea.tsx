
import { useSelector, useDispatch } from "react-redux"
import styles from './HeaderChatArea.module.scss'
import { useEffect, useState } from "react"
import { tabsActions } from "../../redux/actions/tabsAction"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import LoaderModal from '../common/Modal/LoaderModal'
import api from '../../api/api'
import { modalActions } from "../../redux/actions/modalActions"
import { toast } from "react-toastify"
import { friendActions } from "../../redux/actions/friendAction"
import { Avatar, Box, Button, Center, Indicator } from "@mantine/core"
import { useLingui } from "@lingui/react"
import { IconUserPlus } from "@tabler/icons-react"

const HeaderChatArea = () => {
    let i18n = useLingui()
    const dispatch = useDispatch()
    const conversationSelected = useSelector((state: any) => state.conversation.conversationSelected)
    const activeUsers = useSelector((state: any) => state.auth.activeUsers)
    const listFriends = useSelector((state: any) => state.friend.listFriends)
    const isFriend = useSelector((state: any) => state.friend.isFriend)
    const [receiverUser, setReceiverUser] = useState<any>({})
    const [showLoader, setShowLoader] = useState(false)
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
        const response: any = await api.friendInvitation({
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
            {showLoader && <LoaderModal />}
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    {
                        window.innerWidth < 700 &&
                        <div className={styles.backButton} onClick={handleBackConversation}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    }
                    <div className={styles.headerAvatar}>
                        <Center>
                            {
                                activeUsers.includes(receiverUser._id) ?
                                    <Indicator size={16} offset={7} position="bottom-end" color="green" withBorder>
                                        <Avatar src={receiverUser.avatar} size={'lg'} alt='avatar' />
                                    </Indicator>
                                    :
                                    <Avatar src={receiverUser.avatar} size={'lg'} alt='avatar' />
                            }
                        </Center>
                    </div>
                    <div className={styles.headerName}>
                        <p className={styles.name}> {receiverUser && receiverUser.firstName + ' ' + receiverUser.lastName}</p>
                        {activeUsers.includes(receiverUser._id) && isFriend && <p className={styles.minuteActive}>{i18n._("just accessed")}</p>}
                        {!isFriend && <p className={styles.stranger}>{i18n._("Stranger")}</p>}
                    </div>
                </div>
            </div>
            {
                !isFriend &&
                <Box component="div" className={styles.sendInviteFriend}>
                    <Box component="div" p={10}>
                        <IconUserPlus size={20} />
                        <Box component="span" ml={10}>{i18n._("Send a friend request to this person")}</Box>
                    </Box>
                    <Button mr={30} p={5} component="div" onClick={addFriend} >{i18n._("Make friend")}</Button>
                </Box>
            }
        </div>
    )
}

export default HeaderChatArea;