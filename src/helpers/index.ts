import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function isUUID(uuid: string | undefined | null): boolean {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  if (uuid) return regexExp.test(uuid);

  return false;
}

export function dayNumberToString(number: number): string {
  switch (number) {
    case 0:
      return 'domingo';
    case 1:
      return 'segunda-feira';
    case 2:
      return 'terça-feira';
    case 3:
      return 'quarta-feira';
    case 4:
      return 'quinta-feira';
    case 5:
      return 'sexta-feira';
    case 6:
      return 'sábado';
    default:
      break;
  }
  return '';
}

export function removeSeconds(time: string | undefined | null): string {
  if (time) {
    return time.slice(0, 5);
  }
  return '';
}

export const daysOfTheWeekOptions = [
  { value: 0, name: 'Domingo' },
  { value: 1, name: 'Segunda-feira' },
  { value: 2, name: 'Terça-feira' },
  { value: 3, name: 'Quarta-feira' },
  { value: 4, name: 'Quinta-feira' },
  { value: 5, name: 'Sexta-feira' },
  { value: 6, name: 'Sábado' },
];

export const roleNames = {
  admin: 'admin',
  professor: 'professor',
  student_tutor: 'student_tutor',
};

export function translateRole(
  name: string | undefined,
  lowerCase = false
): string {
  switch (name) {
    case roleNames.admin:
      return lowerCase ? 'administrador' : 'Administrador';
    case roleNames.professor:
      return lowerCase ? 'professor' : 'Professor';
    case roleNames.student_tutor:
      return lowerCase ? 'monitor' : 'Monitor';
    default:
      break;
  }
  return '';
}

export function formatTime(time: string | undefined): string {
  if (time) return format(parseISO(time), 'HH:mm', { locale: ptBR });
  return '';
}

export function formatDateTime(datetime: string | undefined): string {
  if (datetime)
    return format(parseISO(datetime), 'dd/MM/yyyy - HH:mm', { locale: ptBR });
  return '';
}
