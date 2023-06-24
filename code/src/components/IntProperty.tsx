import {ChangeEvent} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {TextField} from '@mui/material';

export type IntPropertyProps = {
  Name: string;
  Class: string;
  Label: string;
  Value: number;
  InlineHelp: string;
  Units: string;
  maxValue: number;
  minValue: number;
};

//TODO: InlineHelp

export function IntProperty(data: IntPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [data.Name]: data.Value,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [data.Name]: yup
        .number()
        .min(data.minValue)
        .max(data.maxValue)
        .typeError(`Введите число > ${data.minValue} и < ${data.maxValue}`)
        .required('Поле обязательно для заполения'),
    }),
  });
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let valueInt = Number(event.target.value);
    if (isNaN(valueInt)) {
      throw new Error('Не верно введены данные!');
    } else {
      formik.setFieldValue(data.Name, valueInt);
    }
  }

  return (
    <>
      <TextField
        className={data.Class}
        fullWidth
        name={data.Name}
        value={formik.values[data.Name]}
        label={data.Label}
        onChange={handleChange}
        error={formik.dirty && Boolean(formik.errors[data.Name])}
        helperText={(formik.dirty && formik.errors[data.Name]) || data.InlineHelp}
      />
      <span>{data.Units}</span>
    </>
  );
}
