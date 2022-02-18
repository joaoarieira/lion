import { Tooltip } from '@mui/material';

interface IStringLimiterProps {
  limit: number;
  value: string;
}

export function StringLimiter({
  limit,
  value,
}: IStringLimiterProps): JSX.Element {
  return (
    <Tooltip title={value} enterTouchDelay={0}>
      <span>{`${value.slice(0, limit)}${
        value.length > limit ? '...' : ''
      }`}</span>
    </Tooltip>
  );
}
