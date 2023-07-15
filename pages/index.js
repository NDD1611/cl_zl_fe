import { useEffect } from 'react';
import { logout } from '../utils/auth';
import { socketConnectToServer } from '../reltimeCommunication/socketConnection'
import styles from './index.module.scss'
import MainTab from '../components/common/MainTab';
import TabTwo from '../components/common/tabTwo';
import HeaderTabTwo from '../components/common/HeaderTabTwo';

function DashBoasd() {

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'))
    if (!userDetails) {
      logout()
    } else {
      socketConnectToServer(userDetails)
    }
  }, [])
  return (
    <div className={styles.dashboash}>
      <MainTab></MainTab>
      <TabTwo>
        <HeaderTabTwo />
      </TabTwo>
    </div>
  )
}


export default DashBoasd