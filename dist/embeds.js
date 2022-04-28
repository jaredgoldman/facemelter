"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWinningEmbed = exports.createMatchEmbed = exports.createTurnEmbed = exports.createInitialEmbed = exports.createRoundEmbed = void 0;
const discord_js_1 = require("discord.js");
const roundNames = {
    roundOne: 'Round one',
    roundTwo: 'Round two',
    semiFinals: 'Semi finals',
    finals: 'Finals',
};
const createInitialEmbed = (round) => {
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${roundNames[round]} started!`)
        .setDescription('this is the initial embed');
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createInitialEmbed = createInitialEmbed;
const createTurnEmbed = (state) => {
    const { players, round } = state;
    const hpFields = players.map((player) => {
        return {
            name: player.username,
            value: player.hp.toString(),
        };
    });
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${roundNames[round]}`)
        .setDescription(`Who will survive the meltening?`)
        .addFields(hpFields);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createTurnEmbed = createTurnEmbed;
const createMatchEmbed = (winningPlayer, round) => {
    const { username } = winningPlayer;
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Results from ${roundNames[round]}`)
        .setDescription(`${username} has won the match`);
    return {
        embeds: [embed],
        fetchReply: true,
    };
};
exports.createMatchEmbed = createMatchEmbed;
const createRoundEmbed = (winningPlayers, round) => {
    const playerFields = winningPlayers.map((player) => {
        return { name: `<@${player.discordId}>`, value: player.username };
    });
    const embed = new discord_js_1.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${roundNames[round]} completed`)
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
