
import styles from './HeaderTabTwo.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import MainModal from './Modal/MainModal'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { modalActions } from '../../redux/actions/modalActions'

const HeaderTabTwo = () => {
    const showModalAddFriend = useSelector(state => state.modal.showModalAddFriend)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const addFriend = () => {
        console.log(email)
    }
    const handleCloseModalAddFriend = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_ADD_FRIEND })
    }
    return (
        <>
            <div className={styles.HeaderTabTwo}>
                <div className={styles.input}>
                    <input placeholder='Tìm kiếm' />
                </div>
                <div className={styles.iconAddFriend} onClick={() => { dispatch({ type: modalActions.SET_SHOW_MODAL_ADD_FRIEND }) }}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </div>

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
            </div>
        </>
    )
}

export default HeaderTabTwo