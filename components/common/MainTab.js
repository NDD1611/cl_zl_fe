import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faAddressBook } from '@fortawesome/free-regular-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import styles from './MainTab.module.scss'
import Avatar from './Avatar'
import { tabsActions } from '../../redux/actions/tabsAction'
import { useRouter } from 'next/router'
import { logout } from '../../utils/auth'
import { useState, useEffect } from 'react'
import ModalDisplayInfo from './Modal/ModalDisplayInfo'
import { modalActions } from '../../redux/actions/modalActions'
import ModalUpdateInfo from './Modal/ModalUpdateInfo'
import { authActions } from '../../redux/actions/authAction'

const MainTab = () => {
    const dispatch = useDispatch()
    const [showToggle, setShowToggle] = useState(false)
    const router = useRouter()
    const maintabSelect = useSelector(state => state.tabs.maintabSelect)
    const countAnnounceMessage = useSelector(state => state.tabs.countAnnounceMessage)
    const pendingInvitation = useSelector(state => state.friend.pendingInvitations)
    const conversations = useSelector(state => state.conversation.conversations)
    const avatarLink = useSelector(state => state.auth.userDetails.avatar)
    const showTabOne = useSelector(state => state.tabs.showTabOne)
    const showTabTwo = useSelector(state => state.tabs.showTabTwo)
    const showTabThree = useSelector(state => state.tabs.showTabThree)

    useEffect(() => {
        if (conversations) {
            const userDetails = JSON.parse(localStorage.getItem('userDetails'))
            let count = 0
            conversations.forEach(conversation => {
                let messages = conversation.messages
                if (messages.length) {
                    messages.forEach(message => {
                        console.log(message)
                        if ((message.sender._id != userDetails._id && message.status == '2')
                            || (message.status == '2' && message.type === 'accept_friend')) {
                            count++
                        }
                    })
                }
            })
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
        if (window.innerWidth < 700 && showTabTwo && showTabThree) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_THREE
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
        if (window.innerWidth < 700) {
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
        const { locale } = router
        router.push('/', '/', { locale: locale })
    }

    const clickFriend = () => {
        dispatch({
            type: tabsActions.SET_MAIN_TAB,
            maintabSelect: 'friend'
        })
        if (window.innerWidth < 700) {
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
        const { locale } = router
        router.push('/friend', '/friend', { locale: locale })
    }

    const handleShowToggle = (e) => {
        e.stopPropagation()
        setShowToggle(true)
    }
    if (showTabOne)
        return (
            <div className={styles.mainTab}>
                < ModalDisplayInfo />
                <ModalUpdateInfo />
                <div className={styles.top}>
                    <div className={`${styles.avatar} + ${styles.quare}`}>
                        <Avatar
                            src={avatarLink ? avatarLink : ''}
                            width={48}
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
                            <div onClick={() => { dispatch({ type: modalActions.SET_SHOW_MODAL_INFO }) }}>{i18n._('Account information')}</div>
                            <div className={styles.logout} onClick={() => { logout() }}>{i18n._('Logout')}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default MainTab;