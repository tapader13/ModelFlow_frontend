'use client';

import { signIn } from 'next-auth/react';

// import { signIn } from '../auth';

// import { socialSignIn } from '@/lib/auth-action';
// import { authClient } from '@/lib/auth-client';

const LoginPage = () => {
  // const handleOAuthSignIn = async (provider: 'google') => {
  //   await socialSignIn(provider);
  // };
  return (
    <div className='flex h-screen items-center justify-center'>
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className='px-6 py-3 cursor-pointer rounded bg-linear-to-r from-black bg-blue-600 text-white'
      >
        Continue with Google
      </button>
    </div>
  );
};

export default LoginPage;
