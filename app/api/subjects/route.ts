import prisma from "@/utils/prisma-client/client";

export async function GET() {
    const subjects = await prisma.subject.findMany();

    return Response.json({data: subjects});
}