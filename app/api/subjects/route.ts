import prisma from "@/prismaClient/prisma";

export async function GET() {
    const subjects = await prisma.subject.findMany();

    return Response.json({data: subjects});
}