type uuid = string;

export interface IUser {
  id: uuid;
  role_id: uuid;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICampus extends ICampusRelations {
  id: uuid;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ICampusRelations {
  programs?: IProgram[];
}

export interface IProgram extends IProgramRelations {
  id: uuid;
  campus_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface IProgramRelations {
  campus?: ICampus;
}

export interface IStudentTutoring extends IStudentTutoringRelations {
  id: uuid;
  professor_id: string | null;
  course_code: string;
  course_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface IStudentTutoringRelations {
  professor?: IUser;
  student_tutoring_tutors?: IUser[];
  student_tutoring_programs?: IStudentTutoringProgram[];
}

export interface IStudentTutoringTutor extends IStudentTutoringTutorRelations {
  id: uuid;
  student_tutoring_id: uuid;
  tutor_id: uuid;
  created_at: string;
  updated_at: string;
}

interface IStudentTutoringTutorRelations {
  student_tutoring?: IStudentTutoring;
  tutor?: IUser;
  class_schedules?: IClassSchedules[];
}

export interface IStudentTutoringProgram
  extends IStudentTutoringProgramRelations {
  id: uuid;
  program_id: uuid;
  student_tutoring_id: string;
  created_at: string;
  updated_at: string;
}

interface IStudentTutoringProgramRelations {
  program?: IProgram;
  student_tutoring?: IStudentTutoring;
}

export interface IClassSchedules extends IClassSchedulesRelations {
  id: uuid;
  student_tutoring_tutor_id: uuid;
  day_of_the_week: number;
  meeting_place: string;
  note: string | null;
  starts_at: string | null;
  ends_at: string | null;
  meeting_url: string | null;
  created_at: string;
  updated_at: string;
}

interface IClassSchedulesRelations {
  student_tutoring_tutor: IStudentTutoringTutor;
}
