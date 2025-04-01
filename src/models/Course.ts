import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
  } from "typeorm";
  import { Department } from "./Departmant";
  
  @Entity()
  export class Course {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: string;
  
    // Number of credits, if needed
    @Column({ default: 0 })
    credits!: number;
  
    // Many courses -> One department
    @ManyToOne(() => Department, (department) => department.courses)
    @JoinColumn({ name: "department_id" })
    department!: Department;

    @Column()
    recitation?:string;
  
    // Self-referencing many-to-many for prerequisites
    @ManyToMany(() => Course, (course) => course.prerequisitesOf)
    @JoinTable({
      name: "course_prereq",        // custom join table name
      joinColumn: {
        name: "course_id",
        referencedColumnName: "id",
      },
      inverseJoinColumn: {
        name: "prerequisite_id",
        referencedColumnName: "id",
      },
    })
    prerequisites!: Course[];
  
    // Inverse side: the courses for which THIS course is a prerequisite
    @ManyToMany(() => Course, (course) => course.prerequisites)
    prerequisitesOf!: Course[];
  }
  