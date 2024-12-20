import AuthForm from '@/components/authForm/AuthForm';
import React from 'react';

export default function SignUp() {
  return (
    // Left section
    <div className="align flex w-full items-center justify-center lg:w-3/4">
      <div>
        <AuthForm type="sign-up" />
      </div>
    </div>
  );
}
