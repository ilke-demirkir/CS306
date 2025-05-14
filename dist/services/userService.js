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
exports.createUserService = exports.getUsersService = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../models/User");
const getUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    return data_source_1.AppDataSource.manager.find(User_1.User);
});
exports.getUsersService = getUsersService;
const createUserService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = data_source_1.AppDataSource.manager.create(User_1.User, data);
    return data_source_1.AppDataSource.manager.save(user);
});
exports.createUserService = createUserService;
