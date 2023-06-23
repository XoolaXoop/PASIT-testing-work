import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useMemo} from 'react';
import {Typography, Box} from '@mui/material';

type BoolPropertyProps = {
  Name: string;
  Label: string;
  Value: '0' | '1';
  Class: string;
};

export function BoolProperty(data: BoolPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [data.Name]: data.Value,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [data.Name]: yup
        .string()
        .required('Поле обязательно для заполнения')
        .test('is-valid', 'Invalid value', (value) => {
          return value == '1' || value == '0';
        }),
    }),
  });

  return (
    <FormControlLabel
      control={<Checkbox className={data.Class} name={data.Name} defaultChecked value={formik.values.BoolNumValue} />}
      label={
        <Box>
          <Typography variant='body1'>{data.Label}</Typography>
          {formik.dirty && Boolean(formik.errors[data.Name]) ? (
            <Typography variant='body1'>{formik.errors[data.Name]}</Typography>
          ) : null}
        </Box>
      }
    />
  );
}
