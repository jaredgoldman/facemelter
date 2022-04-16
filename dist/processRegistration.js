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
exports.processRegistration = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const database_1 = require("./database");
const algoNode = process.env.ALGO_NODE;
const pureStakeApi = process.env.PURESTAKE_API;
const algoIndexerNode = process.env.ALGO_INDEXER_NODE;
const token = {
    'X-API-Key': pureStakeApi,
};
const server = algoNode;
const indexerServer = algoIndexerNode;
const port = '';
const processRegistration = (user, address, assetId) => __awaiter(void 0, void 0, void 0, function* () {
    const algodClient = new algosdk_1.default.Algodv2(token, server, port);
    const algoIndexer = new algosdk_1.default.Indexer(token, indexerServer, port);
    const { id: discordId, username } = user;
    const isOwned = yield determineOwnership(algodClient, address, assetId);
    if (isOwned) {
        const player = yield (0, database_1.findPlayer)(discordId);
        const asset = yield findAsset(assetId, algoIndexer);
        const { name: assetName, url: assetUrl, 'unit-name': unitName, } = asset === null || asset === void 0 ? void 0 : asset.assets[0].params;
        if (unitName.splice(0, 5) !== 'RCONE') {
            return {
                status: 'asset is not a randy cone',
                asset: null,
            };
        }
        const assetEntry = {
            assetUrl,
            assetName,
            assetId: assetId.value,
            unitName,
        };
        if (player) {
            yield (0, database_1.addPlayerAsset)(discordId, assetEntry);
            return {
                status: 'New asset added to existing user',
                asset: assetEntry,
            };
        }
        else {
            yield (0, database_1.addPlayer)({
                discordId,
                username,
                address: address.value,
                assets: [assetEntry],
            });
            return {
                status: 'New user added with initial asset',
                asset: assetEntry,
            };
        }
    }
    else {
        return {
            status: 'User does not own asset',
            asset: null,
        };
    }
});
exports.processRegistration = processRegistration;
const findAsset = (assetId, indexer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield indexer.searchForAssets().index(assetId.value).do();
    }
    catch (error) {
        console.log('ERROR finding asset');
    }
});
const determineOwnership = function (algodclient, address, assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let accountInfo = yield algodclient.accountInformation(address.value).do();
            let isOwned = false;
            accountInfo.assets.forEach((asset) => {
                if (asset['asset-id'] === assetId.value) {
                    isOwned = true;
                }
            });
            return isOwned;
        }
        catch (error) {
            console.log('error determining ownership');
        }
    });
};
