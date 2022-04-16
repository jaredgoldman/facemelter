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
const utils_1 = require("./utils");
let state;
let winningPlayer;
function playGame(match, observeTime) {
    return __awaiter(this, void 0, void 0, function* () {
        winningPlayer = undefined;
        const { player1, player2, hp } = match;
        createGameState(player1, player2, hp);
        while (!winningPlayer) {
            if (observeTime) {
                yield (0, utils_1.wait)(observeTime);
            }
            playRound();
        }
        return winningPlayer;
    });
}
exports.default = playGame;
const createGameState = (player1, player2, hp) => {
    player1.hp = hp;
    player2.hp = hp;
    state = {
        players: [player1, player2],
        hp,
    };
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
    const player = state.players[i];
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
