
import styles from './MenuItemFriend.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { friendActions } from '../../redux/actions/friendAction'


const MenuItemFriend = () => {
    const dispatch = useDispatch()
    const selectItem = useSelector(state => state.friend.selectItem)
    console.log(selectItem)

    return (
        <>
            <div>
                <div className={`${styles.Item} ${selectItem === 'listFriend' ? styles.selectItem : ''}`}
                    onClick={() => {
                        dispatch({
                            type: friendActions.SET_SELECT_ITEM_TAB_TWO,
                            selectItem: 'listFriend'
                        })
                    }}
                >
                    <div className={styles.Icon}>
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <p>Danh sách bạn bè</p>
                </div>
                <div className={`${styles.Item} ${selectItem === 'friendInvitation' ? styles.selectItem : ''}`} onClick={() => {
                    dispatch({
                        type: friendActions.SET_SELECT_ITEM_TAB_TWO,
                        selectItem: 'friendInvitation'
                    })
                }}
                >
                    <div className={styles.Icon}>
                        <FontAwesomeIcon icon={faEnvelopeOpen} />
                    </div>
                    <p>Lời mời kết bạn</p>
                </div>
            </div>
        </>
    )
}

export default MenuItemFriend