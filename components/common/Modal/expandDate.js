import styles from './expandDate.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
const ExpandDate = ({ dataArr, value, setValue = () => { } }) => {
    const handleSelectValue = (e, value) => {
        e.stopPropagation()
        setValue(value)
    }

    return (
        <>
            <div className={styles.expand}>
                {
                    dataArr.map((element) => {
                        return (
                            <div
                                key={element}
                                className={`${styles.element} ${value === element ? styles.bgBlue : ''}`}
                                onClick={(e) => { handleSelectValue(e, element) }}
                            >
                                {element}
                                <FontAwesomeIcon
                                    className={`${styles.iconCheck} ${value !== element ? styles.hideIconCheck : ''}`}
                                    icon={faCheck}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}
export default ExpandDate;