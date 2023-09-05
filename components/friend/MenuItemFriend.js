
import styles from './MenuItemFriend.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { friendActions } from '../../redux/actions/friendAction'
import { tabsActions } from '../../redux/actions/tabsAction'


const MenuItemFriend = () => {
    const dispatch = useDispatch()
    const selectItem = useSelector(state => state.friend.selectItem)
    const pendingInvitation = useSelector(state => state.friend.pendingInvitations)

    const showTab3AndCloseTabTwo = () => {
        if (window.innerWidth < 800) {
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_TWO
            })
        } else {
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE
            })
            dispatch({
                type: tabsActions.SET_SHOW_TAB_TWO
            })
        }
    }
    return (
        <>
            <div>
                <div className={`${styles.Item} ${selectItem === 'listFriend' ? styles.selectItem : ''}`}
                    onClick={() => {
                        dispatch({
                            type: friendActions.SET_SELECT_ITEM_TAB_TWO,
                            selectItem: 'listFriend'
                        })
                        showTab3AndCloseTabTwo()
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
                    showTab3AndCloseTabTwo()
                }}
                >
                    <div className={styles.Icon}>
                        <FontAwesomeIcon icon={faEnvelopeOpen} />
                    </div>
                    <p>Lời mời kết bạn</p>
                    {
                        pendingInvitation.length !== 0 && <div className={styles.quantityFriendInvitation}>
                            <span>{pendingInvitation.length}</span>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default MenuItemFriend