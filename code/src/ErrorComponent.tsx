import {Alert, Button, AlertTitle} from '@mui/material';

export const ErrorComponent = (error: Error) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        right: 0,
        bottom: 0,
      }}>
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        {error.message}
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </Alert>
    </div>
  );
};
