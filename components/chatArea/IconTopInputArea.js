
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconTopInputArea.module.scss'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { conversationActions } from '../../redux/actions/conversationAction'
import api from '../../api/api'
import { sendMessage } from '../../reltimeCommunication/socketConnection'

const IconTopInputArea = () => {
    const dispatch = useDispatch()
    const conversationSelected = useSelector(state => state.conversation.conversationSelected)
    const conversations = useSelector(state => state.conversation.conversations)
    const handleChangeImage = async (e) => {
        let fileImage = e.target.files[0]
        let fileBlob = fileImage instanceof Blob ? fileImage : new Blob([fileImage], { type: fileImage.type })
        let formData = new FormData()
        if (fileImage) {
            formData.append('imgMessage', fileBlob, 'imageMessage.png')
            let srcBlob = URL.createObjectURL(fileImage)

            let userDetails = JSON.parse(localStorage.getItem('userDetails'))
            let receiverUser = JSON.parse(localStorage.getItem('receiverUser'))
            let data = {
                _id: new Date(),
                senderId: userDetails._id,
                receiverId: receiverUser._id,
                content: srcBlob,
                type: 'image',
                date: new Date(),
                status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            }
            let conversationSelectedId = conversationSelected._id
            let conversationCurrent = null
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index]
                }
            }

            if (conversationCurrent) {
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
                        senderId: userDetails._id,
                        receiverId: receiverUser._id,
                        content: response.data.path,
                        type: 'image',
                        date: new Date(),
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    }
                    sendMessage(newdData)
                }
            } else {

                const res = await api.uploadImageMessage(formData)
                if (res.err) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    let newdData = {
                        _id: new Date(),
                        senderId: userDetails._id,
                        receiverId: receiverUser._id,
                        content: res.data.path,
                        type: 'image',
                        date: new Date(),
                        status: '0'     //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    }
                    let response = await api.createNewConversation({
                        participants: [userDetails._id, receiverUser._id],
                        message: newdData
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
                    onChange={handleChangeImage}
                />
            </label>
            {/* <div className={styles.oneIcon}>
                <FontAwesomeIcon icon={faImage} />
            </div> */}
            {/* <div className={styles.oneIcon}>
                <img src={src} />
            </div> */}
        </div>
    )
}
export default IconTopInputArea