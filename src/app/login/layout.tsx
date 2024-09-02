import { Box } from '@mui/material';
import { ReactNode } from 'react';

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return <Box sx={{ flex: '1 1', overflow: 'auto' }}>{children}</Box>;
};
export default LoginLayout;
