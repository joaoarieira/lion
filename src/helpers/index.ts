export function isUUID(uuid: string | undefined): boolean {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  if (uuid !== undefined) return regexExp.test(uuid);

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
