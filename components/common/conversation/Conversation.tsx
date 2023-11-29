
import classes from './Conversation.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { conversationActions } from '../../../redux/actions/conversationAction'
import { updateReceivedMessageStatus } from '../../../reltimeCommunication/socketConnection'
import { tabsActions } from '../../../redux/actions/tabsAction'
import MessageEmoji from '../MessageEmoji'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import api from '../../../api/api'
import { Box, Menu, rem } from '@mantine/core'
import { IconDots, IconTrash } from '@tabler/icons-react'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { Avatar } from '@mantine/core'
const Conversation = ({ conversation }) => {
    let i18n = useLingui()
    const userDetails = useSelector((state: any) => state.auth.userDetails)
    const conversationSelected = useSelector((state: any) => state.conversation.conversationSelected)
    const conversations = useSelector((state: any) => state.conversation.conversations)
    const [friend, setFriend] = useState<any | {}>({})
    const [message, setMessage] = useState<any | null>({})
    const [countMessageReceived, setCountMessageReceived] = useState(0)
    const [fileName, setFileName] = useState('')
    const dispatch = useDispatch()

    const router = useRouter()
    let { locale } = router
    useEffect(() => {
        // update received message status
        // update in redux 
        if (userDetails) {
            let listMessageStatusEqual1 = []
            conversation?.messages.forEach(message => {
                if (message.sender._id != userDetails._id && message.status == '1') {
                    listMessageStatusEqual1.push(message)
                }
            })
            if (listMessageStatusEqual1.length != 0) {
                updateReceivedMessageStatus({
                    conversationId: conversation._id,
                    listMessage: listMessageStatusEqual1
                })
                dispatch({
                    type: conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES,
                    conversationId: conversation._id,
                    listMessage: listMessageStatusEqual1
                })
            }
        }
    }, [message])
    useEffect(() => {
        const { participants, messages } = conversation
        let friend = null
        if (participants) {
            participants.forEach((user) => {
                if (user._id !== userDetails._id) {
                    setFriend(user)
                    friend = user
                }
            })
        }
        if (messages.length) {
            const lastMessage = messages[messages.length - 1]
            if (lastMessage.type === "accept_friend") {
                if (userDetails._id === lastMessage.sender._id) {
                    let mesTemp = friend.firstName + ' ' + friend.lastName + ' ' + i18n._('has agreed to make friends')
                    setMessage({ content: mesTemp, type: 'text' })
                } else {
                    let mesTemp = i18n._('you just made friends with') + ' ' + friend.firstName + ' ' + friend.lastName
                    setMessage({ content: mesTemp, type: 'text' })
                }
            } else if (lastMessage.type == 'text') {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({ content: i18n._('You:') + ' ' + lastMessage.content, type: 'text' })
                } else {
                    setMessage({ content: lastMessage.content, type: 'text' })
                }
            } else if (lastMessage.type == 'image') {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({ content: i18n._('You:') + ' ', type: 'image' })
                } else {
                    setMessage({ content: '', type: 'image' })
                }
            } else {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({ content: i18n._('You:') + ' ', type: 'file' })
                } else {
                    setMessage({ content: '', type: 'file' })
                }
                if (lastMessage && lastMessage.type) {
                    let fileName = JSON.parse(lastMessage.type).name
                    setFileName(fileName)
                }
            }
        }
        let listMessages = conversation.messages
        let count = 0
        for (let message of listMessages) {
            if ((message.status && message.status == '2' && message.sender._id != userDetails._id)
                || (message.status == 2 && message.type === 'accept_friend')) {
                count++
            }
        }
        setCountMessageReceived(count)
    }, [conversation, conversations, locale])

    const handleChooseConversation = () => {
        localStorage.setItem('receiverUser', JSON.stringify(friend))
        dispatch({
            type: conversationActions.SET_SELECT_CONVERSATION,
            conversationSelected: conversation
        })
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
    }
    useEffect(() => {
        const setPopoverId = () => {
            dispatch({
                type: conversationActions.SET_POPOVER_ID,
                id: ''
            })
        }
        document.addEventListener('click', setPopoverId)
        return () => {
            document.removeEventListener('click', setPopoverId)
        }
    })

    const deleteConversation = async (e) => {
        e.stopPropagation()
        let res: any = await api.deleteConversation({ conversationId: conversation._id })
        if (res.err) {
            console.log(res, 'err')
        } else {
            console.log(res)
        }
    }
    return (
        <div
            className={`${classes.conversationItem} ${conversationSelected && conversation._id == conversationSelected._id && classes.selectedConversation}`}
            onClick={handleChooseConversation}
        >
            <div className={classes.left}>
                <Avatar
                    src={friend.avatar}
                    size={'md'}
                />
            </div>
            < div className={classes.center} >
                <div>
                    <div
                        className={classes.name}
                    >
                        {friend.firstName + ' ' + friend.lastName}
                    </div>
                    < div className={classes.message} >
                        {
                            message.type == 'text' &&
                            <MessageEmoji text={message.content} />
                        }
                        {
                            message.type == 'image' &&
                            <div>{message.content}
                                < FontAwesomeIcon className={classes.iconImage} icon={faImage} />
                                Hình ảnh
                            </div>
                        }
                        {
                            message.type == 'file' &&
                            <div>
                                {message.content}
                                < FontAwesomeIcon className={classes.iconImage} icon={faPaperclip} />
                                {fileName}
                            </div>
                        }
                    </div>
                </div>
            </div>
            < div className={classes.right} >
                {countMessageReceived != 0 && <Box w={20} h={20} style={{
                    backgroundColor: 'red',
                    color: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '13px'
                }}>{countMessageReceived}</Box>
                }
                <Menu trigger="hover" openDelay={100} closeDelay={400} shadow="md" width={200} position='right'>
                    <Menu.Target>
                        <Box component='div' style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <IconDots style={{ width: rem(25), height: rem(25) }} />
                        </Box>
                    </Menu.Target>

                    <Menu.Dropdown >
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            onClick={deleteConversation}
                        >
                            {i18n._('Delete conversation')}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </div>
    )
}

export default Conversation;