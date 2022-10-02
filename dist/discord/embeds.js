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
exports.createRegisterEmbed = exports.createWinningEmbed = exports.createNextMatchEmbed = exports.createMatchEmbed = exports.createTurnEmbed = exports.createInitialEmbed = exports.createRoundEmbed = void 0;
const discord_js_1 = require("discord.js");
const julianCanvas_1 = require("../canvas/julianCanvas");
const roundNames = {
    roundOne: 'Round One',
    roundTwo: 'Round Two',
    semiFinals: 'Semi Finals',
    finals: 'Finals',
};
const createInitialEmbed = (round) => {
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${roundNames[round]} started!`);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createInitialEmbed = createInitialEmbed;
const createTurnEmbed = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { players, round } = state;
    const hpFields = players.map((player) => {
        const { discordId, asset } = player;
        const { unitName } = asset;
        return {
            name: `<@${discordId}> - ${unitName}`,
            value: `HP: ${player.hp.toString()}`,
        };
    });
    const attachment = yield (0, julianCanvas_1.renderMelts)(players);
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${roundNames[round]}`)
        .setDescription(`Who will survive the meltening?`)
        .addFields(hpFields)
        .setImage('attachment://test.jpg');
    return {
        embeds: [embed],
        fetchReply: true,
        files: [attachment],
    };
});
exports.createTurnEmbed = createTurnEmbed;
const createMatchEmbed = (winningPlayer, round) => {
    const { username, asset } = winningPlayer;
    const { unitName } = asset;
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Results from ${roundNames[round]}`)
        .setDescription(`${username} has won the match with ${unitName}`);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createMatchEmbed = createMatchEmbed;
const createNextMatchEmbed = (currentMatch, matchesLength) => {
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Commencing match ${currentMatch} out of ${matchesLength}`);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createNextMatchEmbed = createNextMatchEmbed;
const createRoundEmbed = (winningPlayers, round) => {
    const playerFields = winningPlayers.map((player) => {
        const { discordId, asset } = player;
        return { name: `<@${discordId}>`, value: `${asset.unitName}` };
    });
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${roundNames[round]} completed!`)
        .setDescription('Behold, our fearless survivors')
        .addFields(playerFields);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createRoundEmbed = createRoundEmbed;
const createWinningEmbed = (winningPlayer) => {
    const { username } = winningPlayer;
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`WINNER`)
        .setDescription(`${username} has won the tournamnet!`);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createWinningEmbed = createWinningEmbed;
const createRegisterEmbed = (asset, user) => {
    const { username } = user;
    const { unitName, assetUrl } = asset;
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`REGISTER SUCCESS`)
        .setDescription(`${username} has entered ${unitName} for melting!`)
        .setThumbnail(assetUrl);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createRegisterEmbed = createRegisterEmbed;
