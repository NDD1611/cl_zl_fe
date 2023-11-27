import styles from './ModalCreateGroup.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { modalActions } from '../../../redux/actions/modalActions'
import { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import api from '../../../api/api'
import { useLingui } from '@lingui/react'
import { Button, Indicator, Modal, Tooltip } from '@mantine/core'
const ModalCreateGroup = () => {
    let i18n = useLingui()
    const listFriends = useSelector((state: any) => state.friend.listFriends)
    const [groupName, setGroupName] = useState('')
    const [groupSelect, setGroupSelect] = useState([])
    const [check, setCheck] = useState(false)
    const dispatch = useDispatch()
    const showModalCreateGroup = useSelector((state: any) => state.modal.showModalCreateGroup)
    const handleCloseModalCreateGroup = () => {
        dispatch({
            type: modalActions.SET_HIDE_MODAL_CREATE_GROUP
        })
    }
    useEffect(() => {
        if (groupSelect.length >= 2) {
            setCheck(true)
        } else {
            setCheck(false)
        }
    }, [groupSelect])
    const handleClickFriend = (user) => {
        let copyGroupSelect = JSON.parse(JSON.stringify(groupSelect))
        let check = false
        for (let x of groupSelect) {
            if (user._id == x._id) {
                check = true
            }
        }
        if (check) {
            copyGroupSelect = groupSelect.filter(x => {
                return x._id != user._id
            })
        } else {
            copyGroupSelect.push(user)
        }
        setGroupSelect(copyGroupSelect)
    }
    const checkUserExitInArray = (user, array) => {
        let check = false
        for (let x of array) {
            if (user._id == x._id) {
                check = true
            }
        }
        return check
    }
    const handleRemoveUserFromGroupSelect = (user) => {
        let copyGroupSelect = groupSelect.filter(x => {
            return x._id != user._id
        })
        setGroupSelect(copyGroupSelect)
    }
    const createGroup = async () => {
        // if (check) {
        //     console.log(groupName, groupSelect)
        // }
        let res: any = await api.testQueryLimit()
        console.log(res.data[0])

    }
    return <>
        {/* <div className={styles.ModalCreateGroup}> */}
        <Modal size={'xl'} opened={showModalCreateGroup} onClose={handleCloseModalCreateGroup} title={i18n._('Create group')} >
            <div className={styles.content}>
                <div className={styles.bodyModal}>
                    <div className={styles.inputEmail}>
                        <input value={groupName} placeholder={i18n._('Group name') + '...'}
                            onChange={(e) => { setGroupName(e.target.value) }}
                        />
                    </div>
                    <div className={styles.listFriend}>
                        <div className={styles.listLeft}>
                            {
                                listFriends && listFriends.map((friend) => {
                                    let check = checkUserExitInArray(friend, groupSelect)
                                    return <div key={friend._id} className={styles.friendItem} onClick={() => { handleClickFriend(friend) }}>
                                        <div className={styles.check}>
                                            {
                                                check ?
                                                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#0d65fd", }} />
                                                    :
                                                    <FontAwesomeIcon icon={faCircle} style={{ color: "#ccc", }} />
                                            }
                                        </div>
                                        <div>
                                            <Avatar src={friend?.avatar} width={30} />
                                        </div>
                                        <div className={styles.name}>{friend.firstName + ' ' + friend.lastName}</div>
                                    </div>
                                })
                            }
                        </div>
                        {
                            groupSelect.length > 0 &&
                            <div className={styles.listFriendSelect}>
                                {
                                    groupSelect && groupSelect.map((friend) => {
                                        return <div key={friend._id} className={styles.friendSelect}>
                                            <div className={styles.selectLeft}>
                                                <div>
                                                    <Avatar src={friend?.avatar} width={20} />
                                                </div>
                                                <div className={styles.name}>{friend.firstName + ' ' + friend.lastName}</div>
                                            </div>
                                            <div>
                                                <FontAwesomeIcon className={styles.iconRemove}
                                                    onClick={(e) => { handleRemoveUserFromGroupSelect(friend) }}
                                                    icon={faCircleXmark} style={{ color: "#0d65fd", }}
                                                />
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.footerBtn}>
                    <Button className={styles.btnCancel} onClick={handleCloseModalCreateGroup} >{i18n._('Cancel')}</Button>
                    <Tooltip label={i18n._("Coming soon")}>
                        <Button className={`${styles.btnFind} ${!check && styles.opacityHalf}`} onClick={createGroup}>{i18n._('Create')}</Button>
                    </Tooltip>
                </div>
            </div>
        </Modal>
    </>
}

export default ModalCreateGroup;
