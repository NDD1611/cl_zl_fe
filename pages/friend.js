import { useEffect } from 'react'
import { logout } from '../utils/auth'
import styles from './friend.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { tabsActions } from '../redux/actions/tabsAction'
import TabTwo from '../components/common/tabTwo'
import MenuItemFriend from '../components/friend/MenuItemFriend'
import HeaderTabTwo from '../components/common/HeaderTabTwo'
import TabThree from '../components/common/TabThree'
import PendingInvitation from '../components/friend/PendingInvitation'
import ListFriend from '../components/friend/ListFriend'
import { Navbar } from '../components/NavBars/Navbar'

const Friend = () => {
    const dispatch = useDispatch()
    const selectItem = useSelector(state => state.friend.selectItem)

    useEffect(() => {
        if (window.location.pathname === '/friend') {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: 'friends'
            })
        }
        const userDetails = JSON.parse(localStorage.getItem('userDetails'))
        if (!userDetails) {
            logout()
        }
    }, [])
    return (
        <div className={styles.friend}>
            <Navbar></Navbar>
            <TabTwo>
                <HeaderTabTwo></HeaderTabTwo>
                <MenuItemFriend></MenuItemFriend>
            </TabTwo>
            <TabThree>
                {
                    selectItem === 'friendInvitation' && <PendingInvitation></PendingInvitation>
                }
                {
                    selectItem === 'listFriend' && <ListFriend></ListFriend>
                }
            </TabThree>
        </div>
    )
}

export default Friend