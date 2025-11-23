const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const { OpenAI } = require('openai');

// OpenAI setup
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp bot listo y conectado!');
});

client.on('message', async message => {
    console.log('Mensaje recibido:', message.body);

    // Solo responde si el mensaje no lo envía el propio bot
    if (!message.fromMe) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message.body }]
            });

            const reply = response.choices[0].message.content || 'No tengo respuesta IA';
            await message.reply(reply);
        } catch (e) {
            await message.reply('Error conectando con la IA.');
            console.error(e);
        }
    }
});

client.initialize();
