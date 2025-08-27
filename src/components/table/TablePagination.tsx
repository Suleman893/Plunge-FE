//MUI Imports
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

//Assets Imports
import First from '@assets/svgs/pagination/First'
import Last from '@assets/svgs/pagination/Last'
import Previous from '@assets/svgs/pagination/Previous'
import Next from '@assets/svgs/pagination/Next'

//Types Imports
import type { TablePaginationProps } from '@custom-types/components/table'

const TablePagination = (props: TablePaginationProps) => {
  const { totalElements, elementsPerPage, page, setPage } = props

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <span className='text-gray-400 text-sm'>
        {`Showing ${
          totalElements === 0 ? 0 : (page - 1) * elementsPerPage + 1
        } to ${Math.min(page * elementsPerPage, totalElements)} of ${totalElements} entries`}
      </span>

      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={Math.ceil(totalElements / elementsPerPage)}
        page={page}
        onChange={(_, page) => {
          setPage(page)
        }}
        showFirstButton
        showLastButton
        renderItem={item => (
          <PaginationItem
            {...item}
            slots={{
              first: () => <First />,
              last: () => <Last />,
              previous: () => <Previous />,
              next: () => <Next />
            }}
            sx={{
              fontSize: 'text-sm'
            }}
          />
        )}
      />
    </div>
  )
}

export default TablePagination
