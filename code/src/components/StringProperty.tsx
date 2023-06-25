import {TextField} from '@mui/material';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect} from 'react';

export type StringPropertyProps = {
  Name: string;
  Label: string;
  Class: 'wxStringProperty';
  Value?: string;
  Help?: string;
};

export function StringProperty({Name, Label, Value, Help, Class}: StringPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [Name]: Value,
    },
    onSubmit: () => {
      console.log(formik.values);
    },
    validationSchema: yup.object({
      [Name]: yup.string().required('Поле обязательно для заполения'),
    }),
  });
  const handleChange = handleChangeDecorator({setFieldValue: formik.setFieldValue, fieldName: Name});
  useEffect(() => {
    localStorage.setItem(Name, String(Value));
  }, []);
  return (
    <TextField
      id={Name}
      name={Name}
      className={Class}
      label={Label}
      value={formik.values[Name]}
      onChange={handleChange}
      error={formik.touched.textValue && Boolean(formik.errors.textValue)}
      helperText={(formik.touched.textValue && formik.errors.textValue) || Help}
    />
  );
}
