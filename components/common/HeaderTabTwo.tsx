import styles from './HeaderTabTwo.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { modalActions } from '../../redux/actions/modalActions'
import ModalFindFriend from './Modal/ModalFindFriend'
import ModalCreateGroup from './Modal/ModalCreateGroup'
import { Tooltip } from '@mantine/core'
import { useLingui } from '@lingui/react'
import { IconUserPlus, IconUsersGroup } from '@tabler/icons-react'

const HeaderTabTwo = () => {
    const dispatch = useDispatch()
    let i18n = useLingui()
    return (
        <>
            <div id='headerTabTwo' className={styles.HeaderTabTwo}>
                <div className={styles.input}>
                    <Tooltip label={i18n._('Coming soon')}>
                        <input disabled placeholder={i18n._('Search') + '...'} />
                    </Tooltip>
                </div>
                <div className={styles.iconAddFriend}
                    onClick={
                        () => { dispatch({ type: modalActions.SET_SHOW_MODAL_FIND_FRIEND }) }
                    }
                >
                    <IconUserPlus size={20} />
                </div>
                <div className={styles.iconAddGroup}
                    onClick={
                        () => { dispatch({ type: modalActions.SET_SHOW_MODAL_CREATE_GROUP }) }
                    }
                >
                    <IconUsersGroup size={20} />
                </div>

                <ModalFindFriend></ModalFindFriend>
                <ModalCreateGroup></ModalCreateGroup>
            </div>
        </>
    )
}

export default HeaderTabTwo