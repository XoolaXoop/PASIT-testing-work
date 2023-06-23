import React from 'react';
import Card from '@mui/material/Card';
import {FormGroup, Typography} from '@mui/material';

type PropertyCategoryProps = {
  Class: string;
  Name: string;
  Label: string;
  children?: React.ReactNode;
};

export function PropertyCategory(data: PropertyCategoryProps) {
  let {Class, Name, Label, children} = data;
  return (
    <Card sx={{maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px'}}>
      <Typography variant='body1'>{Label}</Typography>
      <FormGroup sx={{display: 'flex', flexDirection: 'column', gap: '20px'}} id={Name} className={Class}>
        {children}
      </FormGroup>
    </Card>
  );
}
