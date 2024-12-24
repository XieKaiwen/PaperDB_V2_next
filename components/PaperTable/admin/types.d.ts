import { Paper, School, Subject, User } from '@prisma/client';

type AdminPaperDataForTable = Paper & {
  School: School;
  Subject: Subject;
  User: User;
};
