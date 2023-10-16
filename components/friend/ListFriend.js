import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import styles from './ListFriend.module.scss'
import Avatar from '../common/Avatar'
import { tabsActions } from '../../redux/actions/tabsAction'
import MainModal from '../common/Modal/MainModal'
import api from '../../api/api'
import { conversationActions } from '../../redux/actions/conversationAction'
import { useRouter } from 'next/router'

const ListFriend = () => {
    const conversations = useSelector(state => state.conversation.conversations)
    const maintabSelect = useSelector(state => state.tabs.maintabSelect)
    const [showBackbutton, setShowBackButton] = useState(false)
    const listFriends = useSelector(state => state.friend.listFriends)
    const dispatch = useDispatch()
    const router = useRouter()
    useEffect(() => {
        if (window.innerWidth < 700) {
            setShowBackButton(true)
        } else {
            setShowBackButton(false)
        }
    }, [])

    const showTabTwoAndCloseTabThree = () => {
        dispatch({
            type: tabsActions.SET_CLOSE_TAB_THREE
        })
        dispatch({
            type: tabsActions.SET_SHOW_TAB_TWO
        })
    }
    const [idPopover, setIdPopover] = useState()
    const [clientXPopover, setClientXPopover] = useState(0)
    const [clientYPopover, setClientYPopover] = useState(0)
    const handleMouseRightClick = (e, id) => {
        e.preventDefault()
        let popoverElement = document.getElementById(id)
        // popoverElement.style.display = 'block'
        setIdPopover(id)
        const x = e.clientX - e.target.getBoundingClientRect().x;
        const y = e.clientY - e.target.getBoundingClientRect().y;
        setClientXPopover(x)
        setClientYPopover(y)

    }

    const handleClickShowInfoFriend = (friend) => {
        let date = new Date(friend.birthday)
        let day = date.getDate().toString()
        let month = (date.getMonth() + 1).toString()
        let year = date.getFullYear()
        let birthday = day + '/' + `${month < 10 ? 0 : ''}` + month + '/' + year
        setInfoFriend({
            ...friend,
            birthday
        })
        setIdPopover(undefined)
        setShowModalInfo(true)
    }
    const [infoFriend, setInfoFriend] = useState()
    const [showModalInfo, setShowModalInfo] = useState(false)
    const handleCloseModalInfo = () => {
        setShowModalInfo(false)
    }
    const handleDeleteFriend = async (friendId) => {
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        let data = {
            userId: userDetails._id,
            friendId: friendId
        }
        let response = await api.deleteFriend(data)
    }
    const handleClickSendMesage = async (friend) => {
        localStorage.setItem('receiverUser', JSON.stringify(friend))
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        let conversationSelected = null
        if (conversations) {
            conversations.forEach(conversation => {
                let participants = conversation.participants
                if (participants.length === 2 &&
                    (participants[0]._id === userDetails._id || participants[0]._id === friend._id)
                    && (participants[1]._id === userDetails._id || participants[1]._id === friend._id)
                ) {
                    conversationSelected = conversation
                }
            })
        }

        if (conversationSelected) {
            dispatch({
                type: conversationActions.SET_SELECT_CONVERSATION,
                conversationSelected: conversationSelected
            })
        } else {
            dispatch({
                type: conversationActions.SET_SELECT_CONVERSATION,
                conversationSelected: {
                    participants: [userDetails._id, friend._id],
                    messages: [],
                    date: new Date()
                }
            })
        }

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

        if (maintabSelect != 'chat') {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: 'chat'
            })
            router.push('/')
        }
    }
    return (
        <>
            <MainModal
                title='Thông tin tài khoản'
                closeModal={showModalInfo}
                setCloseModal={handleCloseModalInfo}
            >
                <div className={styles.contentModalInfo}>
                    <div className={styles.image}>
                        <img
                            src='/images/backgroundProfile.jpg'
                        />
                    </div>
                    <div className={styles.avatarInfo}>
                        <Avatar
                            src={infoFriend?.avatar ? infoFriend?.avatar : ''}
                            width={80}
                        ></Avatar>
                    </div>
                    <p className={styles.name}>{infoFriend && infoFriend.firstName + ' ' + infoFriend.lastName}</p>
                    <div className={styles.userInfo}>
                        <p>Thông tin cá nhân</p>
                        <div>
                            <p>Email</p>
                            <p>{infoFriend ? infoFriend.email : ''}</p>
                        </div>
                        <div>
                            <p>Giới tính</p>
                            <p>{infoFriend && (infoFriend.sex ? infoFriend.sex : 'chưa có thông tin')}</p>
                        </div>
                        <div>
                            <p>Ngày sinh</p>
                            <p>{infoFriend && (infoFriend.birthday ? infoFriend.birthday : 'chưa có thông tin')}</p>
                        </div>
                    </div>
                </div>
            </MainModal>
            <div className={styles.listFriend}>
                <div className={styles.headerInvitation}>
                    {showBackbutton &&
                        <div className={styles.backButton} onClick={showTabTwoAndCloseTabThree}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    }
                    <FontAwesomeIcon className={styles.headerIcon} icon={faUser} />
                    Danh sách bạn bè
                </div>
                <div>
                    {
                        listFriends.length === 0 && <div className={styles.noFriend}>
                            Bạn chưa có bạn bè
                        </div>
                    }
                    {
                        listFriends.map((friend) => {
                            return (
                                <div key={friend._id} className={styles.friendItem}
                                    onContextMenu={(e) => { handleMouseRightClick(e, friend._id) }}
                                    onClick={(e) => { handleClickSendMesage(friend) }}
                                >
                                    <div className={styles.left}>
                                        <Avatar
                                            width={50}
                                            src={friend.avatar ? friend.avatar : ''}
                                        />
                                        <div className={styles.name}>{friend.firstName + ' ' + friend.lastName}</div>
                                    </div>
                                    <div className={styles.right}>
                                        {/* icon */}
                                    </div>

                                    {idPopover == friend._id &&
                                        <div style={{
                                            left: clientXPopover,
                                            top: clientYPopover
                                        }} className={styles.popover}>
                                            <div onClick={() => { handleClickShowInfoFriend(friend) }} >Xem thông tin</div>
                                            <div className={styles.delete} onClick={() => { handleDeleteFriend(friend._id) }}>Xóa bạn</div>
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default ListFriend;