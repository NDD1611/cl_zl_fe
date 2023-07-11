
import Link from 'next/link'
import styles from './register.module.scss'
import InputWithLable from '../../components/auth/inputWithLabel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { validateEmail } from '../../utils/auth'
import api from '../../api/api'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errEmail, setErrEmail] = useState(false)
    const [errPassword, setErrPassword] = useState(false)
    const [errConfirmPassword, setErrConfirmPassword] = useState(false)
    const [errCheckLastName, setErrCheckLastName] = useState(false)
    const [errCheckFirstName, setErrCheckFirstName] = useState(false)

    const [firstInputEmail, setFirstInputEmail] = useState(false)
    const [firstInputPassword, setFirstInputPassword] = useState(false)
    const [firstInputConfirmPassword, setFirstInputConfirmPassword] = useState(false)
    const [firstInputLastName, setFirstInputLastName] = useState(false)
    const [firstInputFirstName, setFirstInputFirstName] = useState(false)


    const [typeConfirmPassword, setTypeConfirmPassword] = useState('password')
    const [typePassword, setTypePassword] = useState('password')

    const router = useRouter()

    const register = async () => {
        if (errEmail && errPassword && errConfirmPassword) {
            const response = await api.register({ email, password, firstName, lastName })
            if (response?.err) {
                toast.error(response?.exception?.response?.data, {
                    position: 'bottom-center'
                })
            } else {
                toast.success(response?.data, {
                    position: 'bottom-center'
                })
                router.push('/auth/login')
            }
        }
    }

    const checkEmail = () => {
        const check = validateEmail(email)
        if (!check) {
            setErrEmail(false)
        } else {
            setErrEmail(true)
        }
    }
    const checkPassword = () => {
        if (password.length < 8) {
            setErrPassword(false)
        } else {
            setErrPassword(true)
        }
    }
    const checkConfirmPassword = () => {
        if (password === confirmPassword) {
            setErrConfirmPassword(true)
        } else {
            setErrConfirmPassword(false)
        }
    }
    const checkLastName = () => {
        if (lastName.length === 0) {
            setErrCheckLastName(false)
        } else {
            setErrCheckLastName(true)
        }
    }
    const checkFirstName = () => {
        if (firstName.length === 0) {
            setErrCheckFirstName(false)
        } else {
            setErrCheckFirstName(true)
        }
    }
    useEffect(() => {
        checkEmail()
        checkPassword()
        checkConfirmPassword()
        checkLastName()
        checkFirstName()
        console.log(lastName, firstName)
    }, [email, password, confirmPassword, lastName, firstName])

    return (
        <>
            <div className={styles.mainLayout}>
                <div className={styles.form}>
                    <div className={styles.title}>Tạo tài khoản</div>
                    <InputWithLable
                        firstInput={firstInputEmail}
                        setFirstInput={setFirstInputEmail}
                        errCheck={errEmail}
                        value={email} setValue={setEmail}
                        title='Địa chỉ email:'
                        placeholder='email...'
                        type='text'
                        disableEye='true'
                    />

                    <div className={styles.fullName}>
                        <div>
                            <InputWithLable
                                firstInput={firstInputFirstName}
                                setFirstInput={setFirstInputFirstName}
                                errCheck={errCheckFirstName}
                                value={firstName}
                                setValue={setFirstName}
                                title='Tên:'
                                placeholder='Tên...'
                                type='text'
                                disableEye='true'
                            />
                        </div>

                        <div>
                            <InputWithLable
                                firstInput={firstInputLastName}
                                setFirstInput={setFirstInputLastName}
                                errCheck={errCheckLastName}
                                value={lastName}
                                setValue={setLastName}
                                title='Họ:'
                                placeholder='Họ...'
                                type='text'
                                disableEye='true'
                            />
                        </div>
                    </div>

                    <InputWithLable
                        firstInput={firstInputPassword}
                        setFirstInput={setFirstInputPassword}
                        errCheck={errPassword}
                        value={password}
                        setValue={setPassword}
                        title='Mật khẩu:'
                        placeholder='••••••••'
                        type={typePassword}
                        setTypeInput={setTypePassword} />
                    <InputWithLable
                        firstInput={firstInputConfirmPassword}
                        setFirstInput={setFirstInputConfirmPassword}
                        errCheck={errConfirmPassword}
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        title='Xác nhận mật khẩu:'
                        placeholder='••••••••'
                        type={typeConfirmPassword}
                        setTypeInput={setTypeConfirmPassword} />

                    <div className={styles.tipPassword}>
                        <div className={errPassword ? styles.iLabel : ''}>
                            <FontAwesomeIcon className={styles.iconCircle} icon={faCircle} />
                            <label>Mật khẩu ít nhất 8 kĩ tự</label>
                        </div>
                        <div className={errCheckFirstName && errCheckLastName ? styles.iLabel : ''}>
                            <FontAwesomeIcon className={styles.iconCircle} icon={faCircle} />
                            <label>Họ và Tên không được bỏ trống</label>
                        </div>
                    </div>

                    <button onClick={register}
                        className={`${styles.btnCreateAccount} ${errEmail && errPassword && errConfirmPassword ? '' : styles.disableButton}`}
                    >Tạo tài khoản</button>

                    <div className={styles.footer}>Bạn đã có tài khoản?
                        <Link className={styles.link} href='/auth/login'>  Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;