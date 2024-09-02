'use client';

import { Box, Card, Tab, Tabs } from '@mui/material';
import { TabPanel } from './TabPanel';
import { SyntheticEvent, useState } from 'react';
import RegistroContainer from './RegistroContainer';
import LoginContainer from './LoginContainer';

const LoginRegistroContainer = () => {
  const [value, setValue] = useState<number>(1);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const a11yProps = (index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });
  return (
    <Card
      sx={{
        borderRadius: 2,
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        margin: 'auto',
        maxWidth: {
          sm: '650px',
        },
        gap: 2,
      }}
    >
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Pestaña inicio de sesión"
          variant={'fullWidth'}
        >
          <Tab
            sx={{ fontWeight: 'medium' }}
            label="Regístrate"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ fontWeight: 'medium' }}
            label="Inicia sesión"
            {...a11yProps(1)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <RegistroContainer />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <LoginContainer />
        </TabPanel>
      </Box>
    </Card>
  );
};
export default LoginRegistroContainer;
