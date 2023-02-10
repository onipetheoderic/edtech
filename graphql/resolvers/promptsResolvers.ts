

export const createPromptResolver = async (_, { content }, { req, prisma }) => {
    await prisma.prompt.deleteMany({ where: {} })
    await prisma.prompt.createMany({
        data: content
    })
    return await prisma.prompt.findMany()
}

export const updatePromptResolver = async (_, { content }, { req, prisma }) => {
    const { id, data } = content;
    console.log(id, data, content, "=====all====")
    //type can either be description or rank or thumbsdown
    const update = await prisma.prompt.update({
        where: {
            id
        },
        data: {
            ...data
        }
    })
    console.log(update, "the update")
    return update
}


// prisma db push --preview-feature //after defininig the model
//prisma studio to visualize the db