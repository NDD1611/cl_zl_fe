
import { useSelector } from 'react-redux';
import { addPathToLinkAvatar } from '../../utils/path';
import Avatar from '../common/Avatar';
import styles from './messageLeftAvatar.module.scss'
import MessageEmoji from '../common/MessageEmoji';

const MessageLeftAvatar = ({ message, avatar }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    return (
        <>
            {
                message.sameDay === false &&
                <div className={styles.dateShow}>
                    <p>{message.dateShow}</p>
                </div>
            }
            <div className={styles.messageLeft} >
                <div className={styles.containerAvatar}>
                    <Avatar
                        src={avatar ? addPathToLinkAvatar(avatar) : ''}
                        width={30}
                    />
                </div>
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

export default MessageLeftAvatar;