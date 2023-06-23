import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {useMemo} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import type {NonEmptyObject} from '../types';

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

export type MultiChoicePropertyProps = {
  Class: string;
  Name: string;
  Label: string;
  Value: Array<string>;
  Choices: NonEmptyObject;
};

export function MultiChoiceProperty(data: MultiChoicePropertyProps) {
  let {Class, Name, Label, Value, Choices} = data;
  const arrayChoices = useMemo(() => Object.entries(Choices), [Choices]);
  const formik = useFormik({
    initialValues: {
      [Name]: Value,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      choosedValues: yup.array().required('Поле обязательно для заполения'),
    }),
  });
  //TODO как убрать FormControl
  return (
    <div>
      <FormControl sx={{m: 1, width: 300, padding: 0, margin: 0}}>
        <InputLabel id={`${Label}-checkbox`}>{Label}</InputLabel>
        <Select
          labelId={`${Label}-checkbox`}
          className={Class}
          name={Name}
          multiple
          value={formik.values[Name]}
          onChange={formik.handleChange}
          input={<OutlinedInput label='Tag' />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}>
          {arrayChoices.map(([value, key]) => (
            <MenuItem key={key} value={value}>
              <Checkbox checked={formik.values[Name].indexOf(value) > -1} />
              <ListItemText primary={value} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
