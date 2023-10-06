
import { useSelector } from 'react-redux';
import MessageEmoji from '../common/MessageEmoji';
import styles from './messageRight.module.scss'
import { Oval } from 'react-loader-spinner';
import { useState } from 'react';
const MessageRight = ({ message }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    const [widthImg, setWidthImg] = useState(0)
    const [heightImg, setHeightImg] = useState(0)
    const handleLoadImg = (e) => {
        let img = e.target
        let widthImg = img.naturalWidth * 0.3
        let heightImg = img.naturalHeight * 0.3
        if (widthImg > maxWidth) {
            setWidthImg(maxWidth)
        } else if (widthImg < 200) {
            setWidthImg(widthImg * 2)
        } else {
            setWidthImg(widthImg)
        }
        if (heightImg > 500) {
            setHeightImg(500)
        } else {
            setHeightImg(heightImg)
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
                        <div className={styles.messageImage} style={{ maxWidth: widthImg + 'px', maxHeight: '500px' }}>
                            <img onLoad={handleLoadImg} src={message.content} />
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