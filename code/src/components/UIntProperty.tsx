import {useFormik} from 'formik';
import {useEffect, ChangeEvent} from 'react';
import * as yup from 'yup';
import {TextField} from '@mui/material';

//TODO: ConditionVisible

export type UIntPropertyProps = {
  Name: string;
  Class: string;
  Label: string;
  Value: string;
  InlineHelp: string;
  ConditionVisible: string;
  Units: string;
  maxValue: string;
  Base: 'PG_BASE_OCT' | 'PG_BASE_DEC' | 'PG_BASE_HEX';
  Prefix: string;
};

export function UIntProperty(data: UIntPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [data.Name]: data.Value,
    },
    validationSchema: yup.object({
      [data.Name]: yup
        .string()
        .matches(/^[0-9A-Fa-f]+$/, 'Не верно введенное значение')
        .required('Поле обязательно для заполнения')
        .test('is-valid', 'Invalid value', (UIntValue) => {
          return (
            (data.Base === 'PG_BASE_OCT' &&
              parseInt(UIntValue, 8) > parseInt('0', 8) &&
              parseInt(UIntValue, 8) < parseInt(data.maxValue, 8) &&
              /^[0-7]+$/.test(UIntValue)) ||
            (data.Base === 'PG_BASE_DEC' &&
              Number(UIntValue) > 0 &&
              Number(UIntValue) < Number(data.maxValue) &&
              /^[0-9]+$/.test(UIntValue)) ||
            (data.Base === 'PG_BASE_HEX' &&
              parseInt(UIntValue, 16) > parseInt('0', 16) &&
              parseInt(UIntValue, 16) < parseInt(data.maxValue, 16) &&
              /^[0-9A-Fa-f]+$/.test(UIntValue))
          );
        }),
    }),
    onSubmit: () => {
      console.log('UIntProperty');
    },
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let eventTargetVal = event.target.value;
    if (data.Base == 'PG_BASE_DEC') {
      let intValue = Number(eventTargetVal);
      if (isNaN(intValue)) {
        throw Error('Не верно введенные данные!');
      } else {
        formik.setFieldValue(data.Name, intValue);
      }
    } else if (data.Base == 'PG_BASE_HEX') {
      let hexValue = parseInt(eventTargetVal, 16);
      formik.setFieldValue(data.Name, hexValue);
    } else if (data.Base == 'PG_BASE_OCT') {
      let octValue = parseInt(eventTargetVal, 8);
      console.log(octValue);
      formik.setFieldValue(data.Name, octValue);
    }
  }

  //TODO: handleChange мой или formik.handleChange
  useEffect(() => {
    console.log(formik);
  });

  return (
    <TextField
      className={data.Class}
      fullWidth
      name={data.Name}
      value={formik.values[data.Name]}
      label={data.Label}
      onChange={formik.handleChange}
      error={formik.dirty && Boolean(formik.errors[data.Name])}
      helperText={(formik.dirty && formik.errors[data.Name]) || data.InlineHelp}
    />
  );
}
