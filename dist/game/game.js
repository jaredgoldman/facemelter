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
exports.state = exports.playGame = void 0;
const embeds_1 = require("../discord/embeds");
const sharedUtils_1 = require("../utils/sharedUtils");
let state = {
    players: [],
    hp: 0,
    embed: null,
    round: 'roundOne',
    observeTime: 0,
};
exports.state = state;
let winningPlayer;
let observe;
const playGame = (match, observeTime, round, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    observe = observeTime;
    winningPlayer = undefined;
    const { player1, player2, hp } = match;
    createGameState(player1, player2, hp, round, observeTime);
    while (!winningPlayer) {
        if (observeTime) {
            yield (0, sharedUtils_1.wait)(observeTime);
        }
        playRound(interaction);
    }
    if (observeTime) {
        const matchEmbed = (0, embeds_1.createMatchEmbed)(winningPlayer, round);
        yield state.embed.edit(matchEmbed);
        yield (0, sharedUtils_1.wait)(3000);
    }
    return winningPlayer;
});
exports.playGame = playGame;
const createGameState = (player1, player2, hp, round, observeTime) => {
    player1.hp = hp;
    player2.hp = hp;
    exports.state = state = Object.assign(Object.assign({}, state), { players: [player1, player2], hp,
        round,
        observeTime });
};
const playRound = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { players, hp } = state;
    if (Array.isArray(players)) {
        players.forEach((player, i) => {
            playerTurn(i, hp);
        });
        determineWinner();
        if (observe) {
            const turnEmbed = yield (0, embeds_1.createTurnEmbed)(state);
            yield state.embed.edit(turnEmbed);
            yield (0, sharedUtils_1.wait)(1000);
        }
    }
});
const playerTurn = (playerIndex, hp) => {
    const player = state.players[playerIndex];
    const roll = Math.floor((Math.random() * hp) / 10);
    if (player.hp && player.hp > 0) {
        player.hp -= roll;
    }
};
const determineWinner = () => {
    const [player1, player2] = state.players;
    const win = player1.hp < 1 || player2.hp < 1;
    if (win) {
        const winningPlayers = state.players.filter((player) => {
            return player.hp && player.hp > 1;
        });
        if (winningPlayers.length === 1) {
            winningPlayer = winningPlayers[0];
            return;
        }
        if (!winningPlayers.length && player1.hp === player2.hp) {
            winningPlayer = state.players[tieBreaker()];
            return;
        }
        if (!winningPlayers.length && player1.hp > player2.hp) {
            winningPlayer = player1;
            return;
        }
        else {
            winningPlayer = player2;
            return;
        }
    }
};
const tieBreaker = () => {
    const num = Math.floor(Math.random() * 10);
    if (num < 5)
        return 0;
    if (num > 5)
        return 1;
    return 0;
};
