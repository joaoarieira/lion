import { styled } from '@mui/material';
import { ReactNode } from 'react';

interface ILayoutProps {
  children: ReactNode;
}

const LayoutComponent = styled('div')({ background: '#f9f9f9', width: '100%' });

export const Layout = ({ children }: ILayoutProps): JSX.Element => {
  return <LayoutComponent>{children}</LayoutComponent>;
};
