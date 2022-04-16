"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const controller_1 = require("./controller");
const processRegistration_1 = require("./processRegistration");
const token = process.env.DISCORD_TOKEN;
const client = new discord_js_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
});
client.once('ready', () => {
    console.log('Melter ready!');
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const { commandName, options, user } = interaction;
    if (commandName === 'start') {
        (0, controller_1.playRound)();
        interaction.reply({
            content: 'Game started',
            ephemeral: true,
        });
    }
    if (commandName === 'register') {
        const { _hoistedOptions: [address, assetId], } = options;
        const { status } = yield (0, processRegistration_1.processRegistration)(user, address, assetId);
        interaction.reply({
            content: status,
            ephemeral: true,
        });
    }
}));
client.login(token);
