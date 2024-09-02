'use client';
import LoginRegistroContainer from '@/components/app/login/LoginRegistroContainer';
import { Stack } from '@mui/material';

const LoginPage = () => {
  return (
    <Stack
      height={'100%'}
      padding={20}
      direction={'column'}
      justifyContent={'space-between'}
    >
      <LoginRegistroContainer />
    </Stack>
  );
};
export default LoginPage;
