import { PrismaClient } from '@prisma/client';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import prisma from '../lib/prisma';

export type Context = {
    req: MicroRequest;
    prisma: PrismaClient;
};

export async function createContext({ req, res }): Promise<Context> {
    return {
        req,
        prisma,
    };
}