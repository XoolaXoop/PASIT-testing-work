import {ChangeEvent} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {TextField} from '@mui/material';
import {getNumberFromString} from '../helperFunc';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect} from 'react';

export type IntPropertyProps = {
  Name: string;
  Class: 'wxIntProperty';
  Label: string;
  Value: string;
  InlineHelp: string;
  Units: string;
  Attribute: [
    {Name: 'Max'; text: string},
    {Name: 'Min'; text: string},
    {Name: 'Units'; text: string},
    {Name: 'InlineHelp'; text: string}
  ];
};

export function IntProperty(data: IntPropertyProps) {
  let minValue = getNumberFromString(data.Attribute[1].text);
  let maxValue = getNumberFromString(data.Attribute[0].text);
  let InlineHelp = data.Attribute[2].text;
  let Units = data.Attribute[2].text;

  if (!(minValue && maxValue)) {
    throw new Error('Не верно переданные данные!');
  }

  const formik = useFormik({
    initialValues: {
      [data.Name]: data.Value,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [data.Name]: yup
        .number()
        .min(minValue)
        .max(maxValue)
        .typeError(`Введите число > ${minValue} и < ${maxValue}`)
        .required('Поле обязательно для заполения'),
    }),
  });
  const handleChange = handleChangeDecorator({
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      let valueInt = Number(event.target.value);
      if (isNaN(valueInt)) {
        throw new Error('Не верно введены данные!');
      } else {
        formik.setFieldValue(data.Name, valueInt);
      }
      return String(valueInt);
    },
    fieldName: data.Name,
  });
  useEffect(() => {
    localStorage.setItem(data.Name, data.Value);
  }, []);
  return (
    <TextField
      className={data.Class}
      fullWidth
      placeholder={InlineHelp}
      name={data.Name}
      value={formik.values[data.Name]}
      label={data.Label + ' ' + Units}
      onChange={handleChange}
      error={formik.dirty && Boolean(formik.errors[data.Name])}
      helperText={formik.dirty && formik.errors[data.Name]}
    />
  );
}
