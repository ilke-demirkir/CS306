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
exports.Student = void 0;
const typeorm_1 = require("typeorm");
const Dorm_1 = require("./Dorm");
const Departmant_1 = require("./Departmant");
let Student = class Student {
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Student.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Student.prototype, "since", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Dorm_1.Dorm, (dorm) => dorm.students),
    (0, typeorm_1.JoinColumn)({ name: "dorm_id" }),
    __metadata("design:type", Dorm_1.Dorm)
], Student.prototype, "dorm", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Departmant_1.Department, (department) => department.students, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "department_id" }),
    __metadata("design:type", Departmant_1.Department)
], Student.prototype, "department", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)()
], Student);
