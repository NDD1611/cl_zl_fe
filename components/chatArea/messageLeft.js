
import ContentMessage from './contentMessage';
import styles from './messageLeft.module.scss'
const MessageLeft = ({ message }) => {

    return (
        <>
            {
                message.sameDay === false &&
                <div className={styles.dateShow}>
                    <p>{message.dateShow}</p>
                </div>
            }
            <div className={`${styles.messageLeft} ${styles.sameAuth}`}>
                <ContentMessage message={message} />
            </div>
        </>
    )
}

export default MessageLeft;