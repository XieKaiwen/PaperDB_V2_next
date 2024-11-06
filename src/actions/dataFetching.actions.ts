"use server"
import prisma from "@/utils/prisma-client/client";

// This file is only for fetching data, data mutation should belong in the data mutation folder

// SUBJECTS
export async function getAllSubjects() {
  try {
    const allSubjects = await prisma.subject.findMany();
    return allSubjects;
  } catch (e) {
    console.error(e);
    throw new DataFetchingError();
  }
}

// TOPICS
export async function getAllTopics() {
  try {
    const allTopics = await prisma.topic.findMany();
    return allTopics;
  } catch (e) {
    console.error(e);
    throw new DataFetchingError();
  }
}

// SCHOOLS
export async function getAllSchools(){
  try {
    const allSchools = await prisma.school.findMany();
    return allSchools;
  } catch (e) {
    console.error(e);
    throw new DataFetchingError();
  }
}