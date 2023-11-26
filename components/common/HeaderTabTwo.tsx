import styles from './HeaderTabTwo.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { modalActions } from '../../redux/actions/modalActions'
import ModalFindFriend from './Modal/ModalFindFriend'
import ModalCreateGroup from './Modal/ModalCreateGroup'
import { Tooltip } from '@mantine/core'
import { useLingui } from '@lingui/react'

const HeaderTabTwo = () => {
    const dispatch = useDispatch()
    let i18n = useLingui()
    const showModalCreateGroup = useSelector((state: any) => state.modal.showModalCreateGroup)
    return (
        <>
            <div id='headerTabTwo' className={styles.HeaderTabTwo}>
                <div className={styles.input}>
                    <Tooltip label={'Coming soon'}>
                        <input disabled placeholder={i18n._('Search') + '...'} />
                    </Tooltip>
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
                    <ModalCreateGroup></ModalCreateGroup>
                }
            </div>
        </>
    )
}

export default HeaderTabTwo