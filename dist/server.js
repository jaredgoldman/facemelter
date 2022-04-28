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
const mockdata_1 = require("./mockdata");
const processRegistration_1 = require("./processRegistration");
const utils_1 = require("./utils");
const database_1 = require("./database");
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
        yield (0, controller_1.playRound)(interaction);
    }
    if (commandName === 'register') {
        const { _hoistedOptions: [address, assetId], } = options;
        const { status } = yield (0, processRegistration_1.processRegistration)(user, address, assetId);
        interaction.reply({
            content: status,
            ephemeral: true,
        });
    }
    if (commandName === 'setup-test') {
        interaction.reply({
            content: 'adding test players...',
            ephemeral: true,
        });
        yield (0, database_1.resetPlayers)();
        yield (0, utils_1.asyncForEach)(mockdata_1.players, (player) => __awaiter(void 0, void 0, void 0, function* () {
            const { user, address, assetId } = player;
            yield (0, processRegistration_1.processRegistration)(user, address, assetId);
            yield (0, utils_1.wait)(1);
        }));
        interaction.editReply({
            content: 'test players added!',
            ephemeral: true,
        });
    }
}));
client.login(token);
