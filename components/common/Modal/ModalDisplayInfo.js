

import styles from './ModalDisplayInfo.module.scss'
import MainModal from './MainModal'
import Avatar from '../Avatar'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { modalActions } from '../../../redux/actions/modalActions'
import addPathToLinkAvatar from '../../../utils/path'

const ModalDisplayInfo = () => {

    const showModalInfo = useSelector(state => state.modal.showModalInfo)
    const avatarLink = useSelector(state => state.auth.userDetails.avatar)
    const dispatch = useDispatch()
    const datefake = useSelector(state => state.auth.userDetails.birthday)
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')


    useEffect(() => {
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        let date = new Date(userDetails.birthday)
        setDay(date.getDate().toString())
        setMonth((date.getMonth() + 1).toString())
        setYear(date.getFullYear())
    }, [datefake])

    const userDetails = useSelector(state => state.auth.userDetails)
    const handleCloseModalInfo = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_INFO })
    }
    const handleClickUpdateInfo = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_INFO })
        dispatch({ type: modalActions.SET_SHOW_MODAL_UPDATE_INFO })
    }
    return (
        <>
            <MainModal
                title='Thông tin tài khoản'
                closeModal={showModalInfo}
                setCloseModal={handleCloseModalInfo}
            >
                <div className={styles.contentModalInfo}>
                    <div className={styles.image}>
                        <img
                            src='/images/backgroundProfile.jpg'
                        />
                    </div>
                    <div className={styles.avatarInfo}>
                        <Avatar
                            src={addPathToLinkAvatar(avatarLink)}
                            width={80}
                        ></Avatar>
                    </div>
                    <p className={styles.name}>{userDetails.firstName + ' ' + userDetails.lastName}</p>
                    <div className={styles.userInfo}>
                        <p>Thông tin cá nhân</p>
                        <div>
                            <p>Email</p>
                            <p>{userDetails.email}</p>
                        </div>
                        <div>
                            <p>Giới tính</p>
                            <p>{userDetails.sex ? userDetails.sex : 'chưa có thông tin'}</p>
                        </div>
                        <div>
                            <p>Ngày sinh</p>
                            <p>{userDetails.birthday ? day + '/' + month + '/' + year : 'chưa có thông tin'}</p>
                        </div>
                        <div className={styles.divBtn}>
                            <button className={styles.btnShowModalUpdateInfo} onClick={() => { handleClickUpdateInfo() }} >
                                <FontAwesomeIcon icon={faPenToSquare} />
                                Cập nhật thông tin
                            </button>
                        </div>

                    </div>
                </div>
            </MainModal>
        </>
    )
}

export default ModalDisplayInfo