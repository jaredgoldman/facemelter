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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playRound = void 0;
const game_1 = __importDefault(require("./game"));
const database_1 = require("./database");
const utils_1 = require("./utils");
const playRound = () => __awaiter(void 0, void 0, void 0, function* () {
    let game = yield (0, database_1.findGame)();
    let gameId;
    console.log("Playing game", game.round);
    let observeTime = game.round === "finals" ? 1000 : null;
    if (!game) {
        console.log("adding game");
        yield (0, database_1.addGame)();
        game = yield (0, database_1.findGame)();
        gameId = game._id;
        console.log("new game added");
    }
    else {
        gameId = game._id;
        console.log("game exists");
    }
    const { players } = game;
    const matches = groupMatches(players);
    const winningPlayers = yield playMatches(matches, observeTime);
    const nextRoundType = (0, utils_1.getNextRoundType)(winningPlayers.length);
    if (nextRoundType === "gameover") {
        (0, database_1.clearGame)(gameId);
    }
    else {
        const nextGame = {
            round: nextRoundType,
            players: winningPlayers,
        };
        yield (0, database_1.updateGame)(nextGame, gameId);
    }
});
exports.playRound = playRound;
const groupMatches = (players) => {
    let matches = [];
    for (let i = 0; i <= players.length - 1; i += 2) {
        const player1 = players[i];
        const player2 = players[i + 1];
        const hp = 1000;
        matches.push({ player1, player2, hp });
    }
    return matches;
};
const playMatches = (matches, observeTime) => __awaiter(void 0, void 0, void 0, function* () {
    const winningPlayers = [];
    yield (0, utils_1.asyncForEach)(matches, (match) => __awaiter(void 0, void 0, void 0, function* () {
        const winningPlayer = yield (0, game_1.default)(match, observeTime);
        winningPlayers.push(winningPlayer);
    }));
    return winningPlayers;
});
