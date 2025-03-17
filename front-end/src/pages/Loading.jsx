import { LoaderCircle } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <LoaderCircle className='animate-spin' size={100} />
    </div>
  )
}

export default Loading