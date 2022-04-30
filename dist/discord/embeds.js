"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWinningEmbed = exports.createNextMatchEmbed = exports.createMatchEmbed = exports.createTurnEmbed = exports.createInitialEmbed = exports.createRoundEmbed = void 0;
const discord_js_1 = require("discord.js");
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
const createTurnEmbed = (state) => {
    const { players, round } = state;
    const hpFields = players.map((player) => {
        const { discordId, asset } = player;
        const { unitName } = asset;
        return {
            name: `<@${discordId}> - ${unitName}`,
            value: `HP: ${player.hp.toString()}`,
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
