import { useEffect, useState } from 'react';
import { logout } from '../utils/auth';
import styles from './index.module.scss'
import MainTab from '../components/common/MainTab';
import TabTwo from '../components/common/tabTwo';
import HeaderTabTwo from '../components/common/HeaderTabTwo';
import ConversationList from '../components/common/conversation/ConversationList';
import TabThree from '../components/common/TabThree';
import ChatArea from '../components/chatArea/ChatArea';

function DashBoasd() {

  const [render, setRender] = useState(false)

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'))
    if (!userDetails) {
      logout()
    } else {
      setRender(true)
    }
  }, [])

  if (render)
    return (
      <div className={styles.dashboash}>
        <MainTab></MainTab>
        <TabTwo>
          <HeaderTabTwo></HeaderTabTwo>
          <ConversationList ></ConversationList>
        </TabTwo>
        <TabThree>
          <ChatArea></ChatArea>
        </TabThree>
      </div>
    )
}


export default DashBoasd