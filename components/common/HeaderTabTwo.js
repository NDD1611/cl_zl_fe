import styles from './HeaderTabTwo.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { modalActions } from '../../redux/actions/modalActions'
import ModalFindFriend from './Modal/ModalFindFriend'

const HeaderTabTwo = () => {
    const dispatch = useDispatch()
    return (
        <>
            <div id='headerTabTwo' className={styles.HeaderTabTwo}>
                <div className={styles.input}>
                    <input disabled placeholder='Tìm kiếm' />
                </div>
                <div className={styles.iconAddFriend} onClick={
                    () => { dispatch({ type: modalActions.SET_SHOW_MODAL_FIND_FRIEND }) }
                }>
                    <FontAwesomeIcon icon={faUserPlus} />
                </div>

                <ModalFindFriend></ModalFindFriend>
            </div>
        </>
    )
}

export default HeaderTabTwo