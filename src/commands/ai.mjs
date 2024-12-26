const { pipeline } = await import('@huggingface/transformers');
const { MessageBuilder } = (await import('prismarine-chat')).default('1.20.4');

export default {
    name: 'ai',
    description: 'Ai or smth',
    level: 'public',
    aliases: ['bestai'],
    async execute(context) {
        if (context.client.uuid === context.uuid) return;
        try {
            const generator = await pipeline('text-generation', 'onnx-community/Llama-3.2-1B-Instruct-q4f16', {
                device: 'cpu', // <- Run on WebGPU
            });

            const messages = [
                { role: "system", content: `Information about user username: ${context.username} uuid ${context.uuid}| You are a helpful assistant.` },
                { role: "user", content: "Hello assistant" }
            ];

            const output = await generator(messages, { max_new_tokens: 128 });
            context.client.core.tellraw(
                new MessageBuilder().setTranslate("[%s] %s").addWith(
                    new MessageBuilder().setText("A()I"),
                    new MessageBuilder().setText(output[0].generated_text.at(-1).content)
                ).toJSON()
            );
        } catch (error) {
            context.konsole.error('Error: ' + error);
            context.client.chat('Sorry, something went wrong.');
        }
    },
};