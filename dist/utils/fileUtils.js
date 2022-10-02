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
exports.downloadAssetImage = void 0;
const axios_1 = __importDefault(require("axios"));
const sharedUtils_1 = require("./sharedUtils");
const fs_1 = __importDefault(require("fs"));
const downloadAssetImage = (asset, directory, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetUrl } = asset;
        if (assetUrl) {
            const url = (0, sharedUtils_1.normalizeIpfsUrl)(assetUrl);
            const path = `${directory}/${username
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                .trim()}.jpg`;
            const writer = fs_1.default.createWriteStream(path);
            const res = yield axios_1.default.get(url, {
                responseType: 'stream',
            });
            res.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    return resolve(path);
                });
            });
        }
    }
    catch (error) {
        console.log('****** ERROR DOWNLOADING ASSET IMAGE ******', error);
    }
});
exports.downloadAssetImage = downloadAssetImage;
