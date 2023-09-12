import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import styles from './ListFriend.module.scss'
import Avatar from '../common/Avatar'
import addPathToLinkAvatar from '../../utils/path'
import { tabsActions } from '../../redux/actions/tabsAction'
import { Oval } from 'react-loader-spinner'

const ListFriend = () => {
    const [showBackbutton, setShowBackButton] = useState(false)
    const listFriends = useSelector(state => state.friend.listFriends)
    const dispatch = useDispatch()
    useEffect(() => {
        if (window.innerWidth < 700) {
            setShowBackButton(true)
        } else {
            setShowBackButton(false)
        }
    }, [])

    const showTabTwoAndCloseTabThree = () => {
        dispatch({
            type: tabsActions.SET_CLOSE_TAB_THREE
        })
        dispatch({
            type: tabsActions.SET_SHOW_TAB_TWO
        })
    }

    return (
        <>
            <div className={styles.listFriend}>
                <div className={styles.headerInvitation}>
                    {showBackbutton &&
                        <div className={styles.backButton} onClick={showTabTwoAndCloseTabThree}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    }
                    <FontAwesomeIcon className={styles.headerIcon} icon={faUser} />
                    Danh sách bạn bè
                </div>
                <div>
                    {
                        listFriends.length === 0 && <div className={styles.noFriend}>
                            Bạn chưa có bạn bè
                        </div>
                    }
                    {
                        listFriends.map((friend) => {
                            return (
                                <div key={friend._id} className={styles.friendItem}>
                                    <div className={styles.left}>
                                        <Avatar
                                            width={50}
                                            src={addPathToLinkAvatar(friend.avatar ? friend.avatar : '')}
                                        />
                                        <div className={styles.name}>{friend.firstName + ' ' + friend.lastName}</div>
                                    </div>
                                    <div className={styles.right}>
                                        {/* icon */}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default ListFriend;