
import styles from './MainModal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const MainModal = (props) => {
    const { title, closeModal, setCloseModal = () => { } } = props
    return (
        <>
            <div className={`${styles.MainModal} ${closeModal ? '' : styles.closeModal}`}>
                <div className={styles.backgroundOpacity}></div>
                <div className={styles.content}>
                    <div className={styles.title}>{title}
                        <div className={styles.closeX} onClick={() => { setCloseModal() }} >
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>

                    {props.children}
                </div>
            </div>
        </>
    )
}

export default MainModal;
