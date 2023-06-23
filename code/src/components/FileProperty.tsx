import React from 'react';
import {FC, ChangeEvent, InputHTMLAttributes} from 'react';
import {useField} from 'formik';

interface FilePropertyProps {
  name: string;
  label: string;
  wildcard?: string;
  showFullPath?: boolean;
  initialPath?: string;
  dialogTitle?: string;
}

type Props = InputHTMLAttributes<HTMLInputElement> & {
  type: 'file';
  id: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  webkitdirectory?: string;
};

//TODO webkitdirectory={webkitdirectory} исправить https://stackoverflow.com/questions/63809230/reactjs-directory-selection-dialog-not-working

const FileInput: FC<Props> = ({type, id, onChange, accept, webkitdirectory, ...rest}) => {
  return <input type={type} id={id} onChange={onChange} accept={accept} {...rest} />;
};

export const FileProperty: React.FC<FilePropertyProps> = ({name, label, wildcard, showFullPath, initialPath}) => {
  const [field, , helpers] = useField({name});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      helpers.setValue([file]);
    }
  };

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <FileInput
        type='file'
        id={name}
        onChange={handleFileChange}
        accept={wildcard}
        webkitdirectory={initialPath ? 'true' : undefined}
      />
      {field.value?.[0] && (
        <div>{showFullPath ? field.value?.[0]?.name : field.value?.[0]?.name.split('\\').pop()}</div>
      )}
    </div>
  );
};
