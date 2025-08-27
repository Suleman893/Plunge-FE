import type { DashboardState } from '@custom-types/features/dashboard'

export const initialState: DashboardState = {
  //Basic Stats
  isBasicStatsLoading: false,
  basicStats: null,

  //Recent Stats
  isRecentStatsLoading: false,
  recentStats: null,

  //Most popular videos
  isPopularVideosLoading: false,
  popularVideos: null
}
