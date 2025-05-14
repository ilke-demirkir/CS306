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
exports.insertRecord = insertRecord;
const data_source_1 = require("../data-source");
/**
 * Inserts a record into the specified table.
 * @param table The name of the table.
 * @param data An object representing the record to insert.
 * @returns A promise that resolves when the insertion is complete.
 */
function insertRecord(table, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Optionally restrict allowed tables
        const allowedTables = ["Student", "Dorm", "Course", "Department", "Professors", "Newsletter", "Publications", "Seminars", "Recitations"];
        if (!allowedTables.includes(table)) {
            throw new Error("Invalid table specified.");
        }
        // Build columns, placeholders, and values.
        const columns = Object.keys(data).join(", ");
        const placeholders = Object.keys(data).map(() => "?").join(", ");
        const values = Object.values(data);
        // Build the SQL query string.
        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        return yield data_source_1.AppDataSource.manager.query(query, values);
    });
}
