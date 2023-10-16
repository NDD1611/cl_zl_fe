
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconTopInputArea.module.scss'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { conversationActions } from '../../redux/actions/conversationAction'
import api from '../../api/api'
import { sendMessage } from '../../reltimeCommunication/socketConnection'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { calcFileSize } from '../../utils/message'

const IconTopInputArea = () => {
    const dispatch = useDispatch()
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
    }
    const handleSendImage = async (e) => {
        let file = e.target.files[0]
        let fileBlob = file instanceof Blob ? file : new Blob([file], { type: file.type })
        if (file) {
            let srcBlob = URL.createObjectURL(file)

            let userDetails = JSON.parse(localStorage.getItem('userDetails'))
            let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
            let conversationSelectedId = conversationSelected._id
            let conversationCurrent = null
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index]
                }
            }
            let dateMessage = new Date().getTime()
            if (conversationCurrent) {
                let data = {
                    _id: new Date(),
                    sender: {
                        _id: userDetails._id
                    },
                    conversation: { _id: conversationSelectedId },
                    content: srcBlob,
                    type: 'image',
                    date: dateMessage,
                    status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                }
                if (conversationCurrent.messages.length) {
                    conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime = false
                }
                conversationCurrent.messages.push(data)
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent
                })

                const app = initializeApp(firebaseConfig);
                const storage = getStorage();
                let fileName = dateMessage + '-' + Math.round(Math.random() * 1E9) + '.' + file.name.split('.').pop()
                const storageRef = ref(storage, 'file/' + fileName);
                const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        let progressBarCircleElement = document.getElementById(dateMessage + 'circularProgress')
                        let progresCircleValue = document.getElementById(dateMessage + 'progressValue')
                        if (progressBarCircleElement && progresCircleValue) {
                            progressBarCircleElement.style.background = `conic-gradient(#0091ff ${progress * 3.6}deg, #ededed 0deg)`
                            progresCircleValue.innerText = parseInt(progress) + '/%'
                        }
                    },
                    (error) => {
                        console.log(error)
                        toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            let newdData = {
                                _id: dateMessage,
                                sender: {
                                    _id: userDetails._id
                                },
                                receiverId: receiverUser._id,
                                conversation: { _id: conversationSelectedId },
                                content: downloadURL,
                                type: 'image',
                                date: dateMessage,
                                status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                            }
                            sendMessage(newdData)
                        });
                    }
                )
            } else {
                let res = await api.createConversation({
                    senderId: userDetails._id,
                    receiverId: receiverUser._id
                })
                if (res.err) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    let { conversation } = res.data
                    for (let index in conversation.participants) {
                        if (conversation.participants[index] == userDetails._id) {
                            conversation.participants[index] = userDetails
                        }
                        if (conversation.participants[index] == receiverUser._id) {
                            conversation.participants[index] = receiverUser
                        }
                    }
                    let dateMessage = Date.now()
                    let data = {
                        _id: new Date(),
                        sender: {
                            _id: userDetails._id
                        },
                        conversation: { _id: conversation._id },
                        content: srcBlob,
                        type: 'image',
                        date: dateMessage,
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    }
                    if (conversation.messages.length) {
                        conversation.messages[conversation.messages.length - 1].showTime = false
                    }
                    conversation.messages.push(data)
                    let newConversations = [...conversations, conversation]
                    dispatch({
                        type: conversationActions.SET_SELECT_CONVERSATION,
                        conversationSelected: conversation
                    })
                    dispatch({
                        type: conversationActions.SET_CONVERSATION,
                        conversations: newConversations
                    })

                    const app = initializeApp(firebaseConfig);
                    const storage = getStorage();
                    let fileName = dateMessage + '-' + Math.round(Math.random() * 1E9) + '.' + file.name.split('.').pop()
                    const storageRef = ref(storage, 'file/' + fileName);
                    const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            let progressBarCircleElement = document.getElementById(dateMessage + 'circularProgress')
                            let progresCircleValue = document.getElementById(dateMessage + 'progressValue')
                            if (progressBarCircleElement && progresCircleValue) {
                                progressBarCircleElement.style.background = `conic-gradient(#0091ff ${progress * 3.6}deg, #ededed 0deg)`
                                progresCircleValue.innerText = parseInt(progress) + '/%'
                            }
                        },
                        (error) => {
                            console.log(error)
                            toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                let newdData = {
                                    _id: dateMessage,
                                    sender: {
                                        _id: userDetails._id
                                    },
                                    receiverId: receiverUser._id,
                                    conversation: { _id: conversation._id },
                                    content: downloadURL,
                                    type: 'image',
                                    date: dateMessage,
                                    status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                                }
                                sendMessage(newdData)
                            });
                        }
                    )
                }
            }
        }
    }

    const sendFileUploadToFirebase = async (e) => {
        let file = e.target.files[0]
        if (file) {
            let dateMessage = Date.now()
            let fileBlob = file instanceof Blob ? file : new Blob([file], { type: file?.type })
            let srcBlob = URL.createObjectURL(file)
            let type = JSON.stringify({
                name: file.name,
                size: file.size,
                type: file.type
            })
            let userDetails = JSON.parse(localStorage.getItem('userDetails'))
            let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
            let conversationSelectedId = conversationSelected._id
            let conversationCurrent = null
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index]
                }
            }
            if (conversationCurrent) {
                let data = {
                    _id: dateMessage,
                    sender: {
                        _id: userDetails._id
                    },
                    conversation: { _id: conversationSelectedId },
                    content: srcBlob,
                    type: type,
                    date: dateMessage,
                    status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                }
                conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime = false
                conversationCurrent.messages.push(data)
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent
                })

                const app = initializeApp(firebaseConfig);
                const storage = getStorage();
                let fileName = dateMessage + '-' + Math.round(Math.random() * 1E9) + '.' + file.name.split('.').pop()
                const storageRef = ref(storage, 'file/' + fileName);
                const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                let count = 0
                uploadTask.on('state_changed',
                    (snapshot) => {
                        if (count > 0) {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            let progressBarElement = document.getElementById(dateMessage)
                            let infoSizeElement = document.getElementById(dateMessage + 'filesize')
                            if (progressBarElement && infoSizeElement) {
                                let { size, sizeType } = calcFileSize(file.size)
                                let progressSize = Math.floor(((progress / 100) * size) * 100) / 100
                                progressBarElement.style.width = progress + '%'
                                // convert 52.2 ->52.20, 7.1->7.10
                                let progressSizeString = (String(progressSize).split('.').pop()).length == 1 ? progressSize + '0' : progressSize
                                infoSizeElement.innerText = progressSizeString + '/' + size + sizeType
                            }
                            count = 0
                        }
                        count++
                    },
                    (error) => {
                        console.log(error)
                        toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            // console.log('File available at', downloadURL);
                            let newData = {
                                _id: dateMessage,
                                sender: {
                                    _id: userDetails._id
                                },
                                receiverId: receiverUser._id,
                                conversation: { _id: conversationSelectedId },
                                content: downloadURL,
                                type: type,
                                date: dateMessage,
                                status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                            }
                            sendMessage(newData)
                        });
                    }
                )
            } else {
                let res = await api.createConversation({
                    senderId: userDetails._id,
                    receiverId: receiverUser._id
                })
                if (res.err) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    let { conversation } = res.data
                    for (let index in conversation.participants) {
                        if (conversation.participants[index] == userDetails._id) {
                            conversation.participants[index] = userDetails
                        }
                        if (conversation.participants[index] == receiverUser._id) {
                            conversation.participants[index] = receiverUser
                        }
                    }
                    let dateMessage = Date.now()
                    let data = {
                        sender: {
                            _id: userDetails._id
                        },
                        receiverId: receiverUser._id,
                        content: '',
                        type: type,
                        date: dateMessage,
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    }
                    if (conversation.messages.length) {
                        conversation.messages[conversation.messages.length - 1].showTime = false
                    }
                    conversation.messages.push(data)
                    let newConversations = [...conversations, conversation]
                    dispatch({
                        type: conversationActions.SET_SELECT_CONVERSATION,
                        conversationSelected: conversation
                    })
                    dispatch({
                        type: conversationActions.SET_CONVERSATION,
                        conversations: newConversations
                    })

                    const app = initializeApp(firebaseConfig);
                    const storage = getStorage();
                    let fileName = dateMessage + '-' + Math.round(Math.random() * 1E9) + '.' + file.name.split('.').pop()
                    const storageRef = ref(storage, 'file/' + fileName);
                    const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                    let count = 0
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            if (count > 0) {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                let progressBarElement = document.getElementById(dateMessage)
                                let infoSizeElement = document.getElementById(dateMessage + 'filesize')
                                if (progressBarElement && infoSizeElement) {
                                    let { size, sizeType } = calcFileSize(file.size)
                                    let progressSize = Math.floor(((progress / 100) * size) * 100) / 100
                                    progressBarElement.style.width = progress + '%'
                                    // convert 52.2 ->52.20, 7.1->7.10
                                    let progressSizeString = (String(progressSize).split('.').pop()).length == 1 ? progressSize + '0' : progressSize
                                    infoSizeElement.innerText = progressSizeString + '/' + size + sizeType
                                }
                                count = 0
                            }
                            count++
                        },
                        (error) => {
                            console.log(error)
                            toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                let newData = {
                                    _id: dateMessage,
                                    sender: {
                                        _id: userDetails._id
                                    },
                                    receiverId: receiverUser._id,
                                    conversation: { _id: conversation._id },
                                    content: downloadURL,
                                    type: type,
                                    date: dateMessage,
                                    status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                                }
                                sendMessage(newData)
                            });
                        }
                    )
                }
            }
        }
    }
    return (
        <div className={styles.iconTopInput}>
            <label htmlFor='inputImage' className={styles.oneIcon}>
                <FontAwesomeIcon icon={faImage} />
                <input id='inputImage' type='file' accept='image/*' className={styles.inputImage}
                    onChange={handleSendImage}
                />
            </label>
            <label htmlFor='inputFile' className={styles.oneIcon}>
                <FontAwesomeIcon icon={faPaperclip} />
                {/* <input id='inputFile' type='file' className={styles.inputImage}
                    onChange={handleChangeInputFile}
                /> */}
                <input id='inputFile' type='file' className={styles.inputImage}
                    onChange={sendFileUploadToFirebase}
                />
            </label>
        </div>
    )
}
export default IconTopInputArea;