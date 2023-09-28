
import { useSelector } from 'react-redux';
import { addPathToLinkAvatar } from '../../utils/path';
import MessageEmoji from '../common/MessageEmoji';
import ContentMessage from './contentMessage';
import styles from './messageRight.module.scss'
const MessageRight = ({ message }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    return (
        <>
            {
                message.sameDay === false &&
                <div className={styles.dateShow}>
                    <p>{message.dateShow}</p>
                </div>
            }
            <div className={styles.messageRight} >
                {message.type == 'text' &&
                    <div className={styles.content} style={{ maxWidth: maxWidth + 'px' }}>
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
            </div>
            <div className={styles.status}>
                {message.showStatus ?
                    <span className={styles.contentStatus}>{message.statusText}</span> : ''}
            </div>
        </>
    )
}

export default MessageRight;