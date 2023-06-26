import {useFormik} from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {useEffect} from 'react';

export type EditEnumPropertyProps = {
  Choices: Record<string, string>;
  Class: 'wxEditEnumProperty';
  Label: string;
  Value: string;
  Name: string;
};

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
          (value) => Object.values(Choices).findIndex((choicesValue) => choicesValue == value) > -1
        )
        .required('Поле обязательно для заполения'),
    }),
  });

  type EditEnumType = {
    label: string;
    value: string;
  };

  useEffect(() => {
    localStorage.setItem(Name, Value);
  }, []);

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
      sx={{width: '100%'}}
      onChange={(_, enumElem) => {
        if (typeof enumElem === 'string') {
          enumElem = {label: 'меткаN', value: enumElem};
        }
        localStorage.setItem(Name, String(enumElem));
        formik.setFieldValue(Name, enumElem);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={formik.dirty && Boolean(formik.errors[Name])}
          helperText={formik.dirty && Boolean(formik.errors[Name])}
          name={Name}
          className={Class}
          label={Label}
        />
      )}
    />
  );
}
