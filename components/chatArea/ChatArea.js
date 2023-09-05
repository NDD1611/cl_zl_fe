
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import styles from './ChatArea.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { sendMessage } from '../../reltimeCommunication/socketConnection';
import Avatar from '../common/Avatar';
import addPathToLinkAvatar from '../../utils/path';
import MessageArea from './MessageArea';
import { conversationActions } from '../../redux/actions/conversationAction';
import dynamic from 'next/dynamic';
import { tabsActions } from '../../redux/actions/tabsAction';


const EmojiPicker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false }
);

const ChatArea = () => {
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const activeUsers = useSelector(state => state.auth.activeUsers)
    const [receiverUser, setReceiverUser] = useState({})
    const [userDetails, setUserDetails] = useState({})
    const [showEmoji, setShowEmoji] = useState(false)

    const chatAreaElement = useRef()
    const chatMessageElement = useRef()
    const chatInputElement = useRef()
    const iconTopInput = useRef()

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
            if (chatInputElement.current) {
                chatInputElement.current.innerHTML = ''
                if (window.innerWidth >= 800) {
                    chatInputElement.current.focus()
                }
            }
        }
    }, [conversationSelected])

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

    const handleSendMessage = () => {
        console.log('send message')
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
            chatInputElement.current.focus()
            chatInputElement.current.innerHTML = ''
        }
    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage()
        }
        setWidthHeihgtChatArea()
    }
    const setWidthHeihgtChatArea = () => {
        console.log(window.innerHeight)
        let chatMesageArea = document.getElementById('chatMessageArea')
        let inputArea = document.getElementById('inputArea')
        if (chatMesageArea && inputArea) {
            chatMesageArea.style.height = `${window.innerHeight - inputArea.clientHeight - 5}px`
        }
    }

    const handleShowEmojiPicker = (e) => {
        e.stopPropagation()
        setShowEmoji(!showEmoji)
    }

    const handleBackConversation = () => {
        dispatch({
            type: tabsActions.SET_SHOW_TAB_TWO
        })
        dispatch({
            type: tabsActions.SET_CLOSE_TAB_THREE
        })
    }

    return (
        <div className={styles.ChatArea} ref={chatAreaElement}>
            {
                conversationSelected === null && <div className={styles.chatOnboard}>Chọn cuộc hội thoại để chat</div>
            }
            {
                conversationSelected &&
                <div className={styles.headerChatArea}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerLeft}>
                            {
                                window.innerWidth < 800 &&
                                <div className={styles.backButton} onClick={handleBackConversation}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </div>
                            }
                            <div className={styles.headerAvatar}>
                                <Avatar
                                    src={addPathToLinkAvatar(receiverUser ? receiverUser.avatar : '')}
                                    width={50}
                                />
                                {activeUsers.includes(receiverUser._id) ? <span className={styles.iconUserOnline}></span> : ''}
                            </div>
                            <div className={styles.headerName}>
                                <p className={styles.name}> {receiverUser ? receiverUser.firstName + ' ' + receiverUser.lastName : ''}</p>
                                {activeUsers.includes(receiverUser._id) ? <p className={styles.minuteActive}>vừa truy cập</p> : ''}
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                conversationSelected &&
                <div
                    ref={chatMessageElement}
                    // style={{ height: heightChatMessage }}
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
                        className={styles.containerEmojiPicker}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        {
                            showEmoji ? <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                            /> : ''
                        }
                    </div>
                    <div
                        ref={chatInputElement}
                        id='divInput'
                        className={styles.divInputFake}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        data-text={
                            receiverUser ? 'Nhập tin nhắn tới ' + receiverUser.firstName + ' ' + receiverUser.lastName : ''
                        }
                        onKeyDown={(e) => { handleKeyDown(e) }}
                    >


                    </div>
                    <div className={styles.rightInputArea}>
                        <button className={styles.btnSendMes} onClick={handleSendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                        <div
                            className={styles.buttonShowEmoji}
                            onClick={handleShowEmojiPicker}
                        >
                            <FontAwesomeIcon icon={faFaceSmile} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatArea;