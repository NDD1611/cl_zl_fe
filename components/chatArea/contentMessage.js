

import { useSelector } from 'react-redux';
import { addPathToLinkAvatar } from '../../utils/path';
import MessageEmoji from '../common/MessageEmoji';
import styles from './contentMessage.module.scss'

const ContentMessage = ({ message }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    return (
        <>
            {message.type == 'text' &&
                <div className={styles.content}
                >
                    <MessageEmoji
                        text={message.content}
                    />
                    <div className={styles.footerDate}>{message.showTime ? message.hourMinute : ''}</div>
                </div>
            }
            {
                message.type == 'image' &&
                <div className={styles.contentImage}>
                    <div className={styles.messageImage}>
                        <img src={message.content.includes('http') ? message.content : addPathToLinkAvatar(message.content)} />
                    </div>
                </div>
            }
        </>
    )
}

export default ContentMessage;