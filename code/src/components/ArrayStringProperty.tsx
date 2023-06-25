import {useFormik} from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect} from 'react';

export type ArrayStringPropertyProps = {
  Attribute: {Name: 'Delimiter'; text: string};
  Class: 'wxArrayStringProperty';
  Label: string;
  Value: string;
  Name: string;
};

export function ArrayStringProperty(data: ArrayStringPropertyProps) {
  let {
    Value,
    Name,
    Label,
    Class,
    Attribute: {text: Delimiter},
  } = data;

  const formik = useFormik({
    initialValues: {
      [Name]: Value,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [Name]: yup
        .string()
        .matches(
          new RegExp(`^([a-zA-Z]+${Delimiter}\\s){1,}\\w+$`),
          'Строка должна содержать только буквы, пробелы и запятые'
        )
        .required('Поле обязательно для заполения'),
    }),
  });
  useEffect(() => {
    localStorage.setItem(Name, Value);
  }, []);
  const handleChange = handleChangeDecorator({
    setFieldValue: formik.setFieldValue,
    fieldName: Name,
  });

  return (
    <TextField
      name={Name}
      error={formik.dirty && Boolean(formik.errors[Name])}
      helperText={formik.dirty && formik.errors[Name]}
      className={Class}
      fullWidth
      value={formik.values[Name]}
      label={Label}
      onChange={handleChange}></TextField>
  );
}
