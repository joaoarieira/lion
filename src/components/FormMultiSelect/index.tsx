/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Checkbox,
  TextField,
  Autocomplete,
  AutocompleteProps,
  FormHelperText,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { FormikProps } from 'formik';
import { useCallback, useMemo } from 'react';

interface IOption {
  id: string;
  name: string;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface IFormMultiSelect
  extends Omit<
    AutocompleteProps<
      any,
      boolean | undefined,
      boolean | undefined,
      boolean | undefined,
      any
    >,
    'renderInput' | 'options' | 'placeholder' | 'label' | 'onChange'
  > {
  formAttributes: FormikProps<any>;
  name: string;
  label: string;
  options: IOption[];
  placeholder?: string;
}

export default function FormMultiSelect({
  formAttributes,
  name,
  options,
  label,
  placeholder,
  ...autoCompleteProps
}: IFormMultiSelect): JSX.Element {
  const handleChange = useCallback(
    (_, value: IOption) => {
      formAttributes.setFieldValue(name, value);
    },
    [formAttributes, name]
  );

  const isErroed = useMemo(
    () => name in formAttributes.errors,
    [formAttributes.errors, name]
  );

  return (
    <>
      <Autocomplete
        multiple
        options={options}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={isErroed}
          />
        )}
        onChange={handleChange}
        {...autoCompleteProps}
      />
      <FormHelperText sx={{ p: '3px 14px 0' }} error={isErroed}>
        {formAttributes.errors[name]}
      </FormHelperText>
    </>
  );
}
