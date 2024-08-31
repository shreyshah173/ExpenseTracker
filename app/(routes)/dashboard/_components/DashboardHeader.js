import { UserButton } from '@clerk/nextjs'
import React from 'react'

const DashboardHeader = () => {
  return (
    <div className='p-5 border shadow-sm flex justify-between'>
      <div>
        Searchbar
      </div>
      <div>
        <UserButton/>
      </div>
    </div>
  )
}

export default DashboardHeader
