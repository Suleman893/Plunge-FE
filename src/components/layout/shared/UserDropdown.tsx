'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'
import Skeleton from 'react-loading-skeleton'

//Hooks Imports
import { useSettings } from '@core/hooks/useSettings'

//Redux import
import { logout } from '@features/auth/thunk'
import type { RootState } from '@features/store'
import { resetStore } from '@features/resetStore'

//Utils And Helper Imports
import { capitalizeFirst, getFullName, getInitials } from '@utils/common'
import { snakeToPascalConverter } from '@helpers/common'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  const { userInfo, isInfoLoading } = useSelector((state: RootState) => state.user)

  // States
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch()

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    setOpen(false)
    dispatch(logout() as any)
    dispatch(resetStore())
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        {isInfoLoading ? (
          <Skeleton
            width={38}
            height={38}
            circle
            baseColor='#d1d1d1'
            highlightColor='#f5f5f5'
            duration={0.5}
            className='bs-[38px] is-[38px]'
          />
        ) : (
          <Avatar
            ref={anchorRef}
            alt={userInfo?.firstName || 'user'}
            src={userInfo?.photo || undefined}
            onClick={handleDropdownOpen}
            className='cursor-pointer bs-[38px] is-[38px]'
          >
            {!userInfo?.photo && getInitials(userInfo?.firstName, userInfo?.lastName)}
          </Avatar>
        )}
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {getFullName(capitalizeFirst(String(userInfo?.firstName)), userInfo?.lastName)}
                      </Typography>
                      <Typography variant='caption'>
                        {userInfo?.userType && snakeToPascalConverter(userInfo?.userType)}
                      </Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem
                    className='mli-2 gap-3'
                    onClick={e => {
                      router.push('/settings')
                      handleDropdownClose(e)
                    }}
                  >
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem>
                  <Divider className='mlb-1' />
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
