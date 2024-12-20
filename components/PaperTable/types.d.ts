import { Paper, School, Subject, User } from "@prisma/client";

type PaperDataForTable = Paper & {
    School: School;
    Subject: Subject;
    User: User;
}

