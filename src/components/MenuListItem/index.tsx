import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { grey } from '@mui/material/colors';

export interface IItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

interface IMenuListItemProps {
  item: IItem;
  handleNavigate: (to: string) => void;
}

export function MenuListItem({
  item,
  handleNavigate,
}: IMenuListItemProps): JSX.Element {
  return (
    <ListItemButton
      key={item.text}
      onClick={() => handleNavigate(item.path)}
      style={{
        borderRight: '4px solid',
        borderColor:
          location.pathname === item.path ? grey[700] : 'transparent',
      }}
    >
      <ListItemIcon style={{ minWidth: '2.25rem' }}>{item.icon}</ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ fontSize: '18px' }}
        primary={item.text}
      />
    </ListItemButton>
  );
}

export default MenuListItem;
