
import { toast } from 'react-toastify'
import { useState } from 'react'
import api from '../../api/api'
import { useDispatch } from 'react-redux'
import { authActions } from '../../redux/actions/authAction'
import { useRouter } from 'next/router'
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Text, Paper, Group, PaperProps, Button, Checkbox, Anchor, Stack, Box, Flex, } from '@mantine/core';
import styles from './login.module.scss'
import { useLingui } from '@lingui/react'
import { SwitchLanguage } from '../../components/NavBars/Navbar'
import { toastMessage } from '../../utils/toast'
const AuthenticationForm = (props: PaperProps) => {
    let i18n = useLingui()
    const [type, toggle] = useToggle(['login', 'register']);
    i18n._('login')
    i18n._('register')
    const [showLoader, setShowLoader] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const form = useForm({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            terms: true,
        },

        validate: {
            email: (val) => emailRegex.test(val) ? null : i18n._('Invalid email'),
            password: (val) => (val.length < 6 ? i18n._('Password should include at least 6 characters') : null),
            confirmPassword: (value, values) => value !== values.password && type === 'register' ? i18n._('Passwords did not match') : null,
        },
    });

    const handleSubmitForm = async () => {
        if (type === 'login') {
            setShowLoader(true)
            const res: any = await api.login({
                email: form.values.email,
                password: form.values.password
            })
            if (res.err) {
                toast.error(toastMessage(res?.exception?.response?.data?.code, i18n), {
                    position: 'bottom-center'
                })
                setShowLoader(false)
            } else {

                const data = res?.response?.data?.userDetails
                localStorage.setItem('userDetails', JSON.stringify(data))
                dispatch({
                    type: authActions.SET_USER_DETAIL,
                    userDetails: data
                })
                const { locale } = router
                router.push('/', '/', { locale: locale })
            }

        } else if (type === 'register') {
            setShowLoader(true)
            const res: any = await api.register({
                email: form.values.email,
                password: form.values.password,
                firstName: form.values.firstName,
                lastName: form.values.lastName
            })
            if (res?.err) {
                toast.error(toastMessage(res.exception?.response?.data?.code, i18n), {
                    position: 'bottom-center'
                })
                setShowLoader(false)
            } else {
                toast.success(toastMessage(res?.response?.data?.code, i18n), {
                    position: 'bottom-center'
                })
                toggle()
                setShowLoader(false)
            }
        }
    }

    return (
        <div className={styles.authentication}>
            <Paper w={450} radius="md" p="xl" withBorder {...props}>
                <Flex
                    justify={'space-between'}
                >
                    <Text size="lg" fw={500}>
                        {i18n._(type)}
                    </Text>
                    <SwitchLanguage />
                </Flex>

                <form onSubmit={form.onSubmit(() => { handleSubmitForm() })}>
                    <Stack>
                        {type === 'register' && (
                            <TextInput
                                required
                                label={i18n._("First name")}
                                placeholder={i18n._("Your firstName")}
                                value={form.values.firstName}
                                onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
                                radius="md"
                            />
                        )}
                        {type === 'register' && (
                            <TextInput
                                required
                                label={i18n._("Last name")}
                                placeholder={i18n._("Your lastName")}
                                value={form.values.lastName}
                                onChange={(event) => form.setFieldValue('lastName', event.currentTarget.value)}
                                radius="md"
                            />
                        )}

                        <TextInput
                            required
                            label="Email"
                            placeholder="test@gmail.com"
                            value={form.values.email}
                            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                            error={form.errors.email && 'Invalid email'}
                            radius="md"
                        />

                        <PasswordInput
                            required
                            label={i18n._("Password")}
                            placeholder={i18n._("Your password")}
                            value={form.values.password}
                            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                            error={form.errors.password && i18n._('Password should include at least 6 characters')}
                            radius="md"
                        />

                        {type === 'register' &&
                            <PasswordInput
                                label={i18n._("Confirm password")}
                                placeholder={i18n._("Confirm password")}
                                {...form.getInputProps('confirmPassword')}
                            />
                        }

                        {type === 'register' && (
                            <Checkbox
                                label={i18n._("I accept terms and conditions")}
                                checked={form.values.terms}
                                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                            />
                        )}
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                            {type === 'register'
                                ? i18n._('You already have an account? Login')
                                : i18n._("You don't have an account? Register")}
                        </Anchor>
                        {showLoader ?
                            <Button loading type="submit" radius="xl">
                                {upperFirst(i18n._(type))}
                            </Button> :
                            <Button type="submit" radius="xl">
                                {upperFirst(i18n._(type))}
                            </Button>}
                    </Group>
                </form>
            </Paper>
        </div>
    );
}

export default AuthenticationForm;