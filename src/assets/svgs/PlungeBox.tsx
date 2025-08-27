type PlungeBoxProps = {
  color: string
}

const PlungeBox = ({ color }: PlungeBoxProps) => {
  return (
    <svg width='20' height='22' viewBox='0 0 20 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M8.8453 1.47782C9.40883 1.15927 9.6906 1 10 1C10.3094 1 10.5912 1.15927 11.1547 1.47782L17.8453 5.25983C18.4088 5.57838 18.6906 5.73766 18.8453 6C19 6.26234 19 6.58089 19 7.21799V14.782C19 15.4191 19 15.7377 18.8453 16C18.6906 16.2623 18.4088 16.4216 17.8453 16.7402L11.1547 20.5222C10.5912 20.8407 10.3094 21 10 21C9.6906 21 9.40883 20.8407 8.8453 20.5222L2.1547 16.7402C1.59117 16.4216 1.3094 16.2623 1.1547 16C1 15.7377 1 15.4191 1 14.782V7.21799C1 6.58089 1 6.26234 1.1547 6C1.3094 5.73766 1.59117 5.57838 2.1547 5.25983L8.8453 1.47782Z'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.5 3.27051L11.134 4.55062C10.5803 4.85019 10.3035 4.99998 10 4.99998C9.6965 4.99998 9.41965 4.85019 8.86597 4.55062L6.5 3.27051'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 10.6154V21M10 10.6154L18.5 6M10 10.6154L1.5 6'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M1 11L3.89443 12.5585C4.43234 12.8482 4.7013 12.993 4.85065 13.2532C5 13.5135 5 13.8373 5 14.485V18'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19 11L16.1056 12.5585C15.5677 12.8482 15.2987 12.993 15.1493 13.2532C15 13.5135 15 13.8373 15 14.485V18'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default PlungeBox
