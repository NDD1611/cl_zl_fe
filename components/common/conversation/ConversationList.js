
import styles from './ConversationList.module.scss'
import { useSelector } from 'react-redux';

import Conversation from './Conversation';

const ConversationList = () => {
    const conversations = useSelector(state => state.conversation.conversations)
    return (
        <div className={styles.conversationList}>
            {
                conversations.map((conversation) => {
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