"use server"
import prisma from "@/utils/prisma-client/client";
import { DataFetchingError } from "../custom-errors/errors";

// This file is only for fetching data, data mutation should belong in the data mutation folder

// SUBJECTS
export async function getAllSubjects() {
  try {
    const allSubjects = await prisma.subject.findMany();
    return allSubjects;
  } catch (e) {
    console.error(e);
    throw new DataFetchingError("An error occurred while fetching all subjects");
  }
}

// TOPICS
export async function getAllTopics() {
  try {
    const allTopics = await prisma.topic.findMany();
    return allTopics;
  } catch (e) {
    console.error(e);
    throw new DataFetchingError("An error occurred while fetching all topics");
  }
}

// SCHOOLS
export async function getAllSchools(){
  try {
    const allSchools = await prisma.school.findMany();
    return allSchools;
  } catch (e) {
    console.error(e);
    throw new DataFetchingError("An error occurred while fetching all schools");
  }
}