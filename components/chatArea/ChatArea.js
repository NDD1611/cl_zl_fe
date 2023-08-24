
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import styles from './ChatArea.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { sendMessage } from '../../reltimeCommunication/socketConnection';
import Avatar from '../common/Avatar';
import addPathToLinkAvatar from '../../utils/path';
import MessageArea from './MessageArea';
import { conversationActions } from '../../redux/actions/conversationAction';

const ChatArea = () => {
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const activeUsers = useSelector(state => state.auth.activeUsers)
    const [receiverUser, setReceiverUser] = useState({})
    const [userDetails, setUserDetails] = useState({})
    const [message, setMessage] = useState('')
    const [widthDivInput, setWidthDivInput] = useState('')
    const [heightChatMessage, setHeightChatMessage] = useState('')
    const [heightRootChatMessage, setHeightRootChatMessage] = useState('')
    const [heightRootChatArea, setHeightRootChatArea] = useState('')
    const [heightDivInputPre, setHeightDivInputPre] = useState(38)
    const [showActiveUser, setShowActiveUser] = useState(false)
    const [receiverUserId, setReceiverUserId] = useState('')

    const chatAreaElement = useRef()
    const chatMessageElement = useRef()
    const chatInputElement = useRef()
    const iconTopInput = useRef()

    const dispatch = useDispatch()

    useEffect(() => {
        let widthInput = parseInt(chatAreaElement.current.clientWidth * 0.75) + 'px'
        setWidthDivInput(widthInput)
        setHeightRootChatArea(chatAreaElement.current.clientHeight - 10)
        setHeightRootChatMessage(chatAreaElement.current.clientHeight * 0.95)
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
    }, [])

    useEffect(() => {
        let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
        if (receiverUser) {
            setReceiverUser(receiverUser)
            setReceiverUserId(receiverUser._id)
            setMessage('')
            if (chatInputElement.current) {
                chatInputElement.current.innerHTML = ''
            }
        }
    }, [conversationSelected])

    const handleInputChange = (e) => {
        setHeightDivInputPre(e.target.clientHeight)
        setMessage(e.target.innerHTML)
        let heightCurrent = e.target.clientHeight
        if (e.target.clientHeight !== heightDivInputPre) {
            setHeightChatMessage(parseInt(heightRootChatArea) - heightCurrent - iconTopInput.current.clientHeight)
        }
    }
    const handleSendMessage = (e) => {
        setMessage('')
        chatInputElement.current.innerHTML = ''
        setHeightDivInputPre(38)
        chatInputElement.current.focus()
        setHeightChatMessage(heightRootChatMessage)

        let senderId = userDetails._id
        let receiverId = receiverUser._id
        if (message.length && message !== '&nbsp;') {
            let data = {
                senderId,
                receiverId,
                content: message.replace('&nbsp;', ''),
                type: 'text',
                date: new Date(),
                status: 0     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            }

            let conversationCurrent = conversationSelected
            conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime = false
            conversationCurrent.messages.push(data)
            dispatch({
                type: conversationActions.SEND_NEW_MESSAGE,
                newConversation: conversationCurrent
            })

            sendMessage(data)
        }
    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className={styles.ChatArea} ref={chatAreaElement}>

            {
                conversationSelected === null && <div className={styles.chatOnboard}>Chọn cuộc hội thoại để chat</div>
            }
            {
                conversationSelected &&
                <div className={styles.headerChatArea}>
                    <div className={styles.headerLeft}>
                        <div className={styles.headerAvatar}>
                            <Avatar
                                src={addPathToLinkAvatar(receiverUser ? receiverUser.avatar : '')}
                                width={50}
                            />
                            {activeUsers.includes(receiverUserId) ? <span className={styles.iconUserOnline}></span> : ''}
                        </div>
                        <div className={styles.headerName}>
                            <p className={styles.name}> {receiverUser ? receiverUser.firstName + ' ' + receiverUser.lastName : ''}</p>
                            {activeUsers.includes(receiverUserId) ? <p className={styles.minuteActive}>vừa truy cập</p> : ''}
                        </div>
                    </div>
                    <div></div>
                </div>
            }
            {
                conversationSelected &&
                <div
                    ref={chatMessageElement}
                    style={{ height: heightChatMessage }}
                    id='chatMessageArea'
                    className={styles.chatMessage}
                >
                    <MessageArea />
                </div>
            }
            <div
                ref={iconTopInput}
                style={{
                    display: conversationSelected ? 'block' : 'none'
                }}
            >
                {/* icon send file */}

            </div>
            {
                conversationSelected &&
                <div id='inputArea' className={styles.inputArea} >
                    <div
                        ref={chatInputElement}
                        style={{
                            width: widthDivInput,
                            overflowY: heightDivInputPre > 200 ? 'scroll' : '',
                        }}
                        id='divInput' className={styles.divInputFake}
                        contentEditable='true'
                        data-text={
                            receiverUser ? 'Nhập tin nhắn tới ' + receiverUser.firstName + ' ' + receiverUser.lastName : ''
                        }
                        onKeyDown={(e) => { handleKeyDown(e) }}
                        onInput={(e) => { handleInputChange(e) }}
                    >
                    </div>
                    <div className={styles.rightInputArea}>
                        <button className={styles.btnSendMes} onClick={(e) => { handleSendMessage(e) }}>
                            {/* <FontAwesomeIcon icon={faPaperPlane} /> */}
                            Gửi
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatArea;