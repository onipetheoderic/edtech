import { PrismaClient } from "@prisma/client";
import { prompts } from '../data/prompts';

const prisma = new PrismaClient();

async function main() {
    await prisma.prompt.createMany({
        data: prompts
    })
}

main().catch((e) => {
    console.error(e);
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect();
})