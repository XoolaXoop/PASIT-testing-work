import React, {useState} from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';
import {FieldMetaProps, FieldInputProps} from 'formik';
Modal.setAppElement('#root'); // устанавливаем корневой элемент для модального окна

interface DirPropertyProps {
  onDirectorySelected: (directory: string) => void; // колбэк для передачи выбранной папки
}

export const DirProperty: React.FC<DirPropertyProps> = ({onDirectorySelected}) => {
  const [isOpen, setIsOpen] = useState(false);

  const initialValues = {
    directory: '', // значение выбранной папки
  };

  const validationSchema = Yup.object().shape({
    directory: Yup.string().required('Выберите папку'),
  });

  const handleSubmit = (
    values: typeof initialValues,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
  ) => {
    // обработка отправки формы
    console.log(values.directory);
    onDirectorySelected(values.directory); // передаем выбранную папку через колбэк
    setSubmitting(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button onClick={handleOpenModal}>Выбрать папку</button>
      <Modal isOpen={isOpen} onRequestClose={handleCancel}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({isSubmitting}) => (
            <Form>
              <h2>Выберите папку</h2>
              <Field name='directory'>
                {({field, meta}: {field: FieldInputProps<string>; meta: FieldMetaProps<string>}) => (
                  <div>
                    <input type='text' {...field} placeholder='Выберите папку' />
                    {meta.touched && meta.error && <div style={{color: 'red'}}>{meta.error}</div>}
                  </div>
                )}
              </Field>
              <div>
                <button type='button' onClick={handleCancel}>
                  Отмена
                </button>
                <button type='submit' disabled={isSubmitting}>
                  Сохранить
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
