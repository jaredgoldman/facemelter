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
        if (observeTime) {
            yield (0, utils_1.wait)(observeTime);
        }
        playRound();
    }
    console.log("WINNER", winningPlayer);
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
        determineWinner();
    }
};
const playerTurn = (i, hp) => {
    const { players } = state;
    const player = state.players[i];
    const roll = Math.floor((Math.random() * hp) / 10);
    console.log(`${roll} damage done to ${players[i].username}`);
    if (player.hp && player.hp > 0) {
        player.hp -= roll;
    }
};
const determineWinner = () => {
    const players = state.players;
    const win = state.players[0].hp < 1 || state.players[1].hp < 1;
    if (win) {
        const winningPlayers = state.players.filter((player) => {
            return player.hp && player.hp > 1;
        });
        console.log("player1 hp", state.players[0]);
        console.log("player2 hp", state.players[1]);
        console.log("winning players", winningPlayers);
        if (winningPlayers.length === 1) {
            console.log("1 winner");
            winningPlayer = winningPlayers[0];
            return;
        }
        if (!winningPlayers.length && players[0].hp === players[1].hp) {
            console.log("TIE");
            winningPlayer = players[tieBreaker()];
            return;
        }
        if (!winningPlayers.length && players[0].hp > players[1].hp) {
            console.log("player 1 wins");
            winningPlayer = players[0];
            return;
        }
        else {
            console.log("player 2 wins");
            winningPlayer = players[1];
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
