
import styles from './ListFriend.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';
import Avatar from '../common/Avatar'
import addPathToLinkAvatar from '../../utils/path'

const ListFriend = () => {

    const listFriends = useSelector(state => state.friend.listFriends)

    return (
        <>
            <div className={styles.listFriend}>
                <div className={styles.headerInvitation}>
                    <FontAwesomeIcon className={styles.headerIcon} icon={faUser} />
                    Danh sách bạn bè
                </div>
                <div>
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