import {ChangeEvent} from 'react';
import {FormikErrors} from 'formik';

type handleChangeTypeFunc = (event: ChangeEvent<HTMLInputElement>) => any;
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
      return -1 * numberInt;
    }
  } else if (!isNaN(Number(numberStr))) {
    return Number(numberStr);
  }
  return null;
}

function getValueFromOperand(operand: string): any {
  const trimmedOperand = operand.trim();

  if (
    (trimmedOperand.startsWith("'") && trimmedOperand.endsWith("'")) ||
    (trimmedOperand.startsWith('"') && trimmedOperand.endsWith('"'))
  ) {
    return trimmedOperand.slice(1, -1);
  }

  const numericValue = parseFloat(trimmedOperand);
  if (!isNaN(numericValue)) {
    return numericValue;
  }

  return trimmedOperand;
}

function evaluateExpression(expression: string): boolean {
  const validOperators: string[] = ['==', '!=', '<', '<=', '>', '>='];

  const operator = validOperators.find((op) => expression.includes(op));
  if (!operator) {
    throw new Error('Invalid expression. No valid operator found.');
  }

  const [leftOperand, rightOperand] = expression.split(operator);
  const trimmedLeftOperand = leftOperand.trim();
  const trimmedRightOperand = rightOperand.trim();
  const localStorageValue = localStorage.getItem(trimmedLeftOperand);
  if (!localStorageValue) {
    throw new Error(`Property '${trimmedLeftOperand}' does not exist in localstorage.`);
  }

  const leftValue = Number(localStorageValue);
  const rightValue = getValueFromOperand(trimmedRightOperand);
  switch (operator) {
    case '==':
      return leftValue === rightValue;
    case '!=':
      return leftValue !== rightValue;
    case '<':
      return leftValue < rightValue;
    case '<=':
      return leftValue <= rightValue;
    case '>':
      return leftValue > rightValue;
    case '>=':
      return leftValue >= rightValue;
    default:
      throw new Error('Unsupported operator.');
  }
}

export {handleChangeDecorator, getNumberFromString, evaluateExpression};
