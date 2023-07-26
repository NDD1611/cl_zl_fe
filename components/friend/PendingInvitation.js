
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';

import styles from './PendingInvitation.module.scss'
import Avatar from '../common/Avatar';
import addPathToLinkAvatar from '../../utils/path'
import api from '../../api/api';


const PendingInvitation = () => {
    const pendingInvitations = useSelector(state => state.friend.pendingInvitations)

    const handleRejectFriend = async (invitation) => {
        const response = await api.rejectInvitation(invitation)
    }
    const handleAcceptFriend = async (invitation) => {
        const response = await api.acceptInvitation({ invitationId: invitation._id })
    }
    return (
        <>
            <div className={styles.PendingInvitation}>
                <div className={styles.headerInvitation}>
                    <FontAwesomeIcon className={styles.headerIcon} icon={faEnvelopeOpen} />
                    Lời mời kết bạn
                </div>

                {pendingInvitations.length === 0 &&
                    <div className={styles.noResult}>
                        <div>
                            <img src='/images/invitation-emptystate.png' />
                        </div>
                        <div>
                            Bạn không có lời mời kết bạn nào
                        </div>
                    </div>
                }
                <div className={styles.centerPending}>
                    {
                        pendingInvitations.map((invitation) => {
                            return (
                                <div key={invitation._id} className={styles.pendingInvitationItem}>
                                    <div className={styles.topItem}>
                                        <Avatar
                                            src={addPathToLinkAvatar(invitation.senderId.avatar)}
                                            width={40}
                                        />
                                        <p className={styles.name}>{invitation.senderId.lastName + ' ' + invitation.senderId.firstName}</p>
                                    </div>
                                    <div className={styles.bottomItem}>
                                        <button onClick={() => { handleRejectFriend(invitation) }}>Từ chối</button>
                                        <button onClick={() => { handleAcceptFriend(invitation) }} className={styles.accept}>Chấp nhận</button>
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
export default PendingInvitation;