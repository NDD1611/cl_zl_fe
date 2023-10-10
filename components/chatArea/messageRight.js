
import { useSelector } from 'react-redux';
import MessageEmoji from '../common/MessageEmoji';
import styles from './messageRight.module.scss'
import { Oval } from 'react-loader-spinner';
import { useState } from 'react';
import { useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import IconFile from './iconFile';
import MessageFile from './fileMessage';

const Content = ({ message }) => {
    const maxWidth = useSelector(state => state.message.maxWidth)
    const [widthImg, setWidthImg] = useState(0)
    const handleLoadImg = (e) => {
        let img = e.target
        let widthImg = img.naturalWidth * 0.3
        // let heightImg = img.naturalHeight * 0.3
        if (widthImg > maxWidth) {
            setWidthImg(maxWidth)
        } else if (widthImg < 200) {
            setWidthImg(widthImg * 2)
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
        return <div className={styles.contentImage} >
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
    } else {
        return <MessageFile message={message} />
    }
}


const MessageRight = ({ message }) => {
    return (
        <>
            {
                message.sameDay === false &&
                <div className={styles.dateShow}>
                    <p>{message.dateShow}</p>
                </div>
            }
            {
                message.sameAuth == false && <div style={{ height: '10px' }}></div>
            }
            <div className={styles.messageRight} >
                <Content message={message} />
            </div>
            <div className={styles.status}>
                {message.showStatus ?
                    <span className={styles.contentStatus}>{message.statusText}</span> : ''}
            </div>
        </>
    )
}

export default MessageRight;