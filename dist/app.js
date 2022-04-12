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
exports.playGame = void 0;
const utils_1 = require("./utils");
let state;
let winningPlayer;
const playGame = (match, observeTime) => __awaiter(void 0, void 0, void 0, function* () {
    winningPlayer = undefined;
    const { player1, player2, hp } = match;
    state = createGameState(player1, player2, hp);
    while (!winningPlayer) {
        console.log('playing round');
        if (observeTime) {
            yield (0, utils_1.wait)(observeTime);
        }
        playRound();
    }
    return winningPlayer;
});
exports.playGame = playGame;
const createGameState = (player1, player2, hp) => {
    const state = {
        players: [],
        hp: hp,
    };
    player1.hp = hp;
    player2.hp = hp;
    state.players = [player1, player2];
    return state;
};
const playRound = () => {
    const { players, hp } = state;
    if (Array.isArray(players)) {
        players.forEach((player, i) => {
            playerTurn(i, hp);
        });
    }
};
const getOtherPlayer = (currentPlayerIndex) => {
    if (currentPlayerIndex === 0) {
        return 1;
    }
    else
        return 0;
};
const playerTurn = (i, hp) => {
    const { players } = state;
    const player = state.players[i];
    const roll = Math.floor((Math.random() * hp) / 10);
    if (player.hp && player.hp > 0) {
        player.hp -= roll;
    }
    else {
        const winningPlayerIndex = getOtherPlayer(i);
        winningPlayer = players[winningPlayerIndex];
    }
};
