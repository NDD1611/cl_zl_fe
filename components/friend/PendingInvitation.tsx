import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'
import { useState, useEffect } from 'react'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import styles from './PendingInvitation.module.scss'
import Avatar from '../common/Avatar'
import api from '../../api/api'
import LoaderModal from '../common/Modal/LoaderModal'
import { tabsActions } from '../../redux/actions/tabsAction'
import { useLingui } from '@lingui/react'
import { Button } from '@mantine/core'

const PendingInvitation = () => {
    let i18n = useLingui()
    const router = useRouter()
    const pendingInvitations = useSelector((state: any) => state.friend.pendingInvitations)
    const [showLoader, setShowLoader] = useState(false)
    const [showBackButton, setShowBackButton] = useState(false)
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
        const { locale } = router
        router.push('/', '/', { locale: locale })
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
                    {showBackButton &&
                        <div className={styles.backButton} onClick={showTabTwoAndCloseTabThree}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    }
                    <FontAwesomeIcon className={styles.headerIcon} icon={faEnvelopeOpen} />
                    {i18n._('Friend request')}
                </div>
                {pendingInvitations.length === 0 &&
                    <div className={styles.noResult}>
                        <div>
                            <img src='/images/invitation-emptystate.png' />
                        </div>
                        <div>
                            {i18n._("You don't have any friend requests")}
                        </div>
                    </div>
                }
                <div className={styles.centerPending}>
                    {
                        pendingInvitations.map((invitation) => {
                            return <div key={invitation._id} className={styles.pendingInvitationItem}>
                                <div className={styles.topItem}>
                                    <Avatar
                                        src={invitation?.senderId?.avatar ? invitation?.senderId?.avatar : ''}
                                        width={40}
                                    />
                                    <p className={styles.name}>{invitation.senderId.lastName + ' ' + invitation.senderId.firstName}</p>
                                </div>
                                <div className={styles.bottomItem}>
                                    {
                                        showLoader ?
                                            <>
                                                <Button loading variant="filled" color="gray" onClick={() => { handleRejectFriend(invitation) }}>{i18n._('Refuse')}</Button>
                                                <Button loading variant="filled" onClick={() => { handleAcceptFriend(invitation) }} >{i18n._('Accept')}</Button>
                                            </>
                                            :
                                            <>
                                                <Button variant="filled" color="gray" onClick={() => { handleRejectFriend(invitation) }}>{i18n._('Refuse')}</Button>
                                                <Button variant="filled" onClick={() => { handleAcceptFriend(invitation) }} >{i18n._('Accept')}</Button>
                                            </>
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default PendingInvitation;