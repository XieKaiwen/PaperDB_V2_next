import prisma from "@/prismaClient/prisma";
import { unstable_cache } from "next/cache";

export const getAllSubjects = unstable_cache(
  async () => {
    return await prisma.subject.findMany();
  },
  ["all-subjects"],
  { revalidate: 3600, tags: ["all-subjects"] }
);
