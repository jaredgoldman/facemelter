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
exports.getNextRoundType = exports.asyncForEach = exports.wait = void 0;
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
const getNextRoundType = (length) => {
    if (length === 16)
        return 'roundOne';
    if (length === 8)
        return 'roundTwo';
    if (length === 4)
        return 'semiFinals';
    if (length === 2)
        return 'finals';
    else
        return 'gameover';
};
exports.getNextRoundType = getNextRoundType;
