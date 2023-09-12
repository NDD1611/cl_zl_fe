import { InfinitySpin, Oval } from 'react-loader-spinner'
import styles from './LoaderModal.module.scss'

const LoaderModal = () => {
    return (
        <>
            <div className={styles.LoaderModal}>
                <Oval
                    width={200}
                    color="#0062cc"
                    secondaryColor='#ccc'
                />
            </div>
        </>
    )
}

export default LoaderModal;