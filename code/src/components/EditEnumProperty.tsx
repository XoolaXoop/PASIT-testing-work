import {useEffect} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import type {NonEmptyObject} from '../types';

type EditEnumPropertyProps = {
  Choices: NonEmptyObject;
  Class: string;
  Label: string;
  Value: string;
  Name: string;
};
//TODO переделать FormValues = {label, value} в FormValues = {value}
export function EditEnumProperty({Value, Label, Class, Choices, Name}: EditEnumPropertyProps) {
  const initialValueLabel =
    Object.keys(Choices)[Object.values(Choices).findIndex((choiceValue) => choiceValue == Value)];
  type FormValues = {
    [Name: string]: {
      label: string;
      value: string;
    };
  };
  const formik = useFormik<FormValues>({
    initialValues: {
      [Name]: {
        label: initialValueLabel,
        value: Value,
      },
    },
    onSubmit: () => {},
    validationSchema: yup.object().shape({
      label: yup.string(),
      value: yup
        .string()
        .test(
          'is Valid',
          'is not Valid',
          (value) => Object.values(Choices).find((choicesValue) => choicesValue == value) > -1
        )
        .required('Поле обязательно для заполения'),
    }),
  });
  type EditEnumType = {
    label: string;
    value: string;
  };
  const defaultProps = {
    options: Object.keys(Choices).map((key) => ({
      label: key,
      value: Choices[key],
    })),
    defaultValue: {label: initialValueLabel, value: Value},

    isOptionEqualToValue: (option: EditEnumType, selected: EditEnumType) => option.value === selected.value,
  };
  return (
    <Autocomplete
      {...defaultProps}
      disablePortal
      id={Name}
      freeSolo
      sx={{width: 300}}
      onChange={(_, enumElem) => {
        if (typeof enumElem === 'string') {
          enumElem = {label: 'меткаN', value: enumElem};
        }
        formik.setFieldValue(Name, enumElem);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={formik.dirty && Boolean(formik.errors[Name])}
          name={Name}
          className={Class}
          label={Label}
        />
      )}
    />
  );
}
//
//TODO helperText={formik.dirty && formik.errors[Name]}
