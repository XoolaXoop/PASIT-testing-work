import {FC, ChangeEvent, InputHTMLAttributes} from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  value: number;
  max?: number;
  min?: number;
  precision?: number;
  onChange: (value: number) => void;
};

export const FloatProperty: FC<Props> = ({value, max, min, precision = -1, onChange, ...rest}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      if (max !== undefined && newValue > max) {
        newValue = max;
      } else if (min !== undefined && newValue < min) {
        newValue = min;
      }
      if (precision >= 0) {
        newValue = parseFloat(newValue.toFixed(precision));
      }
      onChange(newValue);
    }
  };

  return (
    <input
      type='number'
      value={value}
      max={max}
      min={min}
      step={precision >= 0 ? Math.pow(10, -precision) : undefined}
      onChange={handleChange}
      {...rest}
    />
  );
};
