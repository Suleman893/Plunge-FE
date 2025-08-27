'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import classnames from 'classnames'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'

// Component Imports
import TableLoader from '@components/loaders/TableLoader'
import TablePagination from './TablePagination'

// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'

//Types Imports
import type { TableProps } from '@custom-types/components/table'

const Table = <TData,>(props: TableProps<TData>) => {
  const {
    isLoading,
    isPaginated = true,
    columns,
    filters,
    data,
    totalElements = 0,
    elementsPerPage = 10,
    page = 1,
    setPage = () => {},
    card
  } = props

  //React table initialization
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    defaultColumn: {
      enableSorting: false
    }
  })

  return (
    <Card>
      {/* Card inside table, just in the dashboard screen table */}
      {card}
      <CardContent className='flex justify-between items-center max-sm:flex-col gap-4'>{filters}</CardContent>
      {isLoading ? (
        <div className='h-[50vh] flex justify-center items-center'>
          <TableLoader />
        </div>
      ) : (
        <>
          <div className='overflow-x-auto'>
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <th key={header.id} className='text-xs text-[#666666]'>
                          {header.isPlaceholder ? null : (
                            <div
                              className={classnames({
                                'flex items-center justify-between': header.column.getIsSorted(),
                                'cursor-pointer select-none': header.column.getCanSort()
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className='flex justify-between items-center '>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                  asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                                  desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                                }[header.column.getIsSorted() as string] ?? null}
                                {/* <div className='px-5'> */}
                                <div className='h-[14px] w-[2px] bg-[#2F2B3D1F] ml-5' />
                                {/* </div> */}
                              </div>
                            </div>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No record found
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map(row => {
                    return (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => {
                          return (
                            <td key={cell.id} className='text-[#323232] text-sm'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              )}
            </table>
          </div>
          {isPaginated && data.length ? (
            <TablePagination
              totalElements={totalElements}
              elementsPerPage={elementsPerPage}
              page={page}
              setPage={setPage}
            />
          ) : null}
        </>
      )}
    </Card>
  )
}

export default Table
