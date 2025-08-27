//Types Imports
import { Roles } from '@custom-types/common'

import type { VerticalMenuItemDataType } from '@/types/menuTypes'

// Maps backend module names to corresponding frontend route paths
const moduleNameToHrefMap: Record<string, string> = {
  dashboard: 'dashboard',
  video_management: 'video-management',
  plunge_model: 'plunge-models',
  music_management: 'music-management',
  push_notification: 'push-notifications',
  app_user_management: 'app-user-management',
  settings: 'settings'
}

export const getAllowedMenuItems = (
  menuItems: VerticalMenuItemDataType[],
  userAllowedModules: any = [],
  userTypeRole: Roles | null
) => {
  // Grant full access to Super Admins
  if (userTypeRole === Roles.SuperAdmin) return menuItems

  // Map backend system_module names to their corresponding frontend routes
  const allowedHrefs = userAllowedModules
    .map((allowedModule: any) => moduleNameToHrefMap[allowedModule.name])
    .filter(Boolean)

  if (!allowedHrefs.includes('settings')) {
    allowedHrefs.push('settings')
  }

  // Return only menu items whose href matches an allowed module route
  return menuItems.filter((item: any) => allowedHrefs.includes(item.href.replace('/', '')))
}

export const isAllowedPage = (href: string, userAllowedModules: any[] = [], userTypeRole: Roles | null): boolean => {
  // Grant access to all pages for Super Admins
  if (userTypeRole === Roles.SuperAdmin) return true

  // Map backend module names to their corresponding frontend routes
  const allowedHrefs = userAllowedModules.map(allowedModule => moduleNameToHrefMap[allowedModule.name]).filter(Boolean)

  if (!allowedHrefs.includes('settings')) {
    allowedHrefs.push('settings')
  }

  // Extract the top-level route segment from the current path (e.g., "/dashboard/stats" -> "dashboard")
  const cleanedHref = href.replace(/^\/+/, '').split('/')[0]

  // Check if the cleaned route is among the user's allowed routes
  return allowedHrefs.includes(cleanedHref)
}

export const getModuleHref= (moduleName: string): string => {
  // Check if moduleName exists in the map
  const href = moduleNameToHrefMap[moduleName]

  if (href) {
    return `/${href}`
  } else {
    return '/'
  }
}
