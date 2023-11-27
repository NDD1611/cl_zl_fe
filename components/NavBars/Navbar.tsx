import { useEffect, useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem, Avatar, Indicator, Menu, Button, Text, Box } from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconCalendarStats,
    IconLogout,
    IconBrandWechat,
    IconSettings,
    IconFileInfo,
    IconUserSquareRounded
} from '@tabler/icons-react';
import classes from './Navbar.module.scss';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { tabsActions } from '../../redux/actions/tabsAction';
import { authActions } from '../../redux/actions/authAction';
import { logout } from '../../utils/auth';
import { modalActions } from '../../redux/actions/modalActions';
import ModalDisplayInfo from '../common/Modal/ModalDisplayInfo'
import ModalUpdateInfo from '../common/Modal/ModalUpdateInfo'
import { useLingui } from '@lingui/react';
import { useDisclosure } from '@mantine/hooks';
interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { i18n } = useLingui();
    const countAnnounceMessage = useSelector((state: any) => state.tabs.countAnnounceMessage)
    const pendingInvitation = useSelector((state: any) => state.friend.pendingInvitations)
    return (
        <Tooltip label={i18n._(label)} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                {label === 'Conversations' && <Box>{countAnnounceMessage !== 0 && countAnnounceMessage}</Box>}
                {label === 'friends' && <Box>{pendingInvitation.length !== 0 && pendingInvitation.length}</Box>}
            </UnstyledButton>
        </Tooltip>
    );
}

export function Navbar() {
    const maintabSelect = useSelector((state: any) => state.tabs.maintabSelect)
    const userDetails = useSelector((state: any) => state.auth.userDetails)
    const showTabTwo = useSelector((state: any) => state.tabs.showTabTwo)
    const showTabThree = useSelector((state: any) => state.tabs.showTabThree)
    const conversations = useSelector((state: any) => state.conversation.conversations)
    const countAnnounceMessage = useSelector((state: any) => state.tabs.countAnnounceMessage)
    const pendingInvitation = useSelector((state: any) => state.friend.pendingInvitations)
    const dispatch = useDispatch()
    const { i18n } = useLingui();
    const router = useRouter()
    const [opened, { open, close }] = useDisclosure(false);
    const handleNavbarClick = (mainTabSelect: string) => {

        if (mainTabSelect === 'Conversations') {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: mainTabSelect
            })
            const { locale } = router
            router.push('/', '/', { locale: locale })

        } else if (mainTabSelect === 'friends') {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: mainTabSelect
            })
            const { locale } = router
            router.push('/friend', '/friend', { locale: locale })
        }
    }

    useEffect(() => {
        let userDetailsData = JSON.parse(localStorage.getItem('userDetails'))
        dispatch({
            type: authActions.SET_USER_DETAIL,
            userDetails: userDetailsData
        })
        if (window.innerWidth < 700 && showTabTwo && showTabThree) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_THREE
            })
        }
    }, [])

    useEffect(() => {
        if (conversations) {
            const userDetails = JSON.parse(localStorage.getItem('userDetails'))
            let count = 0
            conversations.forEach(conversation => {
                let messages = conversation.messages
                if (messages.length) {
                    messages.forEach(message => {
                        if ((message.sender._id != userDetails._id && message.status == '2')
                            || (message.status == '2' && message.type === 'accept_friend')) {
                            count++
                        }
                    })
                }
            })
            dispatch({
                type: tabsActions.SET_COUNT_ANNOUNCE_MESSAGE,
                countAnnounceMessage: count
            })
        }
    }, [conversations])
    return (
        <nav className={classes.navbar}>
            < ModalDisplayInfo ></ModalDisplayInfo>
            <ModalUpdateInfo />
            <Center>
                <Avatar src={userDetails.avatar} size={'lg'} alt='avatar' />
            </Center>
            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    <Tooltip label={i18n._('Conversations')} position="right" transitionProps={{ duration: 0 }}>
                        <UnstyledButton onClick={() => handleNavbarClick('Conversations')} className={classes.link} data-active={maintabSelect === 'Conversations' || undefined}>
                            <IconBrandWechat style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                            {<Box>{countAnnounceMessage !== 0 && countAnnounceMessage}</Box>}
                        </UnstyledButton>
                    </Tooltip>
                    <Tooltip label={i18n._('friends')} position="right" transitionProps={{ duration: 0 }}>
                        <UnstyledButton onClick={() => handleNavbarClick('friends')} className={classes.link} data-active={maintabSelect === 'friends' || undefined}>
                            <IconUserSquareRounded style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                            {<Box>{pendingInvitation.length !== 0 && pendingInvitation.length}</Box>}
                        </UnstyledButton>
                    </Tooltip>
                    <Tooltip label={i18n._('Coming soon')} position="right" transitionProps={{ duration: 0 }}>
                        <UnstyledButton onClick={() => { }} className={classes.link} data-active={maintabSelect === 'coming soon' || undefined}>
                            <IconDeviceDesktopAnalytics style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                        </UnstyledButton>
                    </Tooltip>
                    <Tooltip label={i18n._('Coming soon')} position="right" transitionProps={{ duration: 0 }}>
                        <UnstyledButton onClick={() => { }} className={classes.link} data-active={maintabSelect === 'coming soon' || undefined}>
                            <IconCalendarStats style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                        </UnstyledButton>
                    </Tooltip>
                </Stack>
            </div>

            <Stack justify="center" gap={0}>
                {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" /> */}<Menu shadow="md" width={200} position='right'>
                    <Menu.Target >
                        <Box component='div'
                            mb={15}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Avatar style={{ cursor: 'pointer' }} size={'sm'} src={i18n._("/images/en.png")} alt='image flag' />
                        </Box>
                    </Menu.Target>

                    <Menu.Dropdown >
                        <Menu.Item
                            onClick={() => {
                                const { pathname, asPath, query } = router
                                router.push({ pathname, query }, asPath, { locale: 'en' })
                            }}
                        >
                            English
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => {
                                const { pathname, asPath, query } = router
                                router.push({ pathname, query }, asPath, { locale: 'vi' })
                            }}
                        >
                            Tiếng Việt
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Menu shadow="md" width={200} position='right'>
                    <Menu.Target >
                        <Box component='div' style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <IconSettings style={{ width: rem(25), height: rem(25) }} />
                        </Box>
                    </Menu.Target>

                    <Menu.Dropdown >
                        <Menu.Item
                            leftSection={<IconFileInfo style={{ width: rem(14), height: rem(14) }} />}
                            onClick={() => { dispatch({ type: modalActions.SET_SHOW_MODAL_INFO }) }}
                        >
                            {i18n._("User information")}
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                            onClick={() => { logout() }}
                        >
                            {i18n._("Logout")}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Stack>
        </nav >
    );
}