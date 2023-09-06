import styles from './HeaderTabTwo.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { modalActions } from '../../redux/actions/modalActions'
import ModalAddFriend from './Modal/ModalAddFriend'

const HeaderTabTwo = () => {
    const dispatch = useDispatch()
    return (
        <>
            <div className={styles.HeaderTabTwo}>
                <div className={styles.input}>
                    <input placeholder='Tìm kiếm' />
                </div>
                <div className={styles.iconAddFriend} onClick={() => { dispatch({ type: modalActions.SET_SHOW_MODAL_ADD_FRIEND }) }}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </div>

                <ModalAddFriend></ModalAddFriend>
            </div>
        </>
    )
}

export default HeaderTabTwo