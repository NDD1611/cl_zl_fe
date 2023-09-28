
import { addPathToLinkAvatar } from '../../utils/path';
import Avatar from '../common/Avatar';
import ContentMessage from './contentMessage';
import styles from './messageLeftAvatar.module.scss'

const MessageLeftAvatar = ({ message, receiverUser }) => {

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
                        src={receiverUser ? addPathToLinkAvatar(receiverUser.avatar) : ''}
                        width={30}
                    />
                </div>
                <ContentMessage message={message} />
            </div>
        </>
    )
}

export default MessageLeftAvatar;