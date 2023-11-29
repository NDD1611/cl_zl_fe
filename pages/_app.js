'use client'
import store from '../redux/store'
import '../styles/global.css'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
import 'normalize.css/normalize.css'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { socketConnectToServer } from '../reltimeCommunication/socketConnection'
import { socket } from '../reltimeCommunication/socketConnection'
config.autoAddCss = false
import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
const theme = createTheme({
    /** Put your mantine theme override here */
});
import messagesEn from "../locales/en/messages.json";
import messagesVi from "../locales/vi/messages.json";
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import { useState } from 'react'


i18n.load({
    en: messagesEn,
    vi: messagesVi
});

i18n.activate('en');
export default function app({ Component, pageProps }) {
    const router = useRouter()
    const { locale } = router

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'))
        if ((userDetails && socket === null) || (socket && socket.connected === false)) {
            socketConnectToServer(userDetails)
        }
    })
    useEffect(() => {
        i18n.activate(locale);
    }, [locale])

    return <Provider store={store}>
        <I18nProvider i18n={i18n}>
            <MantineProvider theme={theme}>
                <Component {...pageProps} />
            </MantineProvider>
        </I18nProvider>
        <ToastContainer />
    </Provider>
}