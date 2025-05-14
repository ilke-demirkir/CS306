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
exports.Professor = void 0;
const typeorm_1 = require("typeorm");
const Departmant_1 = require("./Departmant");
const Office_1 = require("./Office");
const Publication_1 = require("./Publication");
let Professor = class Professor {
};
exports.Professor = Professor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Professor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Professor.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Departmant_1.Department, (department) => department.professors),
    (0, typeorm_1.JoinColumn)({ name: "department_id" }),
    __metadata("design:type", Departmant_1.Department)
], Professor.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Office_1.Office, (office) => office.professors, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "office_id" }),
    __metadata("design:type", Office_1.Office)
], Professor.prototype, "office", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Publication_1.Publication, (publication) => publication.author),
    __metadata("design:type", Array)
], Professor.prototype, "publications", void 0);
exports.Professor = Professor = __decorate([
    (0, typeorm_1.Entity)()
], Professor);
