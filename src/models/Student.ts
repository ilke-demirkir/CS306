import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
  } from "typeorm";
  import { Dorm } from "./Dorm";
  import { Department } from "./Departmant";
  
  @Entity()
  export class Student {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: string;
  
    // Example: date the student enrolled or joined
    @Column({ type: "date" })
    since!: string;
  
    // Many students can live in one dorm
    @ManyToOne(() => Dorm, (dorm) => dorm.students)
    @JoinColumn({ name: "dorm_id" })
    dorm!: Dorm;
  
    // Optionally, if your diagram shows that students belong to a department
    @ManyToOne(() => Department, (department) => department.students, {
      nullable: true,
    })
    @JoinColumn({ name: "department_id" })
    department?: Department;
  }
  