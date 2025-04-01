import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Professor } from "./Professor";
import { Course } from "./Course";
import { Student } from "./Student";
import { Seminar } from "./Seminar";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // If your diagram shows a "newsletter" or something similar
  @Column({ nullable: true })
  newsletter?: string;

  // One department -> Many professors
  @OneToMany(() => Professor, (prof) => prof.department)
  professors!: Professor[];

  // One department -> Many courses
  @OneToMany(() => Course, (course) => course.department)
  courses!: Course[];

  // One department -> Many students
  @OneToMany(() => Student, (student) => student.department)
  students!: Student[];

  // One department -> Many seminars
  @OneToMany(() => Seminar, (seminar) => seminar.department)
  seminars!: Seminar[];
}
