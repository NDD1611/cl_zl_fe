import store from '../redux/store'
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

export default function app({ Component, pageProps }) {
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'))
        if ((userDetails && socket === null) || (socket && socket.connected === false)) {
            socketConnectToServer(userDetails)
        }
    })

    return <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer />
    </Provider>
}