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
exports.normalizeIpfsUrl = exports.isIpfs = exports.choosePlayers = exports.getNextRoundData = exports.asyncForEach = exports.wait = void 0;
const wait = (duration) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((res) => {
        setTimeout(res, duration);
    });
});
exports.wait = wait;
const asyncForEach = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    for (let index = 0; index < array.length; index++) {
        try {
            yield callback(array[index], index, array);
        }
        catch (error) {
            console.log('ERROR', error);
        }
    }
});
exports.asyncForEach = asyncForEach;
const getNextRoundData = (length) => {
    if (length === 16)
        return { nextRoundType: 'roundOne', observeTime: 0 };
    if (length === 8)
        return { nextRoundType: 'roundTwo', observeTime: 0 };
    if (length === 4)
        return { nextRoundType: 'semiFinals', observeTime: 1000 };
    if (length === 2)
        return { nextRoundType: 'finals', observeTime: 1000 };
    else
        return { nextRoundType: 'gameover', observeTime: 0 };
};
exports.getNextRoundData = getNextRoundData;
const splitPlayers = (players) => {
    const newPlayerArray = [];
    players.forEach((player) => {
        const { _id, discordId, username, address } = player;
        const splitEntries = player.assets.map((asset) => ({
            _id,
            discordId,
            username,
            address,
            asset,
        }));
        newPlayerArray.push(...splitEntries);
    });
    return newPlayerArray;
};
const choosePlayers = (players, length) => {
    const splitPlayerArray = splitPlayers(players);
    const playerArray = [];
    const randomIndexes = [];
    while (playerArray.length < length) {
        const randomIndex = Math.floor(Math.random() * splitPlayerArray.length);
        if (!randomIndexes.includes(randomIndex)) {
            playerArray.push(splitPlayerArray[randomIndex]);
            randomIndexes.push(randomIndex);
        }
    }
    return playerArray;
};
exports.choosePlayers = choosePlayers;
const isIpfs = (url) => (url === null || url === void 0 ? void 0 : url.slice(0, 4)) === 'ipfs';
exports.isIpfs = isIpfs;
const ipfsGateway = 'https://ipfs.io/ipfs/';
const normalizeIpfsUrl = (url) => {
    if ((0, exports.isIpfs)(url)) {
        const ifpsHash = url.slice(7);
        return `${ipfsGateway}${ifpsHash}`;
    }
    else {
        return url;
    }
};
exports.normalizeIpfsUrl = normalizeIpfsUrl;
