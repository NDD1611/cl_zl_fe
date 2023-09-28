import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'
import { useState, useEffect } from 'react'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import styles from './PendingInvitation.module.scss'
import Avatar from '../common/Avatar'
import { addPathToLinkAvatar } from '../../utils/path'
import api from '../../api/api'
import LoaderModal from '../common/Modal/LoaderModal'
import { tabsActions } from '../../redux/actions/tabsAction'

const PendingInvitation = () => {
    const router = useRouter()
    const pendingInvitations = useSelector(state => state.friend.pendingInvitations)
    const [showLoader, setShowLoader] = useState(false)
    const [showBackbutton, setShowBackButton] = useState(false)
    const dispatch = useDispatch()
    const handleRejectFriend = async (invitation) => {
        setShowLoader(true)
        const response = await api.rejectInvitation(invitation)
        setShowLoader(false)
    }
    const handleAcceptFriend = async (invitation) => {
        setShowLoader(true)
        const response = await api.acceptInvitation({ invitationId: invitation._id })
        setShowLoader(false)
        router.push('/')
    }

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
            {showLoader ? <LoaderModal /> : ''}
            <div className={styles.PendingInvitation}>
                <div className={styles.headerInvitation}>
                    {showBackbutton &&
                        <div className={styles.backButton} onClick={showTabTwoAndCloseTabThree}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    }
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
                                        <button onClick={() => { handleAcceptFriend(invitation) }} className={styles.accept}>
                                            Chấp nhận
                                        </button>
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