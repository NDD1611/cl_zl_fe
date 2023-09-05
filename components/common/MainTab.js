

import styles from './MainTab.module.scss'
import Avatar from './Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faAddressBook } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { tabsActions } from '../../redux/actions/tabsAction';
import { useRouter } from 'next/router';
import { logout } from '../../utils/auth'
import { useState, useEffect } from 'react';
import ModalDisplayInfo from './Modal/ModalDisplayInfo';
import { modalActions } from '../../redux/actions/modalActions';
import ModalUpdateInfo from './Modal/ModalUpdateInfo';
import addPathToLinkAvatar from '../../utils/path';
import { authActions } from '../../redux/actions/authAction';

const MainTab = () => {

    const dispatch = useDispatch()
    const [showToggle, setShowToggle] = useState(false)
    const router = useRouter()
    const maintabSelect = useSelector(state => state.tabs.maintabSelect)
    const countAnnounceMessage = useSelector(state => state.tabs.countAnnounceMessage)
    const pendingInvitation = useSelector(state => state.friend.pendingInvitations)
    const conversations = useSelector(state => state.conversation.conversations)

    const avatarLink = useSelector(state => state.auth.userDetails.avatar)

    useEffect(() => {
        if (conversations) {
            const userDetails = JSON.parse(localStorage.getItem('userDetails'))
            let userId = userDetails._id
            let count = 0
            conversations.forEach(conversation => {
                let messages = conversation.messages
                messages.forEach(message => {
                    if (message.receiverId === userId && message.status === '2') {
                        count++
                    }
                })
            });
            dispatch({
                type: tabsActions.SET_COUNT_ANNOUNCE_MESSAGE,
                countAnnounceMessage: count
            })
        }
    }, [conversations])

    useEffect(() => {
        const handleDomClick = () => {
            setShowToggle(false)
        }
        const userFromLocalStoge = JSON.parse(localStorage.getItem('userDetails'))
        dispatch({
            type: authActions.SET_USER_DETAIL,
            userDetails: userFromLocalStoge
        })
        document.addEventListener('click', handleDomClick)

        return () => {
            document.removeEventListener('click', handleDomClick)
        }
    }, [])

    useEffect(() => {
        console.log('responsive in MainTab')
        window.addEventListener('resize', () => {
            console.log('window resize', window.innerWidth)
            if (window.innerWidth < 800) {
                dispatch({
                    type: tabsActions.SET_CLOSE_TAB_THREE
                })
            } else {
                dispatch({
                    type: tabsActions.SET_SHOW_TAB_THREE
                })
                dispatch({
                    type: tabsActions.SET_SHOW_TAB_TWO
                })
            }
        })
        if (window.innerWidth < 800) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_THREE
            })
        } else {
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_SHOW_TAB_TWO
            })
        }
        return () => {

        }
    }, [])

    const clickChat = () => {
        dispatch({
            type: tabsActions.SET_MAIN_TAB,
            maintabSelect: 'chat'
        })
        if (window.innerWidth < 800) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_SHOW_TAB_TWO
            })
        } else {
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_SHOW_TAB_TWO
            })
        }
        router.push('/')
    }
    const clickFriend = () => {
        dispatch({
            type: tabsActions.SET_MAIN_TAB,
            maintabSelect: 'friend'
        })
        if (window.innerWidth < 800) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_SHOW_TAB_TWO
            })
        } else {
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_SHOW_TAB_TWO
            })
        }
        router.push('/friend')
    }
    const handleShowToggle = (e) => {
        e.stopPropagation()
        setShowToggle(true)
    }
    return (
        <div className={styles.mainTab}>

            < ModalDisplayInfo />
            <ModalUpdateInfo />

            <div className={styles.top}>
                <div className={`${styles.avatar} + ${styles.quare}`}>
                    <Avatar
                        src={addPathToLinkAvatar(avatarLink)}
                        width={50}
                    ></Avatar>
                </div>
                <div className={`${styles.quare} ${maintabSelect === 'chat' ? styles.maintabSelect : ''}`} onClick={clickChat}>
                    <FontAwesomeIcon icon={faComments} />
                    {countAnnounceMessage != 0
                        ?
                        <div className={styles.quantityMessageReceived}>
                            <span>{countAnnounceMessage}</span>
                        </div>
                        : ''
                    }
                </div>
                <div className={`${styles.quare} ${maintabSelect === 'friend' ? styles.maintabSelect : ''}`} onClick={clickFriend}>
                    <FontAwesomeIcon icon={faAddressBook} />
                    {
                        pendingInvitation.length !== 0 && <div className={styles.quantityFriendInvitation}>
                            <span>{pendingInvitation.length}</span>
                        </div>
                    }
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={`${styles.quare}`} onClick={(e) => { handleShowToggle(e) }}>
                    <FontAwesomeIcon icon={faGear} />

                    <div className={`${styles.toggleMenu} ${showToggle ? '' : styles.hideToggle}`}>
                        <div onClick={() => { dispatch({ type: modalActions.SET_SHOW_MODAL_INFO }) }}>Thông tin tài khoản</div>
                        <div className={styles.logout} onClick={() => { logout() }}>Đăng xuất </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainTab;