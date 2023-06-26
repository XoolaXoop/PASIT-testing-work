import {useFormik} from 'formik';
import * as yup from 'yup';
import {TextField} from '@mui/material';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect, useState} from 'react';
import {evaluateExpression} from '../helperFunc';

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

export function UIntProperty(data: UIntPropertyProps) {
  let [srgConditionVisible, maxValue, Units, InlineHelp, Base, Prefix] = data.Attribute.map((elem) => elem.text);
  let [isVisible, setIsVisible] = useState(false);

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
          if (!value) {
            return false;
          }
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

  const handleChange = handleChangeDecorator({setFieldValue: formik.setFieldValue, fieldName: data.Name});

  const formatValue = (value: string) => {
    if (Prefix === 'PG_PREFIX_NONE') {
      return value;
    } else if (Prefix === 'PG_PREFIX_0x' && !value.startsWith('0x')) {
      return `0x${value}`;
    } else {
      return value;
    }
  };

  useEffect(() => {
    let conditionVisibleRes = evaluateExpression(srgConditionVisible);
    console.log(conditionVisibleRes, 'conditionVisibleRes');
    setIsVisible(conditionVisibleRes);
  });

  return (
    <>
      {isVisible ? (
        <TextField
          placeholder={InlineHelp}
          className={data.Class}
          fullWidth
          type='text'
          name={data.Name}
          value={formatValue(formik.values[data.Name])}
          label={data.Label + ' ' + Units}
          onChange={handleChange}
          error={formik.dirty && Boolean(formik.errors[data.Name])}
          helperText={data.InlineHelp}
        />
      ) : null}
    </>
  );
}
