'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import UserDropdown from '@components/layout/shared/UserDropdown'

// import Logo from '@components/layout/shared/Logo'
// import ModeDropdown from '@components/layout/shared/ModeDropdown'

// Hook Imports
// import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import NavSearch from '../shared/search'

// import type { ShortcutsType } from '../shared/ShortcutsDropdown'
// import type { NotificationsType } from '../shared/NotificationsDropdown'

// import LanguageDropdown from '../shared/LanguageDropdown'
// import NotificationDropdown from '../shared/NotificationsDropdown'
// import ShortcutsDropdown from '../shared/ShortcutsDropdown'

const NavbarContent = () => {
  // Hooks
  // const { isBreakpointReached } = useHorizontalNav()

  // Vars
  // const shortcuts: ShortcutsType[] = [
  //   {
  //     url: '/apps/calendar',
  //     icon: 'tabler-calendar',
  //     title: 'Calendar',
  //     subtitle: 'Appointments'
  //   },
  //   {
  //     url: '/apps/invoice/list',
  //     icon: 'tabler-file-dollar',
  //     title: 'Invoice App',
  //     subtitle: 'Manage Accounts'
  //   },
  //   {
  //     url: '/apps/user/list',
  //     icon: 'tabler-user',
  //     title: 'Users',
  //     subtitle: 'Manage Users'
  //   },
  //   {
  //     url: '/apps/roles',
  //     icon: 'tabler-users-group',
  //     title: 'Role Management',
  //     subtitle: 'Permissions'
  //   },
  //   {
  //     url: '/',
  //     icon: 'tabler-device-desktop-analytics',
  //     title: 'Dashboard',
  //     subtitle: 'User Dashboard'
  //   },
  //   {
  //     url: '/pages/account-settings',
  //     icon: 'tabler-settings',
  //     title: 'Settings',
  //     subtitle: 'Account Settings'
  //   }
  // ]

  // const notifications: NotificationsType[] = [
  //   {
  //     avatarImage: '/images/avatars/8.png',
  //     title: 'Congratulations Flora 🎉',
  //     subtitle: 'Won the monthly bestseller gold badge',
  //     time: '1h ago',
  //     read: false
  //   },
  //   {
  //     title: 'Cecilia Becker',
  //     avatarColor: 'secondary',
  //     subtitle: 'Accepted your connection',
  //     time: '12h ago',
  //     read: false
  //   },
  //   {
  //     avatarImage: '/images/avatars/3.png',
  //     title: 'Bernard Woods',
  //     subtitle: 'You have new message from Bernard Woods',
  //     time: 'May 18, 8:26 AM',
  //     read: true
  //   },
  //   {
  //     avatarIcon: 'tabler-chart-bar',
  //     title: 'Monthly report generated',
  //     subtitle: 'July month financial report is generated',
  //     avatarColor: 'info',
  //     time: 'Apr 24, 10:30 AM',
  //     read: true
  //   }
  // ]

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        <NavSearch />
        {/* Hide Logo on Smaller screens */}
        {/* {!isBreakpointReached && <Logo />} */}
      </div>
      <div className='flex items-center'>
        {/* <LanguageDropdown />
        <ModeDropdown />
        <ShortcutsDropdown shortcuts={shortcuts} />
        <NotificationDropdown notifications={notifications} /> */}
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
