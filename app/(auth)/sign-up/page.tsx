import AuthForm from '@/components/authForm/AuthForm'
import React from 'react'

export default function SignUp() {
  return (
      // Left section
      <div className='w-full lg:w-3/4 flex align items-center justify-center'>
        <div>
          <AuthForm type='sign-up'/>
        </div>
      </div>

  )
}
