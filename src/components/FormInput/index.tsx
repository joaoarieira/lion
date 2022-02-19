/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField, StandardTextFieldProps } from '@mui/material';
import { FormikProps } from 'formik';
import { useCallback } from 'react';

interface IFormInput extends StandardTextFieldProps {
  formAttributes: FormikProps<any>;
  name: string;
}

export function FormInput({
  name,
  formAttributes,
  onChange,
  ...textFieldProps
}: IFormInput): JSX.Element {
  const handleChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      formAttributes.setFieldValue(name, value);
    },
    [formAttributes, name]
  );
  return (
    <TextField
      onChange={onChange ? onChange : handleChange}
      value={formAttributes.values[name] ?? ''}
      error={name in formAttributes.errors}
      helperText={formAttributes.errors[name]}
      {...textFieldProps}
    />
  );
}
