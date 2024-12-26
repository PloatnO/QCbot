module.exports = {
    name: 'echo',
    description: 'Replies with your input!',
    level: 'public',
    aliases: ['say'],
    execute(context) {
        if (context.client.uuid === context.uuid) return;
        if (!context.message) return
        context.client.chat(context.message);
    },
}