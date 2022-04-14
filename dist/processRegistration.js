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
const algoNode = process.env.ALGO_NODE;
const pureStakeApi = process.env.PURESTAKE_API;
const algoIndexerNode = process.env.ALGO_INDEXER_NODE;
const processRegistration = (user, address, assetId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = {
        'X-API-Key': pureStakeApi,
    };
    const server = algoNode;
    const indexerServer = algoIndexerNode;
    const port = '';
    const algodClient = new algosdk_1.default.Algodv2(token, server, port);
    const isOwned = yield determineOwnership(algodClient, address, assetId);
    if (isOwned) {
        const algoIndexer = new algosdk_1.default.Indexer(token, indexerServer, port);
        const asset = yield findAsset(assetId, algoIndexer);
        console.log('user has asset', asset);
    }
    else {
        console.log('user does not have asset');
    }
});
exports.processRegistration = processRegistration;
const findAsset = (assetId, indexer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield indexer.searchForAssets().index(assetId.value).do();
    }
    catch (error) {
        console.log('ERROR', error);
    }
});
const determineOwnership = function (algodclient, address, assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield algodclient.accountInformation(address.value).do();
        accountInfo.assets.forEach((asset) => {
            if (asset['asset-id'] === assetId.value) {
                return true;
            }
            else {
                return false;
            }
        });
    });
};
