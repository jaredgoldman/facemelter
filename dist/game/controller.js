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
exports.playRound = void 0;
const game_1 = require("./game");
const database_1 = require("../database");
const utils_1 = require("../utils");
const embeds_1 = require("../discord/embeds");
const playRound = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('playing round');
    const game = yield determineGame();
    const { players, _id: gameId, round } = game;
    const initialEmbed = (0, embeds_1.createInitialEmbed)(round);
    game_1.state.embed = yield interaction.reply(initialEmbed);
    yield (0, utils_1.wait)(1000);
    const matches = groupMatches(players);
    const winningPlayers = yield playMatches(matches, game.observeTime, round, interaction);
    const { nextRoundType, observeTime } = (0, utils_1.getNextRoundData)(winningPlayers.length);
    if (nextRoundType === 'gameover') {
        (0, database_1.clearGame)();
        const winningEmbed = (0, embeds_1.createWinningEmbed)(winningPlayers[0]);
        return game_1.state.embed.edit(winningEmbed);
    }
    else {
        const nextGame = {
            round: nextRoundType,
            players: winningPlayers,
            observeTime,
        };
        yield (0, database_1.updateGame)(nextGame, gameId);
    }
    const roundEmbed = (0, embeds_1.createRoundEmbed)(winningPlayers, round);
    yield game_1.state.embed.edit(roundEmbed);
    return winningPlayers;
});
exports.playRound = playRound;
const groupMatches = (players) => {
    let matches = [];
    for (let i = 0; i <= players.length - 1; i += 2) {
        const player1 = players[i];
        const player2 = players[i + 1];
        const hp = 100;
        matches.push({ player1, player2, hp });
    }
    return matches;
};
const playMatches = (matches, observeTime, round, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const winningPlayers = [];
    yield (0, utils_1.asyncForEach)(matches, (match, i) => __awaiter(void 0, void 0, void 0, function* () {
        if (observeTime && round !== 'finals') {
            const currentMatch = i + 1;
            const matchesLength = matches.length;
            const nextMatchEmbed = (0, embeds_1.createNextMatchEmbed)(currentMatch, matchesLength);
            yield game_1.state.embed.edit(nextMatchEmbed);
            yield (0, utils_1.wait)(1000);
        }
        const winningPlayer = yield (0, game_1.playGame)(match, observeTime, round, interaction);
        winningPlayers.push(winningPlayer);
    }));
    return winningPlayers;
});
const determineGame = () => __awaiter(void 0, void 0, void 0, function* () {
    let game = yield (0, database_1.findGame)();
    if (!game) {
        console.log('game does not exist');
        yield (0, database_1.addGame)();
        game = yield (0, database_1.findGame)();
    }
    else {
        console.log('game exists');
    }
    return game;
});
