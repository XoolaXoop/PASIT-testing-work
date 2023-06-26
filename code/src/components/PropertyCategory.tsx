import Card from '@mui/material/Card';
import {FormGroup, Typography} from '@mui/material';
import {PropertyType} from '../types';
import {ReactNode} from 'react';

export type PropertyCategoryProps = {
  Class: 'wxPropertyCategory';
  Name: string;
  Label: string;
  Property?: PropertyType[];
  children?: Array<ReactNode>;
};

export function PropertyCategory({Class, Name, Label, children}: PropertyCategoryProps) {
  return (
    <Card sx={{maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px'}}>
      <Typography variant='body1'>{Label}</Typography>
      <FormGroup sx={{display: 'flex', flexDirection: 'column', gap: '20px'}} id={Name} className={Class}>
        {children}
      </FormGroup>
    </Card>
  );
}
