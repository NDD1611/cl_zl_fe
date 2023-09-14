import styles from './ModalAddFriend.module.scss'
import MainModal from './MainModal'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { modalActions } from '../../../redux/actions/modalActions'
import api from '../../../api/api'
import { toast } from 'react-toastify'
import LoaderModal from './LoaderModal'

const ModalAddFriend = () => {
    const showModalAddFriend = useSelector(state => state.modal.showModalAddFriend)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [showLoader, setShowLoader] = useState(false)
    const addFriend = async () => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'))
        setShowLoader(true)
        const response = await api.friendInvitation({
            email: email,
            senderId: userDetails._id,
            senderEmail: userDetails.email
        })
        if (response.err) {
            setShowLoader(false)
            toast.error(response?.exception?.response?.data)
            dispatch({ type: modalActions.SET_HIDE_MODAL_ADD_FRIEND })
        } else {
            setShowLoader(false)
            toast.success(response?.data)
            dispatch({ type: modalActions.SET_HIDE_MODAL_ADD_FRIEND })
        }
    }
    const handleCloseModalAddFriend = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_ADD_FRIEND })
    }
    return (
        <>
            {showLoader && <LoaderModal></LoaderModal>}
            <MainModal
                title='Thêm bạn'
                closeModal={showModalAddFriend}
                setCloseModal={handleCloseModalAddFriend}
            >
                <div className={styles.inputEmail}>
                    <input value={email} placeholder='Email...' onChange={(e) => { setEmail(e.target.value) }} />
                </div>
                <div>
                    <button className={styles.btnAdd} onClick={addFriend}>Thêm</button>
                </div>
            </MainModal>
        </>
    )
}

export default ModalAddFriend;