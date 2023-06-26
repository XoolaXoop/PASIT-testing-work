import type {ChangeEvent} from 'react';
import {useFormik} from 'formik';
import {Box, Typography, TextField, Button} from '@mui/material';
import {FC, InputHTMLAttributes} from 'react';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect} from 'react';
import * as yup from 'yup';

export type FilePropertyProps = {
  Attribute: [
    {
      Name: 'ShowFullPath';
      text: string;
    },
    {
      Name: 'DialogTitle';
      text: string;
    },
    {
      Name: 'Wildcard';
      text: string;
    },
    {
      Name: 'InitialPath';
      text: string;
    }
  ];
  Help: string;
  Name: string;
  Label: string;
  Class: 'wxFileProperty';
  Value: string;
};

type Props = InputHTMLAttributes<HTMLInputElement> & {
  type: 'file';
  id: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  webkitdirectory?: string;
};

const FileInput: FC<Props> = ({type, id, onChange, accept, webkitdirectory, ...rest}) => {
  return <input type={type} id={id} onChange={onChange} accept={accept} {...rest} />;
};

function getFileNameFromPath(path: string) {
  const pathSegments = path.split('\\');
  const fileName = pathSegments.pop();
  if (!fileName) {
    return '';
  }
  return fileName;
}
export const FileProperty: React.FC<FilePropertyProps> = ({Name, Label, Attribute, Value, Help}: FilePropertyProps) => {
  let [ShowFullPath, DialogTitle, Wildcard, InitialPath] = Attribute.map((elem) => elem.text);
  const formik = useFormik({
    initialValues: {
      [Name]: Value,
    },
    onSubmit: () => {},
    validationSchema: yup.object({
      [Name]: yup.string().required('Поле обязательно для заполения'),
    }),
  });
  const handleChange = handleChangeDecorator({
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      const filePathString = ShowFullPath == '1' ? event.target.value : getFileNameFromPath(event.target.value);
      formik.setFieldValue(Name, filePathString);
      return filePathString;
    },
    fieldName: Name,
  });
  useEffect(() => {
    localStorage.setItem(Name, InitialPath);
  }, []);
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start'}}>
        <Typography variant='body1' fontSize={18}>
          {Label}
        </Typography>
        <TextField
          fullWidth
          helperText={Help}
          placeholder='d'
          label='Selected File'
          value={formik.values[Name]}
          disabled
        />
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant='body1' fontSize={18}>
          {DialogTitle}
        </Typography>
        <Button variant='contained' component='label'>
          Выбрать файл
          <FileInput
            style={{display: 'none'}}
            type='file'
            id={'file-input-label' + Label}
            onChange={handleChange ? handleChange : formik.handleChange}
            accept={Wildcard}
            webkitdirectory={InitialPath ? 'true' : undefined}
          />
        </Button>
      </Box>
    </Box>
  );
};
