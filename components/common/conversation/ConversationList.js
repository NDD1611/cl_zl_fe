
import styles from './ConversationList.module.scss'
import { useSelector } from 'react-redux'
import Conversation from './Conversation'
import { Oval } from 'react-loader-spinner'
import { useEffect } from 'react'
import { useLayoutEffect } from 'react'
import { useState } from 'react'

const ConversationList = () => {
    const conversations = useSelector(state => state.conversation.conversations)
    const [conversationsShow, setConversationsShow] = useState([])
    useLayoutEffect(() => {
        if (conversations) {
            let conversationsShow = [...conversations]
            for (let i = 0; i < conversationsShow.length - 1; i++) {
                let conversationI = conversationsShow[i]
                let lastMessageI = conversationI.messages[conversationI.messages.length - 1]
                for (let j = i + 1; j < conversationsShow.length; j++) {
                    let conversationJ = conversationsShow[j]
                    let lastMessageJ = conversationJ.messages[conversationJ.messages.length - 1]
                    if (lastMessageJ.date > lastMessageI.date) {
                        let temp = conversationsShow[i]
                        conversationsShow[i] = conversationsShow[j]
                        conversationsShow[j] = temp
                    }
                }
            }
            setConversationsShow(conversationsShow)
        }
    }, [conversations])

    useEffect(() => {
        let headerTabTwoElement = document.getElementById('headerTabTwo')
        let conversationListElement = document.getElementById('conversationList')
        if (headerTabTwoElement && conversationListElement) {
            let heightList = window.innerHeight - headerTabTwoElement.clientHeight
            conversationListElement.style.height = (heightList - 5) + 'px'
        }
    })
    return (
        <div id="conversationList" className={styles.conversationList}>
            {
                !conversations && <div className={styles.listLoader}>
                    <Oval
                        width={50}
                        height={50}
                        color="#0062cc"
                        secondaryColor="#ccc"
                    />
                </div>
            }
            {

                conversations?.length == 0 && <div className={styles.noListConversation}>
                    Kết bạn để bắt đầu chat
                </div>
            }
            {
                conversations && conversationsShow.map((conversation) => {
                    return <Conversation
                        key={conversation._id}
                        conversation={conversation}
                    />
                })
            }
        </div>
    )
}

export default ConversationList;