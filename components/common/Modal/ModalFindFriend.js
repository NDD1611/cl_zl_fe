import styles from './ModalFindFriend.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { modalActions } from '../../../redux/actions/modalActions'
import { tabsActions } from '../../../redux/actions/tabsAction'
import { conversationActions } from '../../../redux/actions/conversationAction'
import api from '../../../api/api'
import { toast } from 'react-toastify'
import LoaderModal from './LoaderModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Avatar from '../Avatar'
import { useRouter } from 'next/router'

const ModalAddFriend = () => {
    const showModalFindFriend = useSelector(state => state.modal.showModalFindFriend)
    const conversations = useSelector(state => state.conversation.conversations)
    const listFriends = useSelector(state => state.friend.listFriends)
    const maintabSelect = useSelector(state => state.tabs.maintabSelect)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [infoFindFriend, setInfoFindFriend] = useState()
    const [showLoader, setShowLoader] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const router = useRouter()

    const addFriend = async () => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'))
        setShowLoader(true)
        const response = await api.friendInvitation({
            senderId: userDetails._id,
            receiverId: infoFindFriend._id
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
        setInfoFindFriend(undefined)
    }

    const handleFindFriend = async () => {
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        setInfoFindFriend(undefined)
        if (email === userDetails.email) {
            dispatch({
                type: modalActions.SET_SHOW_MODAL_INFO
            })
        } else {
            setShowLoader(true)
            const response = await api.findFriend({ email: email })
            if (response.data && response.data.err) {
                toast.error(response.data.mes)
            } else {
                let userFind = response.data
                let date = new Date(userFind.birthday)
                let day = date.getDate().toString()
                let month = (date.getMonth() + 1).toString()
                let year = date.getFullYear()
                let birthday = day + '/' + `${month < 10 ? 0 : ''}` + month + '/' + year
                setInfoFindFriend({
                    ...userFind,
                    birthday
                })

                // check isFriend 
                let check = false
                if (listFriends) {
                    listFriends.forEach(friend => {
                        if (friend._id == userFind._id) {
                            check = true
                        }
                    })
                }
                setIsFriend(check)
            }
            setShowLoader(false)
        }
    }
    const handleCloseModalFindFriend = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_FIND_FRIEND })
        setInfoFindFriend(undefined)
    }
    const handleClickSendMesage = async () => {
        localStorage.setItem('receiverUser', JSON.stringify(infoFindFriend))
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        let conversationSelected = null
        if (conversations) {
            conversations.forEach(conversation => {
                let participants = conversation.participants
                if (participants.length === 2 &&
                    (participants[0]._id === userDetails._id || participants[0]._id === infoFindFriend._id)
                    && (participants[1]._id === userDetails._id || participants[1]._id === infoFindFriend._id)
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
            handleCloseModalFindFriend()
        } else {
            dispatch({
                type: conversationActions.SET_SELECT_CONVERSATION,
                conversationSelected: {
                    participants: [userDetails._id, infoFindFriend._id],
                    messages: [],
                    date: new Date()
                }
            })
            handleCloseModalFindFriend()
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
            <div className={`${styles.MainModal} ${showModalFindFriend ? '' : styles.closeModal}`}>
                <div className={styles.backgroundOpacity}></div>
                <div className={styles.content}>
                    <div className={styles.title}>Thêm bạn
                        <div className={styles.closeX} onClick={handleCloseModalFindFriend} >
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>
                    {showLoader && <LoaderModal />}
                    <div className={styles.inputEmail}>
                        <input value={email} placeholder='Email...'
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </div>

                    {infoFindFriend &&
                        <div className={styles.contentModalInfo}>
                            <div className={styles.image}>
                                <img
                                    src='/images/backgroundProfile.jpg'
                                />
                            </div>
                            <div className={styles.avatarInfo}>
                                <Avatar
                                    src={infoFindFriend.avatar ? infoFindFriend.avatar : ''}
                                    width={80}
                                ></Avatar>
                            </div>
                            <p className={styles.name}>{infoFindFriend.firstName + ' ' + infoFindFriend.lastName}</p>

                            <div className={styles.addFriendBtns}>
                                <button className={styles.btnCancel}
                                    onClick={handleClickSendMesage}>
                                    Nhắn tin
                                </button>
                                {
                                    !isFriend && <button className={styles.btnCancel}
                                        onClick={addFriend}>Kết bạn</button>
                                }
                            </div>
                            <div className={styles.userInfo}>
                                <p>Thông tin cá nhân</p>
                                <div>
                                    <p>Email</p>
                                    <p>{infoFindFriend.email}</p>
                                </div>
                                <div>
                                    <p>Giới tính</p>
                                    <p>{infoFindFriend.sex ? infoFindFriend.sex : 'chưa có thông tin'}</p>
                                </div>
                                <div>
                                    <p>Ngày sinh</p>
                                    <p>{infoFindFriend.birthday ? infoFindFriend.birthday : 'chưa có thông tin'}</p>
                                </div>
                            </div>
                        </div>
                    }

                    <div className={styles.footerBtn}>
                        <button className={styles.btnCancel} onClick={handleCloseModalFindFriend}>Hủy</button>
                        <button className={styles.btnFind} onClick={handleFindFriend}>Tìm kiếm</button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ModalAddFriend;