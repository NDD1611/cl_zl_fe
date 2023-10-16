import styles from './HeaderTabTwo.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { modalActions } from '../../redux/actions/modalActions'
import ModalFindFriend from './Modal/ModalFindFriend'
import ModalCreatGroup from './Modal/ModalCreateGroup'

const HeaderTabTwo = () => {
    const dispatch = useDispatch()
    const showModalCreateGroup = useSelector(state => state.modal.showModalCreateGroup)
    return (
        <>
            <div id='headerTabTwo' className={styles.HeaderTabTwo}>
                <div className={styles.input}>
                    <input disabled placeholder='Tìm kiếm' />
                </div>
                <div className={styles.iconAddFriend}
                    onClick={
                        () => { dispatch({ type: modalActions.SET_SHOW_MODAL_FIND_FRIEND }) }
                    }
                >
                    <FontAwesomeIcon icon={faUserPlus} />
                </div>
                {/* <div className={styles.iconAddGroup}
                    onClick={
                        () => { dispatch({ type: modalActions.SET_SHOW_MODAL_CREATE_GROUP }) }
                    }
                >
                    <FontAwesomeIcon icon={faUserGroup} />
                    <span>+</span>
                </div> */}

                <ModalFindFriend></ModalFindFriend>
                {
                    showModalCreateGroup &&
                    <ModalCreatGroup></ModalCreatGroup>
                }
            </div>
        </>
    )
}

export default HeaderTabTwo