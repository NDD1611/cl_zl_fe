import styles from './ModalDisplayInfo.module.scss'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useLingui } from '@lingui/react';
import { modalActions } from '../../../redux/actions/modalActions'
import { Avatar, Modal } from '@mantine/core'

const ModalDisplayInfo = () => {
    const { i18n } = useLingui();
    const showModalInfo = useSelector((state: any) => state.modal.showModalInfo)
    const avatarLink = useSelector((state: any) => state.auth.userDetails.avatar)
    const dispatch = useDispatch()
    const datefake = useSelector((state: any) => state.auth.userDetails.birthday)
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    useEffect(() => {
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        let date = new Date(userDetails.birthday)
        setDay(date.getDate().toString())
        setMonth((date.getMonth() + 1).toString())
        setYear(date.getFullYear().toString())
    }, [datefake])

    const userDetails = useSelector((state: any) => state.auth.userDetails)
    const handleCloseModalInfo = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_INFO })
    }
    const handleClickUpdateInfo = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_INFO })
        dispatch({ type: modalActions.SET_SHOW_MODAL_UPDATE_INFO })
    }
    return <Modal size={'sm'} opened={showModalInfo} onClose={handleCloseModalInfo} title={i18n._('Account information')} centered>
        <div className={styles.contentModalInfo}>
            <div className={styles.image}>
                <img
                    src='/images/backgroundProfile.jpg'
                />
            </div>
            <div className={styles.avatarInfo}>
                <Avatar
                    src={avatarLink}
                    size={'lg'} alt='avatar'
                ></Avatar>
            </div>
            <p className={styles.name}>{userDetails.firstName + ' ' + userDetails.lastName}</p>
            <div className={styles.userInfo}>
                <p>{i18n._("Information")}</p>
                <div>
                    <p>Email</p>
                    <p>{userDetails.email}</p>
                </div>
                <div>
                    <p>{i18n._("Sex")}</p>
                    <p>{userDetails.sex ? userDetails.sex : i18n._("No information")}</p>
                </div>
                <div>
                    <p>{i18n._("Date of birth")}</p>
                    <p>{userDetails.birthday ? day + '/' + month + '/' + year : i18n._("No information")}</p>
                </div>
                <div className={styles.divBtn}>
                    <button className={styles.btnShowModalUpdateInfo} onClick={() => { handleClickUpdateInfo() }} >
                        <FontAwesomeIcon icon={faPenToSquare} />
                        {i18n._("Update information")}
                    </button>
                </div>
            </div>
        </div>
    </Modal>
}

export default ModalDisplayInfo