import type {ChangeEvent} from 'react';
import {useFormik} from 'formik';
import {FormControl, Typography} from '@mui/material';
import {FC, InputHTMLAttributes} from 'react';
import {handleChangeDecorator} from '../helperFunc';
import {useEffect} from 'react';

export type FilePropertyProps = {
  Name: string;
  Label: string;
  Wildcard: string;
  ShowFullPath: string;
  Class: 'wxFileProperty';
  InitialPath: string;
  DialogTitle: string;
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

//TODO webkitdirectory={webkitdirectory} исправить https://stackoverflow.com/questions/63809230/reactjs-directory-selection-dialog-not-working

export const FileProperty: React.FC<FilePropertyProps> = (data: FilePropertyProps) => {
  let {Name, Label, Wildcard, ShowFullPath, InitialPath} = data;
  const formik = useFormik({
    initialValues: {
      [Name]: '',
    },
    onSubmit: () => {},
  });
  const handleChange = handleChangeDecorator({
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      const filePathString = ShowFullPath == '1' ? event.target.value : event.target.value.split('\\')[1];
      formik.setFieldValue(Name, filePathString);
      return filePathString;
    },
    fieldName: Name,
  });
  useEffect(() => {
    localStorage.setItem(Name, InitialPath);
  }, []);
  return (
    <FormControl sx={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
      <label htmlFor={Label + Name}>{Label}</label>
      <FileInput
        type='file'
        id={Name}
        onChange={handleChange ? handleChange : formik.handleChange}
        accept={Wildcard}
        webkitdirectory={InitialPath ? 'true' : undefined}
      />
      <Typography sx={{height: '20px', width: '100%'}}>{formik.values[Name]}</Typography>
    </FormControl>
  );
};
