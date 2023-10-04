
import { useSelector } from 'react-redux';
import MessageEmoji from '../common/MessageEmoji';
import styles from './messageLeft.module.scss'
import { addPathToLinkAvatar } from '../../utils/path';
import { useState } from 'react';
const MessageLeft = ({ message }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    const [widthImg, setWidthImg] = useState(0)
    const handleLoadImg = (e) => {
        let img = e.target
        console.log(img.naturalHeight, img.naturalWidth)
        let widthImg = img.naturalWidth * 0.3
        if (widthImg > maxWidth) {
            setWidthImg(maxWidth)
        } else if (widthImg < 200) {
            setWidthImg(200)
        } else {
            setWidthImg(widthImg)
        }
    }
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
                        <div className={styles.messageImage} style={{ maxWidth: widthImg + 'px' }}>
                            <img onLoad={handleLoadImg} src={message.content.includes('http') ? message.content : addPathToLinkAvatar(message.content)} />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default MessageLeft;