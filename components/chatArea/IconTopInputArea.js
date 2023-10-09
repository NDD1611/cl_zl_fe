
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconTopInputArea.module.scss'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { conversationActions } from '../../redux/actions/conversationAction'
import api from '../../api/api'
import { sendMessage } from '../../reltimeCommunication/socketConnection'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

const IconTopInputArea = () => {
    const dispatch = useDispatch()
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)
    const handleChangeInputImage = async (e) => {
        let fileImage = e.target.files[0]
        let fileBlob = fileImage instanceof Blob ? fileImage : new Blob([fileImage], { type: fileImage.type })
        let formData = new FormData()
        if (fileImage) {
            formData.append('imgMessage', fileBlob, fileImage.name)
            let srcBlob = URL.createObjectURL(fileImage)

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
                conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime = false
                conversationCurrent.messages.push(data)
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent
                })

                const response = await api.uploadImageMessage(formData)
                if (response.err) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    let newdData = {
                        _id: new Date(),
                        sender: {
                            _id: userDetails._id
                        },
                        receiverId: receiverUser._id,
                        conversation: { _id: conversationSelectedId },
                        content: response.data.path,
                        type: 'image',
                        date: dateMessage,
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    }
                    sendMessage(newdData)
                }
            } else {
                const res = await api.uploadImageMessage(formData)
                if (res.err) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    let response = await api.createNewConversation({
                        sender: {
                            _id: userDetails._id
                        },
                        receiverId: receiverUser._id,
                        content: res.data.path,
                        type: 'image',
                        date: dateMessage,
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    })

                    if (response.err) {
                        alert('Lỗi server. vui lòng truy cập lại sau.')
                    } else {
                        let { conversation } = response?.data
                        dispatch({
                            type: conversationActions.SET_SELECT_CONVERSATION,
                            conversationSelected: conversation
                        })
                    }
                }
            }
        }
    }

    const handleChangeInputFile = async (e) => {
        let file = e.target.files[0]
        if (file) {
            let fileBlob = file instanceof Blob ? file : new Blob([file], { type: file?.type })
            let formData = new FormData()
            let type = JSON.stringify({
                name: file.name,
                size: file.size,
                type: file.type
            })
            formData.append('fileMessage', fileBlob, file.name)
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

                const response = await api.uploadFile(formData)
                if (response.err) {
                    console.log(err)
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    let newdData = {
                        _id: new Date(),
                        sender: {
                            _id: userDetails._id
                        },
                        receiverId: receiverUser._id,
                        conversation: { _id: conversationSelectedId },
                        content: response.data.path,
                        type: type,
                        date: dateMessage,
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    }
                    sendMessage(newdData)
                }
            } else {
                const res = await api.uploadFile(formData)
                if (res.err) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    let response = await api.createNewConversation({
                        sender: {
                            _id: userDetails._id
                        },
                        receiverId: receiverUser._id,
                        content: res.data.path,
                        type: type,
                        date: dateMessage,
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    })

                    if (response.err) {
                        alert('Lỗi server. vui lòng truy cập lại sau.')
                    } else {
                        let { conversation } = response?.data
                        dispatch({
                            type: conversationActions.SET_SELECT_CONVERSATION,
                            conversationSelected: conversation
                        })
                    }
                }
            }
        }
    }

    return (
        <div className={styles.iconTopInput}>
            <label htmlFor='inputImage' className={styles.oneIcon}>
                <FontAwesomeIcon icon={faImage} />
                <input id='inputImage' type='file' accept='image/*' className={styles.inputImage}
                    onChange={handleChangeInputImage}
                />
            </label>
            <label htmlFor='inputFile' className={styles.oneIcon}>
                <FontAwesomeIcon icon={faPaperclip} />
                <input id='inputFile' type='file' className={styles.inputImage}
                    onChange={handleChangeInputFile}
                />
            </label>
        </div>
    )
}
export default IconTopInputArea