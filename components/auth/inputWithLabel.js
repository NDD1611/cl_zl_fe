
import styles from './inputWithLabel.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
const InputWithLable = ({
    firstInput,
    setFirstInput = () => { },
    errCheck = null,
    value,
    setValue = () => { },
    title,
    placeholder,
    type,
    disableEye = null,
    setTypeInput = () => { }
}) => {
    const inputOnchange = (e) => {
        setValue(e.target.value)
        setFirstInput(true)
    }
    const showHidePass = () => {
        if (type === 'password') {
            setTypeInput('text')
        } else {
            setTypeInput('password')
        }
    }
    return (
        <>
            <div className={styles.labelInput}>
                <label htmlFor={title} className={styles.label}>{title}
                    {
                        disableEye ?
                            '' :
                            <FontAwesomeIcon onClick={showHidePass}
                                className={styles.showHidePass} icon={type === 'password' ? faEye : faEyeSlash}
                            />
                    }
                </label>
                <input onChange={inputOnchange} value={value} id={title} className={`${styles.input}`} placeholder={placeholder} type={type}></input>
                {

                    firstInput && errCheck ? <FontAwesomeIcon className={styles.checkSucces} icon={faCheck} /> : ''
                }

            </div >
        </>
    )
}

export default InputWithLable;