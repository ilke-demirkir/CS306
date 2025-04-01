import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Course } from "./Course";
  
  @Entity()
  export class Recitation {
    @PrimaryGeneratedColumn()
    id!: number;
  
    // e.g., "like", "dislike", "love", etc.
    @Column()
    section!:string;
  
    // Many reactions -> One course
    @ManyToOne(() => Course, (course) => course.recitation)
    @JoinColumn({ name: "course_id" })
    course!: Course;
  
    // If you want to track who made the reaction, you could also reference Student:
    // @ManyToOne(() => Student, (student) => student.recitations)
    // student: Student;
  }
  