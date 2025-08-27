'use client'

//React Imports
import { useState, useEffect } from 'react'

//MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

//Third Party Imports
import type { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import Skeleton from 'react-loading-skeleton'

//Custom Types Imports
import type { MonthlyReportProps } from '@custom-types/components/cards'

//Helpers and Utils Imports
import { formatPrevMonthPercentage } from '@helpers/common'

//Styles Component Imports
import AppReactApexCharts from '@libs/styles/AppReactApexCharts'

const MonthlyReport = (props: MonthlyReportProps) => {
  const { isLoading, data } = props

  //States
  const [last7Months, setLast7Months] = useState<any>([])
  const [yearlyStats, setYearlyStats] = useState<any>([0, 0, 0, 0, 0, 0, 0])

  useEffect(() => {
    const last7Month = Array.from({ length: 7 }).map(
      (_, index) =>
        dayjs()
          .subtract(6 - index, 'month')
          .format('MMM')[0]
    )

    setLast7Months(last7Month)
  }, [])

  useEffect(() => {
    setYearlyStats(data?.last7MonthUsers)
  }, [data?.last7MonthUsers])

  //Vars
  const primaryColorWithOpacity = 'var(--mui-palette-primary-lightOpacity)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    grid: {
      show: false,
      padding: {
        top: -31,
        left: 0,
        right: 0,
        bottom: -9
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        columnWidth: '42%'
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      'var(--mui-palette-primary-main)'
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: last7Months,
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      },
      labels: {
        style: {
          fontSize: '13px',
          colors: 'var(--mui-palette-text-disabled)'
        }
      }
    },
    yaxis: {
      show: false
    }
  }

  return (
    <Card>
      <CardHeader title='New Users This Month' className='pbe-0 text-lg' />
      <CardContent className='flex flex-col gap-5 max-md:gap-5 max-[1015px]:gap-[62px] max-[1051px]:gap-10 max-[1200px]:gap-5 max-[1310px]:gap-10'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col gap-3 w-1/2'>
            <div className='flex items-center gap-2.5'>
              {isLoading ? (
                <Skeleton height={50} width={100} />
              ) : (
                <>
                  <Typography variant='h2' className='text-[44px]'>
                    {data?.newUsersThisMonth || 0}
                  </Typography>
                  <Chip
                    size='small'
                    variant='tonal'
                    color='success'
                    label={formatPrevMonthPercentage(data?.prevMonthUsersPercentage)}
                  />
                </>
              )}
            </div>
            <Typography variant='body2' className='text-balance text-xs'>
              The percentage show data based on the previous month sign ups
            </Typography>
          </div>
          <div className='w-1/2'>
            {isLoading ? (
              <Skeleton height={161} />
            ) : (
              <AppReactApexCharts
                type='bar'
                height={163}
                width='100%'
                series={[{ data: yearlyStats || [0, 0, 0, 0, 0, 0, 0] }]}
                options={options}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonthlyReport
