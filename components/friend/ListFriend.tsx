import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import styles from './ListFriend.module.scss'
import { tabsActions } from '../../redux/actions/tabsAction'
import api from '../../api/api'
import { conversationActions } from '../../redux/actions/conversationAction'
import { useRouter } from 'next/router'
import { useLingui } from '@lingui/react'
import { Avatar, Box, Divider, Menu, Modal, rem } from '@mantine/core'
import { IconDots, IconEye, IconTrash, IconUser } from '@tabler/icons-react'
import LoaderModal from '../common/Modal/LoaderModal'
import { toast } from 'react-toastify'
import { toastMessage } from '../../utils/toast'

const ListFriend = () => {
    let i18n = useLingui()
    const conversations = useSelector((state: any) => state.conversation.conversations)
    const maintabSelect = useSelector((state: any) => state.tabs.maintabSelect)
    const [showBackButton, setShowBackButton] = useState(false)
    const listFriends = useSelector((state: any) => state.friend.listFriends)
    const [showLoader, setShowLoader] = useState(false)
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
        dispatch({
            type: tabsActions.SET_SHOW_TAB_ONE
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

    const handleClickShowInfoFriend = (e, friend) => {
        e.stopPropagation();
        let date = new Date(friend.birthday)
        let day = date.getDate().toString()
        let month = (date.getMonth() + 1).toString()
        let year = date.getFullYear()
        let birthday = day + '/' + `${parseInt(month) < 10 ? 0 : ''}` + month + '/' + year
        setInfoFriend({
            ...friend,
            birthday
        })
        setIdPopover(undefined)
        setShowModalInfo(true)
    }
    const [infoFriend, setInfoFriend] = useState<any>()
    const [showModalInfo, setShowModalInfo] = useState(false)
    const handleCloseModalInfo = () => {
        setShowModalInfo(false)
    }
    const handleDeleteFriend = async (e, friendId) => {
        e.stopPropagation();
        setShowLoader(true)
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        let data = {
            userId: userDetails._id,
            friendId: friendId
        }
        let res: any = await api.deleteFriend(data)
        if (res.err) {
            setShowLoader(false)
            toast.error(toastMessage(res?.exception?.response?.data?.code, i18n))
        } else {
            setShowLoader(false)
            toast.success(toastMessage(res?.response?.data?.code, i18n))
        }
        setShowLoader(false)
    }
    const handleClickSendMessage = async (friend) => {
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

        if (maintabSelect != 'Conversations') {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: 'Conversations'
            })
            const { locale } = router
            router.push('/', '/', { locale: locale })
        }
    }
    return (
        <>
            {showLoader && <LoaderModal />}
            <Modal opened={showModalInfo} onClose={handleCloseModalInfo} title={i18n._('Account information')}>
                <div className={styles.contentModalInfo}>
                    <div className={styles.image}>
                        <img
                            src='/images/backgroundProfile.jpg'
                        />
                    </div>
                    <div className={styles.avatarInfo}>
                        <Avatar src={infoFriend?.avatar} color='blue' size={'lg'} />
                    </div>
                    <p className={styles.name}>{infoFriend && infoFriend.firstName + ' ' + infoFriend.lastName}</p>
                    <div className={styles.userInfo}>
                        <p>{i18n._('Information')}</p>
                        <div>
                            <p>{i18n._('Email')}</p>
                            <p>{infoFriend ? infoFriend.email : ''}</p>
                        </div>
                        <div>
                            <p>{i18n._('Sex')}</p>
                            <p>{infoFriend && (infoFriend.sex ? infoFriend.sex : i18n._('No information'))}</p>
                        </div>
                        <div>
                            <p>{i18n._('Date of birth')}</p>
                            <p>{infoFriend && (infoFriend.birthday ? infoFriend.birthday : i18n._('No information'))}</p>
                        </div>
                    </div>
                </div>
            </Modal>

            <div className={styles.listFriend}>
                <div className={styles.headerInvitation}>
                    {showBackButton &&
                        <div className={styles.backButton} onClick={showTabTwoAndCloseTabThree}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    }
                    <Box mr={10}>
                        <IconUser size={20} />
                    </Box>
                    {i18n._('Friends List')}
                </div>
                <div>
                    {
                        listFriends.length === 0 && <div className={styles.noFriend}>
                            {i18n._("You don't have friends yet, connect with friends")}
                        </div>
                    }
                    {
                        listFriends.map((friend) => {
                            return <Box key={friend._id} px={20}>
                                <div className={styles.friendItem}
                                    onContextMenu={(e) => { handleMouseRightClick(e, friend._id) }}
                                    onClick={(e) => { handleClickSendMessage(friend) }}
                                >
                                    <div className={styles.left}>
                                        <Avatar src={friend.avatar} color='blue' size={'md'} />
                                        <div className={styles.name}>{friend.firstName + ' ' + friend.lastName}</div>
                                    </div>
                                    <div className={styles.right}>
                                        {/* icon */}
                                    </div>
                                    <Menu trigger="hover" openDelay={100} closeDelay={400} shadow="md" width={200} position='left' >
                                        <Menu.Target >
                                            <Box component='div'
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                                mr={20}
                                            >
                                                <IconDots onClick={(e) => { e.stopPropagation() }} style={{ width: rem(25), height: rem(25) }} />
                                            </Box>
                                        </Menu.Target>

                                        <Menu.Dropdown >
                                            <Menu.Item
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleClickShowInfoFriend(e, friend)
                                                }}
                                                leftSection={<IconEye size={14} />}
                                            >
                                                {i18n._('Watch information')}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteFriend(e, friend._id)
                                                }}
                                                color='red'
                                                leftSection={<IconTrash size={14} />}
                                            >
                                                {i18n._('Delete')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </div>
                                <Divider />
                            </Box>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default ListFriend;