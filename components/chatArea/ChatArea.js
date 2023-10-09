
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useRef, useMemo } from 'react'
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
    const [receiverUser, setReceiverUser] = useState({})
    const [userDetails, setUserDetails] = useState({})
    const [showEmoji, setShowEmoji] = useState(false)
    const chatMessageElement = useRef()
    const inputAreaElement = useRef()
    const headerElement = useRef()

    const dispatch = useDispatch()
    useEffect(() => {
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
        document.addEventListener('click', (e) => {
            setShowEmoji(false)
        })
    }, [])

    useEffect(() => {
        let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
        if (receiverUser) {
            setReceiverUser(receiverUser)
            let divInputElement = document.getElementById('divInput')
            if (divInputElement) {
                divInputElement.innerHTML = ''
                divInputElement.focus()
            }
        }

        let resizeObserver = new ResizeObserver((entries) => {
            let heightInputArea = entries[0].target
            let headerContainerElement = document.getElementById('headerContainer')
            let messageArea = document.getElementById('chatMessageArea')
            if (headerContainerElement && messageArea) {
                let height = window.innerHeight - heightInputArea.clientHeight - headerContainerElement.clientHeight
                messageArea.style.height = height + 'px'
            }
        })
        let inputAreaElement = document.getElementById('inputArea')
        if (inputAreaElement) {
            resizeObserver.observe(inputAreaElement)
        }
    }, [conversationSelected])

    useEffect(() => {
        let headerContainerElement = document.getElementById('headerContainer')
        let inputAreaElement = document.getElementById('inputArea')
        let messageArea = document.getElementById('chatMessageArea')
        if (headerContainerElement && inputAreaElement && messageArea) {
            let height = window.innerHeight - inputAreaElement.clientHeight - headerContainerElement.clientHeight
            messageArea.style.height = height + 'px'
        }

        let chatAreaElement = document.getElementById('chatArea')
        let rightInputElement = document.getElementById('rightInput')
        let divInputElement = document.getElementById('divInput')

        if (chatAreaElement && rightInputElement && divInputElement) {
            let widthInput = chatAreaElement.clientWidth - rightInputElement.clientWidth
            divInputElement.style.width = (widthInput - 5) + 'px'
        }

    })
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
            divInputElement.focus()
            divInputElement.innerHTML = ''
            return message
        }
    }
    const handleSendMessage = async () => {
        let message = getMessageFromDivInputElement()
        let senderId = userDetails._id
        let receiverId = receiverUser._id
        if (message.length && message !== '&nbsp;' && message !== '') {
            let conversationSelectedId = conversationSelected._id
            let data = {
                _id: new Date() + Math.random(),
                sender: {
                    _id: senderId
                },
                receiverId,
                conversation: { _id: conversationSelectedId },
                content: message.replace('&nbsp;', ''),
                type: 'text',
                date: new Date().getTime(),
                status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            }
            let conversationCurrent = null
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index]
                }
            }
            if (conversationCurrent) {
                if (conversationCurrent.messages.length != 0) {
                    conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime = false
                }
                conversationCurrent.messages.push(data)
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent
                })
                sendMessage(data)
            } else {
                let response = await api.createNewConversation({
                    sender: {
                        _id: senderId
                    },
                    receiverId,
                    content: message.replace('&nbsp;', ''),
                    type: 'text',
                    date: new Date().getTime(),
                    status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
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
        <div id='chatArea' className={styles.ChatArea}>
            {
                conversationSelected === null && <div className={styles.chatOnboard}>Chọn cuộc hội thoại để chat</div>
            }
            <div id='headerContainer' ref={headerElement}>
                <HeaderChatArea />
            </div>

            {
                conversationSelected &&
                <div
                    ref={chatMessageElement}
                    id='chatMessageArea'
                    className={styles.chatMessage}
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
                            id='divInput'
                            className={styles.divInputFake}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            data-text={
                                receiverUser ? 'Nhập tin nhắn tới ' + receiverUser.firstName + ' ' + receiverUser.lastName : ''
                            }
                            onKeyDown={(e) => { handleKeyDown(e) }}
                        ></div>

                        <div id='rightInput' className={styles.rightInputArea}>
                            <div
                                className={styles.buttonShowEmoji}
                                onClick={handleShowEmojiPicker}
                            >
                                <FontAwesomeIcon icon={faFaceSmile} />
                            </div>
                            {/* <div
                                className={styles.buttonShowEmoji}
                                onClick={handleShowEmojiPicker}
                            >
                                <FontAwesomeIcon icon={faFaceSmile} />
                            </div> */}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatArea;