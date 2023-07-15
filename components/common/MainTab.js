

import styles from './MainTab.module.scss'
import Avatar from './Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faAddressBook } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { maintabActions } from '../../redux/actions/maintabAction';
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
    const maintabSelect = useSelector(state => state.maintab.maintabSelect)
    const [userDetails, setUserDetails] = useState({})

    const avatarLink = useSelector(state => state.auth.userDetails.avatar)

    useEffect(() => {
        const handleDomClick = () => {
            setShowToggle(false)
        }
        const userFromLocalStoge = JSON.parse(localStorage.getItem('userDetails'))
        setUserDetails(userFromLocalStoge)

        dispatch({
            type: authActions.SET_USER_DETAIL,
            userDetails: userFromLocalStoge
        })

        document.addEventListener('click', handleDomClick)

        return () => {
            document.removeEventListener('click', handleDomClick)
        }
    }, [])

    const clickChat = () => {
        dispatch({
            type: maintabActions.SET_MAIN_TAB,
            maintabSelect: 'chat'
        })
        router.push('/')
    }
    const clickFriend = () => {
        dispatch({
            type: maintabActions.SET_MAIN_TAB,
            maintabSelect: 'friend'
        })
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
                </div>
                <div className={`${styles.quare} ${maintabSelect === 'friend' ? styles.maintabSelect : ''}`} onClick={clickFriend}>
                    <FontAwesomeIcon icon={faAddressBook} />
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