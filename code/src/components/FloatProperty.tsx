import {ChangeEvent, InputHTMLAttributes} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect} from 'react';
import {TextField} from '@mui/material';
import {getNumberFromString} from '../helperFunc';
import {ErrorComponent} from '../ErrorComponent';
export type FloatPropertyProps = InputHTMLAttributes<HTMLInputElement> & {
  Value: number;
  Name: string;
  Label: string;
  Class: 'wxFloatProperty';
  Attribute: [
    {
      Name: 'Max';
      text: string;
    },
    {
      Name: 'Min';
      text: string;
    },
    {
      Name: 'Units';
      text: string;
    },
    {
      Name: 'InlineHelp';
      text: string;
    },
    {
      Name: 'Precision';
      text: string;
    }
  ];
};

export const FloatProperty = ({Value, Name, Label, Class, Attribute}: FloatPropertyProps) => {
  try {
    let [maxValueString, minValueString, Units, InlineHelp, PrecisionString] = Attribute.map((elem) => elem.text);
    let [maxValue, minValue] = [maxValueString, minValueString].map((elem) => {
      let intValue = getNumberFromString(elem);
      if (!intValue) {
        throw Error('FloatProperty - invalid data');
      }
      return intValue;
    });

    let stepValue;
    if (PrecisionString && !isNaN(parseFloat(PrecisionString))) {
      const precision = parseFloat(PrecisionString);
      stepValue = Math.pow(10, -precision).toString();
    } else {
      stepValue = '1';
    }

    const formik = useFormik({
      initialValues: {
        [Name]: Value,
      },
      onSubmit: () => {},
      validationSchema: yup.object({
        [Name]: yup.number().max(maxValue).min(minValue).required('Поле обязательно для заполения'),
      }),
    });

    const handleChange = handleChangeDecorator({
      handleChange: (event: ChangeEvent<HTMLInputElement>) => {
        let valueFloat = parseFloat(event.target.value);
        if (isNaN(valueFloat)) {
          throw new Error('Не верно введены данные!');
        } else {
          formik.setFieldValue(Name, valueFloat);
        }
        return String(valueFloat);
      },
      fieldName: Name,
    });
    useEffect(() => {
      localStorage.setItem(Name, String(Value));
    }, []);
    return (
      <TextField
        type='number'
        className={Class}
        fullWidth
        placeholder={InlineHelp}
        name={Name}
        inputProps={{
          step: stepValue,
        }}
        value={formik.values[Name]}
        label={Label + ' ' + Units}
        onChange={handleChange}
        error={formik.dirty && Boolean(formik.errors[Name])}
        helperText={formik.dirty && formik.errors[Name]}
      />
    );
  } catch (error) {
    return ErrorComponent(error as Error);
  }
};
