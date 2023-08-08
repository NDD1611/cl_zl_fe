


import { InfinitySpin } from 'react-loader-spinner'
import styles from './LoaderModal.module.scss'

const LoaderModal = () => {
    return (
        <>
            <div className={styles.LoaderModal}>
                <InfinitySpin
                    width='200'
                    color="#0062cc"
                />
            </div>
        </>
    )
}

export default LoaderModal;