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
exports.clearGame = exports.updateGame = exports.addGame = exports.findGame = exports.addPlayers = void 0;
require('dotenv').config();
const mockdata_1 = require("./mockdata");
const mongodb_1 = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new mongodb_1.MongoClient(uri);
const addPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const database = client.db('facemelter');
        const collection = database.collection('users');
        yield collection.insertMany(mockdata_1.players.roundOne);
    }
    catch (error) {
        console.log('error adding players');
    }
});
exports.addPlayers = addPlayers;
const findGame = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const database = client.db('facemelter');
        const collection = database.collection('game');
        return yield collection.findOne();
    }
    catch (error) {
        console.log('error finding game');
    }
});
exports.findGame = findGame;
const addGame = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = {
            round: 'roundOne',
            players: mockdata_1.players.roundOne,
        };
        yield client.connect();
        const database = client.db('facemelter');
        const collection = database.collection('game');
        return yield collection.insertOne(game);
    }
    catch (error) {
        console.log('error adding game');
    }
});
exports.addGame = addGame;
const registerUser = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    const database = client.db('facemelter');
    const collection = database.collection('users');
});
const updateGame = (data, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    const database = client.db('facemelter');
    const collection = database.collection('game');
    return yield collection.findOneAndReplace({ _id: gameId }, data);
});
exports.updateGame = updateGame;
const clearGame = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    const database = client.db('facemelter');
    const collection = database.collection('game');
    return yield collection.deleteOne({ _id: gameId });
});
exports.clearGame = clearGame;
