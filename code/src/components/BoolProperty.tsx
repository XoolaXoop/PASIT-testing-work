import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {handleChangeDecorator} from '../helperFunc';
import {Typography, Box} from '@mui/material';
import {useEffect} from 'react';

export type BoolPropertyProps = {
  Name: string;
  Label: string;
  Value: '0' | '1';
  Class: 'wxBoolProperty';
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
  useEffect(() => {
    localStorage.setItem(data.Name, data.Value);
  }, []);
  const handleChange = handleChangeDecorator({setFieldValue: formik.setFieldValue, fieldName: data.Name});
  return (
    <FormControlLabel
      control={<Checkbox className={data.Class} name={data.Name} defaultChecked value={handleChange} />}
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
