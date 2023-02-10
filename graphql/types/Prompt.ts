import { nonNull, objectType, extendType, list, inputObjectType, asNexusMethod } from 'nexus';
import { DateTimeResolver } from 'graphql-scalars'
import { createPromptResolver, updatePromptResolver } from '../resolvers/promptsResolvers';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

//updatePromptResolver

export const PromptObjectType = inputObjectType({
    name: 'PromptObjectType',
    definition(t) {
        t.nonNull.string('title')
        t.nonNull.string('suggestion')
        t.nonNull.boolean('thumbDown')
        t.nonNull.int('rank')
    }
})

export const ObjWithUpdateData = inputObjectType({
    name: 'ObjWithUpdateData',
    definition(t) {
        t.string('suggestion');
        t.boolean('thumbDown');
        t.int('rank');
    },
});

export const UpdatePromptObjectType = inputObjectType({
    name: 'UpdatePromptObjectType',
    definition(t) {
        t.string('id')
        t.field('data', { type: ObjWithUpdateData });
    }
});


export const CreatePrompt = extendType({
    type: "Mutation",
    definition: t => {
        t.list.field("CreatePrompt", {
            type: "Prompt",
            args: { content: nonNull(list(nonNull(PromptObjectType))) },
            resolve: createPromptResolver
        }),
            t.field("UpdatePrompt", {
                type: "Prompt",
                args: { content: UpdatePromptObjectType },
                resolve: updatePromptResolver
            })
    }
})
export const DateTime = asNexusMethod(DateTimeResolver, 'date')
//the return types below
export const Prompt = objectType({
    name: 'Prompt',
    definition(t) {
        t.string('id');
        t.int('rank');
        t.string('title');
        t.string('suggestion');
        t.boolean('thumbDown');
        t.nonNull.field('createdAt', { type: 'DateTime' })
        t.nonNull.field('updatedAt', { type: 'DateTime' })
    },
});


export const PromptsQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('prompts', {
            type: 'Prompt',
            resolve(_parent, _args, ctx) {
                return prisma.prompt.findMany()
            }
        })
    },
});