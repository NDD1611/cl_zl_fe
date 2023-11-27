
import { toast } from 'react-toastify'
import { useState } from 'react'
import api from '../../api/api'
import { useDispatch } from 'react-redux'
import { authActions } from '../../redux/actions/authAction'
import { useRouter } from 'next/router'
import LoaderModal from '../../components/common/Modal/LoaderModal'
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Text, Paper, Group, PaperProps, Button, Checkbox, Anchor, Stack, } from '@mantine/core';
import styles from './login.module.scss'
import { useLingui } from '@lingui/react'

const AuthenticationForm = (props: PaperProps) => {
    let i18n = useLingui()
    const [type, toggle] = useToggle(['login', 'register']);
    const [showLoader, setShowLoader] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
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
            email: (val) => (/^\S+@\S+$/.test(val) ? null : i18n._('Invalid email')),
            password: (val) => (val.length <= 6 ? i18n._('Password should include at least 6 characters') : null),
            confirmPassword: (value, values) => value !== values.password && type === i18n._('register') ? i18n._('Passwords did not match') : null,
        },
    });

    const handleSubmitForm = async () => {
        if (type === 'login') {
            setShowLoader(true)
            const response: any = await api.login({
                email: form.values.email,
                password: form.values.password
            })
            if (response.err) {
                toast.error(response?.exception?.response?.data, {
                    position: 'bottom-center'
                })
                setShowLoader(false)
            } else {
                // toast.success('Bạn đã đăng nhập thành công')
                const data = response.data
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
            const response: any = await api.register({
                email: form.values.email,
                password: form.values.password,
                firstName: form.values.firstName,
                lastName: form.values.lastName
            })
            if (response?.err) {
                toast.error(response?.exception?.response?.data, {
                    position: 'bottom-center'
                })
                setShowLoader(false)
            } else {
                toast.success(response?.data, {
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
                <Text size="lg" fw={500}>
                    {type}
                </Text>

                <Group grow mb="md" mt="md">
                </Group>

                <form onSubmit={form.onSubmit(() => { handleSubmitForm() })}>
                    <Stack>
                        {type === 'register' && (
                            <TextInput
                                label={i18n._("First name")}
                                placeholder={i18n._("Your firstName")}
                                value={form.values.firstName}
                                onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
                                radius="md"
                            />
                        )}
                        {type === 'register' && (
                            <TextInput
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
                                {upperFirst(type)}
                            </Button> :
                            <Button type="submit" radius="xl">
                                {upperFirst(type)}
                            </Button>}
                    </Group>
                </form>
            </Paper>
        </div>
    );
}

export default AuthenticationForm;