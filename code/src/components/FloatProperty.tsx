import {ChangeEvent, InputHTMLAttributes} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';

export type FloatPropertyProps = InputHTMLAttributes<HTMLInputElement> & {
  Value: number;
  Name: string;
  Label: string;
  Class: string;
  Precision: number;
  maxValue: number;
  minValue: number;
  Units: string;
  InlineHelp: string;
};

//TODO: inlineHelp

export const FloatProperty = (data: FloatPropertyProps) => {
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let valueFloat = parseFloat(event.target.value);
    if (isNaN(valueFloat)) {
      throw new Error('Не верно введены данные!');
    } else {
      formik.setFieldValue(data.Name, valueFloat);
    }
  };

  return (
    <>
      <input
        type='number'
        value={formik.values[data.Name]}
        max={data.maxValue}
        min={data.minValue}
        step={data.Precision >= 0 ? Math.pow(10, -data.Precision) : undefined}
        onChange={handleChange}
      />
      <span>{data.Units}</span>
    </>
  );
};
