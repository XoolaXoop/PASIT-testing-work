import {useFormik} from 'formik';
import * as yup from 'yup';
import {TextField} from '@mui/material';

//**TODO: ConditionVisible? */

type UIntPropertyProps = {
  Name: string;
  Class: string;
  Label: string;
  Value: number;
  InlineHelp: string;
  ConditionVisible: string;
  Units: string;
  maxValue: number;
  Base?: 'wxPG_BASE_OCT' | 'wxPG_BASE_DEC' | 'wxPG_BASE_HEX';
  Prefix?: string;
};

export function UIntProperty(props: UIntPropertyProps) {
  const formik = useFormik({
    initialValues: {
      [props.Name]: props.Value,
    },
    validationSchema: yup.object({
      [props.Name]: yup
        .string()
        .matches(/^[0-9A-Fa-f]+$/, 'Invalid value')
        .required('Поле обязательно для заполнения')
        .test(
          'is-valid',
          'Invalid value',
          (UIntValue) =>
            (props.Base === 'wxPG_BASE_OCT' && /^[0-7]+$/.test(UIntValue)) ||
            (props.Base === 'wxPG_BASE_DEC' && /^[0-9]+$/.test(UIntValue)) ||
            (props.Base === 'wxPG_BASE_HEX' && /^[0-9A-Fa-f]+$/.test(UIntValue))
        ),
    }),
    onSubmit: () => {
      console.log('UIntProperty');
    },
  });
  return (
    <TextField
      className={props.Class}
      fullWidth
      name={props.Name}
      value={formik.values[props.Name]}
      label={props.Label}
      onChange={formik.handleChange}
      error={formik.touched.UIntValue && Boolean(formik.errors.UIntValue)}
      helperText={(formik.touched.UIntValue && formik.errors.UIntValue) || props.InlineHelp}
    />
  );
}
