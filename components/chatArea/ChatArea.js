
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import styles from './ChatArea.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import dynamic from 'next/dynamic'
import { sendMessage } from '../../reltimeCommunication/socketConnection'
import MessageArea from './MessageArea'
import { conversationActions } from '../../redux/actions/conversationAction'
import HeaderChatArea from './HeaderChatArea'
import api from '../../api/api'
import { useLayoutEffect } from 'react'
import IconTopInputArea from './IconTopInputArea'

const EmojiPicker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false }
);

const ChatArea = () => {
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)
    const activeUsers = useSelector(state => state.auth.activeUsers)
    const isFriend = useSelector(state => state.friend.isFriend)
    const [receiverUser, setReceiverUser] = useState({})
    const [userDetails, setUserDetails] = useState({})
    const [showEmoji, setShowEmoji] = useState(false)
    const [widthDivInput, setWidthDivInput] = useState()
    const chatAreaElement = useRef()
    const chatMessageElement = useRef()
    const chatInputElement = useRef()
    const inputAreaElement = useRef()
    const [paddingTopMessageArea, setPaddingTopMessageArea] = useState(0)
    const [paddingBottomMessageArea, setPaddingBottomMessageArea] = useState(20)

    const dispatch = useDispatch()
    useLayoutEffect(() => {
        if (isFriend) {
            setPaddingTopMessageArea(80)
        } else {
            setPaddingTopMessageArea(130)
        }
    }, [isFriend])
    useEffect(() => {
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
        document.addEventListener('click', (e) => {
            setShowEmoji(false)
        })
    }, [])

    const [heightMessageArea, setHeightMessageArea] = useState()
    useEffect(() => {
        let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
        if (receiverUser) {
            setReceiverUser(receiverUser)
            if (chatInputElement.current) {
                chatInputElement.current.innerHTML = ''
                chatInputElement.current.focus()
            }
        }
        if (chatAreaElement) {
            setWidthDivInput(chatAreaElement.current.clientWidth - 150)
        }
        if (inputAreaElement.current) {
            let heightInputArea = inputAreaElement.current.clientHeight
            let heightMessageArea = window.innerHeight - heightInputArea - paddingTopMessageArea - paddingBottomMessageArea - 20 //20 padding-bottom
            setHeightMessageArea(heightMessageArea)
        }

        if (inputAreaElement.current) {
            let resizeObserver = new ResizeObserver((entries) => {
                let heightInputArea = entries[0].target.clientHeight
                let heightMessageArea = window.innerHeight - heightInputArea - paddingTopMessageArea - paddingBottomMessageArea - 20
                setHeightMessageArea(heightMessageArea)
            })
            resizeObserver.observe(inputAreaElement.current)
        }
    }, [conversationSelected, paddingTopMessageArea])

    const handleEmojiClick = (event) => {
        let divInput = document.getElementById('divInput')
        if (divInput) {
            let unifiedEmoji = event.unified
            let imgElement = document.createElement('img')
            imgElement.src = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${unifiedEmoji}.png`
            imgElement.className = styles.emojiDivInput
            divInput.appendChild(imgElement)
        }
    }

    const getMessageFromDivInputElement = () => {
        let divInputElement = document.getElementById('divInput')
        if (divInputElement) {
            let message = ''
            if (divInputElement.childNodes) {
                let childNodes = divInputElement.childNodes
                for (let index in childNodes) {
                    let node = childNodes[index]
                    if (node.nodeName === '#text') {
                        message = message + node.textContent
                    } else if (node.nodeName === 'IMG') {
                        let src = node.src
                        let unified = src.slice(src.length - 9, src.length - 4)
                        let emojiEncoded = '&#x' + unified + ';'
                        message = message + emojiEncoded
                    }
                }
            }
            chatInputElement.current.focus()
            chatInputElement.current.innerHTML = ''
            return message
        }
    }

    const handleSendMessage = async () => {
        let message = getMessageFromDivInputElement()
        let senderId = userDetails._id
        let receiverId = receiverUser._id
        if (message.length && message !== '&nbsp;' && message !== '') {
            let data = {
                _id: new Date() + Math.random(),
                senderId,
                receiverId,
                content: message.replace('&nbsp;', ''),
                type: 'text',
                date: new Date(),
                status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            }

            let conversationSelectedId = conversationSelected._id
            let conversationCurrent = null
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index]
                }
            }

            if (conversationCurrent) {
                conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime = false
                conversationCurrent.messages.push(data)
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent
                })
                sendMessage(data)
            } else {
                let response = await api.createNewConversation({
                    participants: [senderId, receiverId],
                    message: data
                })

                if (response.err) {
                    alert('Lỗi server. vui lòng truy cập lại sau.')
                } else {
                    let { conversation } = response?.data
                    dispatch({
                        type: conversationActions.SET_SELECT_CONVERSATION,
                        conversationSelected: conversation
                    })
                }
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleShowEmojiPicker = (e) => {
        e.stopPropagation()
        setShowEmoji(!showEmoji)
    }

    const handleStopPropagation = (e) => {
        e.stopPropagation()
    }

    return (
        <div id='chatArea' className={styles.ChatArea} ref={chatAreaElement}>
            {
                conversationSelected === null && <div className={styles.chatOnboard}>Chọn cuộc hội thoại để chat</div>
            }
            <HeaderChatArea />
            {
                conversationSelected &&
                <div
                    ref={chatMessageElement}
                    id='chatMessageArea'
                    className={styles.chatMessage}
                    style={{
                        height: heightMessageArea + 'px',
                        paddingTop: paddingTopMessageArea + 'px',
                        paddingBottom: paddingBottomMessageArea + 'px'
                    }}
                >
                    <MessageArea />
                </div>
            }
            {
                conversationSelected &&
                <div id='inputArea' className={styles.inputArea}
                    ref={inputAreaElement}
                >
                    <IconTopInputArea />
                    <div
                        className={styles.containerEmojiPicker}
                        onClick={handleStopPropagation}
                    >
                        {
                            showEmoji && <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                autoFocusSearch={false}
                            />
                        }
                    </div>
                    <div className={styles.mainInput}>
                        <div
                            style={{ width: widthDivInput + 'px' }}
                            ref={chatInputElement}
                            id='divInput'
                            className={styles.divInputFake}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            data-text={
                                receiverUser ? 'Nhập tin nhắn tới ' + receiverUser.firstName + ' ' + receiverUser.lastName : ''
                            }
                            onKeyDown={(e) => { handleKeyDown(e) }}
                        ></div>

                        <div className={styles.rightInputArea}>
                            {/* <button className={styles.btnSendMes} onClick={handleSendMessage}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button> */}
                            <div
                                className={styles.buttonShowEmoji}
                                onClick={handleShowEmojiPicker}
                            >
                                <FontAwesomeIcon icon={faFaceSmile} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatArea;