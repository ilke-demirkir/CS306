"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
const typeorm_1 = require("typeorm");
const Professor_1 = require("./Professor");
const Course_1 = require("./Course");
const Student_1 = require("./Student");
const Seminar_1 = require("./Seminar");
let Department = class Department {
};
exports.Department = Department;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Department.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Department.prototype, "newsletter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Professor_1.Professor, (prof) => prof.department),
    __metadata("design:type", Array)
], Department.prototype, "professors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Course_1.Course, (course) => course.department),
    __metadata("design:type", Array)
], Department.prototype, "courses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Student_1.Student, (student) => student.department),
    __metadata("design:type", Array)
], Department.prototype, "students", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Seminar_1.Seminar, (seminar) => seminar.department),
    __metadata("design:type", Array)
], Department.prototype, "seminars", void 0);
exports.Department = Department = __decorate([
    (0, typeorm_1.Entity)()
], Department);
