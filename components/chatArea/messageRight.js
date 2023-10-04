
import { useSelector } from 'react-redux';
import { addPathToLinkAvatar } from '../../utils/path';
import MessageEmoji from '../common/MessageEmoji';
import ContentMessage from './contentMessage';
import styles from './messageRight.module.scss'
import { Oval } from 'react-loader-spinner';
import { useState } from 'react';
import { useLayoutEffect } from 'react';
const MessageRight = ({ message }) => {
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
                    <div className={styles.contentImage} >
                        <div className={styles.messageImage} style={{ maxWidth: widthImg + 'px' }}>
                            <img onLoad={handleLoadImg} src={message.content.includes('http') ? message.content : addPathToLinkAvatar(message.content)} />
                            {
                                message.status == '0' && <div className={styles.loaderImage}>
                                    <Oval
                                        width={50}
                                        height={50}
                                        color="#0062cc"
                                        secondaryColor="#ccc"
                                    />
                                </div>
                            }
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