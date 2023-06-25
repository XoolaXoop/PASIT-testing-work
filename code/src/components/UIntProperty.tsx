import {useFormik} from 'formik';
import * as yup from 'yup';
import {TextField} from '@mui/material';
import {handleChangeDecorator} from '../helperFunc';
import { useEffect } from 'react';

export type UIntPropertyProps = {
  Attribute: [
    {Name: 'srgConditionVisible'; text: string},
    {Name: 'Max'; text: string},
    {Name: 'Units'; text: string},
    {Name: 'InlineHelp'; text: string},
    {Name: 'Base'; text: string},
    {Name: 'Prefix'; text: string}
  ];
  Name: string;
  Class: 'wxUIntProperty';
  Label: string;
  Value: string;
  InlineHelp: string;
};
//TODO srgConditionVisible?
//TODO Prefix?
export function UIntProperty(data: UIntPropertyProps) {
  let [srgConditionVisible, maxValue, Units, InlineHelp, Base, Prefix] = data.Attribute.map((elem) => elem.text);
  const formik = useFormik({
    initialValues: {
      [data.Name]: data.Value,
    },
    validationSchema: yup.object({
      [data.Name]: yup
        .string()
        .matches(/^[0-9A-Fa-f]+$/, 'Не верно введенное значение')
        .required('Поле обязательно для заполнения')
        .test('Верно', 'Не верно введенное значение!!', (value) => {
          let parsedValue = 0;
          let parsedMaxValue = 0;
          if (Base === 'PG_BASE_OCT') {
            parsedValue = parseInt(value, 8);
            parsedMaxValue = parseInt(maxValue, 8);
          } else if (Base === 'PG_BASE_DEC') {
            parsedValue = parseInt(maxValue, 10);
            parsedMaxValue = parseInt(maxValue, 10);
          } else if (Base === 'PG_BASE_HEX') {
            parsedValue = parseInt(value, 16);
            parsedMaxValue = parseInt(maxValue, 16);
          }
          if (!parsedValue) {
            return false;
          } else {
            if (parsedValue < parsedMaxValue) {
              return true;
            }
            return false;
          }
        }),
    }),
    onSubmit: () => {
      console.log('UIntProperty');
    },
  });

  //TODO: setField или handleChange ниже
  // function handleChange(event: ChangeEvent<HTMLInputElement>) {
  //   let eventTargetVal = event.target.value;
  //   if (data.Base == 'PG_BASE_DEC') {
  //     let intValue = Number(eventTargetVal);
  //     if (isNaN(intValue)) {
  //       throw Error('Не верно введенные данные!');
  //     } else {
  //       formik.setFieldValue(data.Name, intValue);
  //     }
  //   } else if (data.Base == 'PG_BASE_HEX') {
  //     let hexValue = parseInt(eventTargetVal, 16);
  //     formik.setFieldValue(data.Name, hexValue);
  //   } else if (data.Base == 'PG_BASE_OCT') {
  //     let octValue = parseInt(eventTargetVal, 8);
  //     console.log(octValue);
  //     formik.setFieldValue(data.Name, octValue);
  //   }
  // }
  const handleChange = handleChangeDecorator({setFieldValue: formik.setFieldValue, fieldName: data.Name});
  useEffect(() => {
    localStorage.setItem(data.Name, data.Value);
  },[]);
  return (
    <TextField
      placeholder={InlineHelp}
      className={data.Class}
      fullWidth
      name={data.Name}
      value={formik.values[data.Name]}
      label={data.Label + ' ' + Units}
      onChange={handleChange}
      error={formik.dirty && Boolean(formik.errors[data.Name])}
      helperText={data.InlineHelp}
    />
  );
}
