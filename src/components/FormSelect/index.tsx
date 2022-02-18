/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { FormikProps } from 'formik';
import { useCallback, useMemo } from 'react';

interface IFormSelect extends SelectProps {
  formAttributes: FormikProps<any>;
  name: string;
}

export function FormSelect({
  name,
  formAttributes,
  onChange,
  label,
  ...selectProps
}: IFormSelect): JSX.Element {
  const handleChange = useCallback(
    ({ target: { value } }: SelectChangeEvent<any>) => {
      formAttributes.setFieldValue(name, value);
    },
    [formAttributes, name]
  );

  const isErroed = useMemo(
    () => name in formAttributes.errors,
    [formAttributes.errors, name]
  );
  return (
    <FormControl fullWidth>
      <InputLabel error={isErroed}>{label}</InputLabel>
      <Select
        onChange={onChange ? onChange : handleChange}
        label={label}
        value={formAttributes.values[name]}
        error={isErroed}
        defaultValue=""
        {...selectProps}
      />
      <FormHelperText error={isErroed}>
        {formAttributes.errors[name]}
      </FormHelperText>
    </FormControl>
  );
}
