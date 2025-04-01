import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Student } from "./Student";

@Entity()
export class Dorm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  buildingNumber!: string;

  @Column()
  capacity!: number;

  // One dorm can house many students
  @OneToMany(() => Student, (student) => student.dorm)
  students!: Student[];
}
