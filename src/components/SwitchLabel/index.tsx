/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControlLabel,
  Switch,
  FormGroup,
  FormGroupProps,
  FormControlLabelProps,
  SwitchProps,
} from '@mui/material';

interface ISwitchLabelProps extends SwitchProps {
  formGroupProps?: FormGroupProps;
  formControlLabelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
  label?:
    | string
    | number
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function SwitchLabel({
  formGroupProps,
  formControlLabelProps,
  label = '',
  ...switchProps
}: ISwitchLabelProps): JSX.Element {
  return (
    <FormGroup {...formGroupProps}>
      <FormControlLabel
        control={<Switch {...switchProps} />}
        label={label}
        {...formControlLabelProps}
      />
    </FormGroup>
  );
}
