
import { useSelector } from 'react-redux';
import MessageEmoji from '../common/MessageEmoji';
import styles from './messageLeft.module.scss'
import { addPathToLinkAvatar } from '../../utils/path';
const MessageLeft = ({ message }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    return (
        <>
            {
                message.sameDay === false &&
                <div className={styles.dateShow}>
                    <p>{message.dateShow}</p>
                </div>
            }
            <div className={`${styles.messageLeft} ${styles.sameAuth}`}>
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
        </>
    )
}

export default MessageLeft;