import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { useLayoutEffect } from "react"
import styles from './fileMessage.module.scss'
import IconFile from "./iconFile"
import { Oval, ThreeDots } from "react-loader-spinner"
import { initializeApp } from "firebase/app"
import { getBlob, getStorage, ref } from "firebase/storage"
import { calcFileSize } from "../../utils/message"

const MessageFile = ({ message }) => {

    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState('')
    const [fileSizeType, setFileSizeType] = useState('')
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
    const downloadFileFirebase = async () => {
        try {
            setShowLoader(true)
            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
                measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
            };
            const app = initializeApp(firebaseConfig);
            const storage = getStorage();
            let fileNameOnCloud = message.content.split('?')[0].split('%2F').pop()
            const storageRef = ref(storage, 'file/' + fileNameOnCloud);

            let blob = await getBlob(storageRef)
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
            if (type?.size) {
                let { size, sizeType } = calcFileSize(type.size)
                setFileSize(size)
                setFileSizeType(sizeType)
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
            {
                message.status == '0' &&
                <div className={styles.progress}>
                    <div className={styles.progressBar}>
                        <div id={message.date} className={styles.bar}></div>
                    </div>
                    <div id={message.date + 'filesize'}>
                        {/* change from send file at iconTopInput */}
                    </div>
                </div>
            }
            {
                message.status != '0' &&
                <div className={styles.rightBottom}>
                    <div className={styles.size}>{fileSize + fileSizeType}</div>
                    <div>
                        {
                            !showLoader &&
                            // <span className={styles.download}
                            //     onClick={downloadFile}
                            // >
                            //     <FontAwesomeIcon icon={faDownload} />
                            // </span>
                            <span className={styles.download}
                                onClick={downloadFileFirebase}
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

            }
        </div>
    </div >
}

export default MessageFile