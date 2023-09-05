import { useState, useEffect } from "react"
import { Emoji } from "emoji-picker-react"
import styles from './MessageEmoji.module.scss'

const MessageEmoji = ({ text }) => {
    // https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f604.png
    const [listContents, setListContenst] = useState([])
    useEffect(() => {
        let arra = []
        let textCopy = text
        while (textCopy != '') {
            let indexEmoji = textCopy.indexOf('&#x')
            if (indexEmoji != -1) {
                let strFront = textCopy.slice(0, indexEmoji)
                let strMiddle = textCopy.slice(indexEmoji, indexEmoji + 9)
                let strRear = textCopy.slice(indexEmoji + 9, textCopy.length)
                arra.push(strFront)
                arra.push(strMiddle)
                textCopy = strRear
            } else {
                arra.push(textCopy)
                textCopy = ''
            }
        }
        setListContenst(arra)
    }, [text])
    return (
        <>
            <div className={styles.MessageEmoji}>
                {
                    listContents.map((content, index) => {
                        if (content !== '') {
                            if (content.includes('&#x')) {
                                let newContent = content.slice(3, 8)
                                return <Emoji key={index} unified={newContent} size={16} />
                            } else {
                                return <span key={index} className='spanMessage'>{content}</span>
                            }
                        }
                    })
                }
            </div>
        </>
    )
}

export default MessageEmoji;