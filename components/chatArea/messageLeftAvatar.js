
import { useSelector } from 'react-redux';
import { addPathToLinkAvatar } from '../../utils/path';
import Avatar from '../common/Avatar';
import styles from './messageLeftAvatar.module.scss'
import MessageEmoji from '../common/MessageEmoji';
import { useState } from 'react';

const MessageLeftAvatar = ({ message, avatar }) => {
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
                        <div className={styles.messageImage} style={{ maxWidth: widthImg + 'px' }}>
                            <img onLoad={handleLoadImg} src={message.content.includes('http') ? message.content : addPathToLinkAvatar(message.content)} />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default MessageLeftAvatar;