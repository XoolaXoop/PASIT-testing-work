import {ChangeEvent} from 'react';
import {FormikErrors} from 'formik';

type handleChangeTypeFunc = (event: ChangeEvent<HTMLInputElement>) => string;
type setFieldValueTypeFunc = (
  field: string,
  value: any,
  shouldValidate?: boolean | undefined
) =>
  | Promise<void>
  | Promise<
      FormikErrors<{
        [x: string]: string;
      }>
    >;
type handleChangeDecoratorProps = {
  handleChange?: handleChangeTypeFunc;
  setFieldValue?: setFieldValueTypeFunc;
  fieldName: string;
};

const handleChangeDecorator = ({handleChange, setFieldValue, fieldName}: handleChangeDecoratorProps) => {
  if (handleChange) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      let saved2FormikValue = handleChange(event);
      localStorage.setItem(fieldName, saved2FormikValue);
    };
  } else if (setFieldValue) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      let eventTargetValue = event.target.value;
      setFieldValue(fieldName, eventTargetValue);
      localStorage.setItem(fieldName, eventTargetValue);
    };
  }
};
function getNumberFromString(numberStr: string) {
  let arrSymbols = numberStr.split('');
  if (arrSymbols[0] == '-') {
    let arrSymbolsSliced = arrSymbols.slice(1);
    let numberInt = Number(arrSymbolsSliced.join());
    if (!isNaN(numberInt)) {
      return numberInt;
    }
  } else if (!isNaN(Number(numberStr))) {
    return Number(numberStr);
  }
  return null;
}
export {handleChangeDecorator, getNumberFromString};
