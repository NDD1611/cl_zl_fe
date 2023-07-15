
import styles from './MenuItemFriend.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'


const MenuItemFriend = () => {

    return (
        <>
            <div>
                <div className={styles.Item}>
                    <div className={styles.Icon}>
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <p>Danh sách bạn bè</p>
                </div>
                <div className={styles.Item}>
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