"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const insertHelper_1 = require("./services/insertHelper");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the SQL file
            const sqlFilePath = path.join(__dirname, "init.sql");
            const sqlQueries = fs.readFileSync(sqlFilePath, "utf8");
            // Execute the SQL queries
            yield data_source_1.AppDataSource.manager.query(sqlQueries);
            console.log("Database initialized with raw SQL.");
        }
        catch (error) {
            console.error("Error executing raw SQL:", error);
            throw error;
        }
    });
}
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "FE.html"));
});
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Expect the request body to have exactly one key.
        const keys = Object.keys(req.body);
        if (keys.length !== 1) {
            res.status(400).json({ message: "Request body must contain exactly one entity." });
            return;
        }
        const table = keys[0]; // e.g., "Student"
        const data = req.body[table];
        // Insert the record.
        yield (0, insertHelper_1.insertRecord)(table, data);
        res.status(201).json({ message: `${table} inserted successfully.` });
        return;
    }
    catch (error) {
        console.error("Error inserting record:", error);
        res.status(500).json({ message: "Error inserting record", error });
        return;
    }
}));
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeDatabase();
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}))
    .catch((error) => console.error("Error during Data Source initialization", error));
