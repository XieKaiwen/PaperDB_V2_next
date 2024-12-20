import AuthForm from '@/components/authForm/AuthForm';
import React from 'react';

export default function Login() {
  return (
    <div className="align flex w-full items-center justify-center lg:w-3/5">
      <div>
        <AuthForm type="login" />
      </div>
    </div>
  );
}
