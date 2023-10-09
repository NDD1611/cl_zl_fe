import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { useLayoutEffect } from "react"
import styles from './fileMessage.module.scss'
import IconFile from "./iconFile"
import { ThreeDots } from "react-loader-spinner"

const MessageFile = ({ message }) => {

    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState('')
    const [ext, setExt] = useState('')
    const [showLoader, setShowLoader] = useState(false)

    const downloadFile = async () => {
        try {
            setShowLoader(true)
            let res = await fetch(message.content)
            let blob = await res.blob()
            let pathBlob = URL.createObjectURL(blob)
            let aElement = document.createElement('a')
            aElement.href = pathBlob
            aElement.download = fileName
            document.body.appendChild(aElement)
            aElement.click()
            document.body.removeChild(aElement)
            setShowLoader(false)
        } catch (e) {
            console.log(e, 'err')
        }
    }
    useLayoutEffect(() => {
        if (message.type != 'text' && message.type != 'image') {
            let type = JSON.parse(message.type)
            setFileName(type.name)
            // calculator file size 
            let size = type.size
            if (size < 1024) {
                setFileSize(size + 'B')
            } else if (size >= 1024 && size < 1024 * 1024) {
                let newSize = Math.floor((size / 1024) * 100) / 100
                setFileSize(newSize + 'KB')
            } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
                let newSize = Math.floor((size / (1024 * 1024)) * 100) / 100
                setFileSize(newSize + 'MB')
            }
            // find .ext from file name
            let name = type.name
            if (name) {
                let index = 0
                for (let i = name.length - 1; i > 0; i--) {
                    if (name[i] == '.') {
                        index = i
                    }
                }
                let ext = name.slice(index + 1, name.length)
                setExt(ext)
            }
        }
    }, [])

    return <div className={styles.contentFile}>
        <div className={styles.iconFile}>
            <IconFile ext={ext} />
        </div>
        <div className={styles.rightFile}>
            <p className={styles.fileName} > {fileName} </p>
            <div className={styles.rightBottom}>
                <div className={styles.size}>{fileSize}</div>
                <div>
                    {
                        !showLoader &&
                        <span className={styles.download}
                            onClick={downloadFile}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </span>
                    }
                    {
                        showLoader && <ThreeDots
                            height="30"
                            width="30"
                            radius="9"
                            color="#0091ff"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    }
                </div>
            </div>
        </div>
    </div >
}

export default MessageFile