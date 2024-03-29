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
exports.addPlayerAsset = exports.findPlayer = exports.addPlayer = exports.clearGame = exports.updateGame = exports.addGame = exports.findGame = exports.resetPlayers = exports.addPlayers = void 0;
const mocks_1 = require("./mocks/");
const mongodb_1 = require("mongodb");
const sharedUtils_1 = require("./utils/sharedUtils");
const uri = process.env.MONGO_URI;
const client = new mongodb_1.MongoClient(uri);
client.connect();
const addPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('users');
    yield collection.insertMany(mocks_1.mockPlayers);
});
exports.addPlayers = addPlayers;
const resetPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('users');
    yield collection.deleteMany({});
});
exports.resetPlayers = resetPlayers;
const findGame = () => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('game');
    return yield collection.findOne();
});
exports.findGame = findGame;
const getPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('users');
    return (yield collection.find().toArray());
});
const addGame = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const players = yield getPlayers();
        const randomizedPlayers = (0, sharedUtils_1.choosePlayers)(players, 16);
        const game = {
            round: 'roundOne',
            players: randomizedPlayers,
            observeTime: 0,
        };
        const database = client.db('facemelter');
        const collection = database.collection('game');
        return yield collection.insertOne(game);
    }
    catch (error) {
        console.log('error adding game', error);
    }
});
exports.addGame = addGame;
const addPlayer = (playerData) => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('users');
    return yield collection.insertOne(playerData);
});
exports.addPlayer = addPlayer;
const addPlayerAsset = (discordId, asset) => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('users');
    const player = yield collection.findOne({ discordId });
    const hasAsset = player === null || player === void 0 ? void 0 : player.assets.filter((playerAsset) => playerAsset.assetId === asset.assetId);
    if (!hasAsset.length) {
        return collection.findOneAndUpdate({ discordId }, { $set: { assets: [...player === null || player === void 0 ? void 0 : player.assets, asset] } });
    }
    else {
        console.log('player already has asset');
    }
});
exports.addPlayerAsset = addPlayerAsset;
const findPlayer = (discordId) => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('users');
    return (yield collection.findOne({ discordId }));
});
exports.findPlayer = findPlayer;
const updateGame = (data, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('game');
    return yield collection.findOneAndReplace({ _id: gameId }, data);
});
exports.updateGame = updateGame;
const clearGame = () => __awaiter(void 0, void 0, void 0, function* () {
    const database = client.db('facemelter');
    const collection = database.collection('game');
    return yield collection.deleteMany({});
});
exports.clearGame = clearGame;
