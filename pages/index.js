import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { logout } from '../utils/auth';
import { socketConnectToServer } from '../reltimeCommunication/socketConnection'

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
    <>
      <div>DashBoasd</div>
    </>
  );
}


export default DashBoasd