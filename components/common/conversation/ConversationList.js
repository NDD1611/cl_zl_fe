
import styles from './ConversationList.module.scss'
import { useSelector } from 'react-redux'
import Conversation from './Conversation'
import { Oval } from 'react-loader-spinner'
import { useEffect } from 'react'

const ConversationList = () => {
    const conversations = useSelector(state => state.conversation.conversations)

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
                conversations && conversations.map((conversation) => {
                    console.log(conversation)
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