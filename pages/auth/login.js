
import Link from 'next/link';
import InputWithLable from '../../components/auth/inputWithLabel';
import styles from './login.module.scss'
import { toast } from 'react-toastify';
import { useState } from 'react';
import api from '../../api/api';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/actions/authAction';
import { useRouter } from 'next/router';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [typePassword, setTypePassword] = useState('password')

    const dispatch = useDispatch()
    const router = useRouter()

    const login = async () => {
        const response = await api.login({ email, password })
        if (response.err) {
            console.log(response)
            toast.error(response?.exception?.response?.data, {
                position: 'bottom-center'
            })
        } else {
            toast.success('Bạn đã đăng nhập thành công')
            const data = response.data
            localStorage.setItem('userDetails', JSON.stringify(data))

            dispatch({
                type: authActions.SET_USER_DETAIL,
                userDetails: data
            })
            router.push('/')
        }
    }
    return (
        <>
            <div className={styles.mainLayout}>
                <div className={styles.form}>
                    <div className={styles.title}>Đăng nhập</div>
                    <InputWithLable
                        title='Địa chỉ email:'
                        placeholder='email...'
                        type='text'
                        value={email}
                        setValue={setEmail}
                        disableEye='true'
                    />
                    <InputWithLable
                        title='Mật khẩu:'
                        placeholder='••••••••'
                        value={password}
                        setValue={setPassword}
                        type={typePassword}
                        setTypeInput={setTypePassword}
                    />

                    <button onClick={login} className={styles.btnCreateAccount}>Đăng nhập</button>

                    <div className={styles.footer}>Bạn đã có tài khoản?
                        <Link className={styles.link} href='/auth/register'>  Đăng kí</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;