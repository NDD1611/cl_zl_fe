
import { useSelector } from 'react-redux';
import MessageEmoji from '../common/MessageEmoji';
import styles from './messageLeft.module.scss'
import { useState } from 'react';
import { useLayoutEffect } from 'react';
import MessageFile from './fileMessage';

const Content = ({ message }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    const [widthImg, setWidthImg] = useState(0)
    const handleLoadImg = (e) => {
        let img = e.target
        let widthImg = img.naturalWidth * 0.3
        if (widthImg > maxWidth) {
            setWidthImg(maxWidth)
        } else if (widthImg < 200) {
            setWidthImg(200)
        } else {
            setWidthImg(widthImg)
        }
    }

    if (message.type == 'text') {
        return <div className={styles.content} style={{ maxWidth: maxWidth + 'px' }}>
            <MessageEmoji
                text={message.content}
            />
            <div className={styles.footerDate}>{message.showTime ? message.hourMinute : ''}</div>
        </div>
    } else if (message.type == 'image') {
        return <div className={styles.contentImage}>
            <div className={styles.messageImage} style={{ maxWidth: widthImg + 'px', maxHeight: '500px' }}>
                <img onLoad={handleLoadImg} src={message.content} />
            </div>
        </div>
    } else {
        return <MessageFile message={message} />
    }

}
const MessageLeft = ({ message }) => {
    return (
        <>
            <div className={styles.messageLeft}>
                <Content message={message} />
            </div>
        </>
    )
}

export default MessageLeft;