import React from 'react';
import {Field, useFormik} from 'formik';
import {TextField, Paper, InputLabel, FormControl, Typography} from '@mui/material';
import {FC, ChangeEvent, InputHTMLAttributes} from 'react';
interface FilePropertyProps {
  Name: string;
  Label: string;
  Wildcard: string;
  ShowFullPath: string;
  InitialPath: string;
  DialogTitle: string;
}

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filePath = event.target;
    console.log('filePath', filePath.value);
    const filePathString = ShowFullPath == '1' ? filePath.value : filePath.value.split('\\').pop();

    if (filePath) {
      formik.setFieldValue(Name, filePathString);
    }
  };

  return (
    <FormControl sx={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
      <label htmlFor={Label + Name}>{Label}</label>
      <FileInput
        type='file'
        id={Name}
        onChange={handleFileChange}
        accept={Wildcard}
        webkitdirectory={InitialPath ? 'true' : undefined}
      />
      <Typography sx={{height: '20px', width: '100%'}}>{formik.values[Name]}</Typography>
    </FormControl>
  );
};
