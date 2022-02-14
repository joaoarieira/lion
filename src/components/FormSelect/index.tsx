/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormHelperText,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { FormikProps } from 'formik';
import { useCallback } from 'react';

interface IFormSelect extends SelectProps {
  formAttributes: FormikProps<any>;
  name: string;
}

export function FormSelect({
  name,
  formAttributes,
  onChange,
  ...selectProps
}: IFormSelect): JSX.Element {
  const handleChange = useCallback(
    ({ target: { value } }: SelectChangeEvent<any>) => {
      formAttributes.setFieldValue(name, value);
    },
    [formAttributes, name]
  );
  return (
    <span>
      <Select
        onChange={onChange ? onChange : handleChange}
        value={formAttributes.values[name]}
        error={name in formAttributes.errors}
        {...selectProps}
      />
      <FormHelperText>{formAttributes.errors[name]}</FormHelperText>
    </span>
  );
}
