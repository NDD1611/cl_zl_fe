import { useEffect } from 'react';
import { logout } from '../utils/auth';
import styles from './friend.module.scss'
import MainTab from '../components/common/MainTab';
import { socketConnectToServer } from '../reltimeCommunication/socketConnection'
import { useDispatch } from 'react-redux';
import { maintabActions } from '../redux/actions/maintabAction';
import TabTwo from '../components/common/tabTwo';
import MenuItemFriend from '../components/friend/MenuItemFriend';
import HeaderTabTwo from '../components/common/HeaderTabTwo';

function friend() {
    const dispatch = useDispatch()

    useEffect(() => {
        if (window.location.pathname === '/friend') {
            dispatch({
                type: maintabActions.SET_MAIN_TAB,
                maintabSelect: 'friend'
            })
        }
        const userDetails = JSON.parse(localStorage.getItem('userDetails'))
        if (!userDetails) {
            logout()
        } else {
            socketConnectToServer(userDetails)
        }
    }, [])
    return (
        <div className={styles.friend}>
            <MainTab></MainTab>
            <TabTwo>
                <HeaderTabTwo></HeaderTabTwo>
                <MenuItemFriend></MenuItemFriend>
            </TabTwo>
        </div>
    )
}


export default friend