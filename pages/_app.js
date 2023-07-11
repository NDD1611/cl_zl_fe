
import store from '../redux/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import 'react-toastify/dist/ReactToastify.css';

export default function app({ Component, pageProps }) {
    return <Provider store={store}>
        <Component {...pageProps} />;
        <ToastContainer />
    </Provider>
}