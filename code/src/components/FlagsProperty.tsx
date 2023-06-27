import {useMemo} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {useEffect} from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export type FlagsPropertyProps = {
  Choices: Record<string, string>;
  Class: 'wxFlagsProperty';
  Label: string;
  Value: Array<string>;
  Name: string;
};

export function FlagsProperty({Value, Label, Class, Choices, Name}: FlagsPropertyProps) {
  const arrayKeyValueChoices = useMemo(() => Object.entries(Choices), [Choices]);

  const initialValue = useMemo(() => {
    return arrayKeyValueChoices.filter(([key]) => Value.includes(key)).map(([_, value]) => value);
  }, [Choices, Value]);

  const formik = useFormik({
    initialValues: {
      [Name]: initialValue,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [Name]: yup.object().required('Поле обязательно для заполения'),
    }),
  });

  const handleChange = (event: SelectChangeEvent<Array<string>>) => {
    const {
      target: {value},
    } = event;
    formik.setFieldValue(Name, typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    const flagValues = formik.values[Name];
    const flagKeys = arrayKeyValueChoices.filter(([_, value]) => flagValues.includes(value)).map(([key]) => key);
    const newValue = flagKeys.join(', ');
    localStorage.setItem(Name, newValue);
  }, [formik.values[Name]]);

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id='demo-multiple-name-label'>{Label}</InputLabel>
        <Select
          labelId='demo-multiple-name-label'
          className={Class}
          id='demo-multiple-name'
          multiple
          value={formik.values[Name]}
          onChange={handleChange}
          input={<OutlinedInput label='Name' />}
          MenuProps={MenuProps}>
          {arrayKeyValueChoices.map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
