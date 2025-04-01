import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Department } from "./Departmant";
  
  @Entity()
  export class Seminar {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    topic!: string;
  
    // Many seminars -> One department
    @ManyToOne(() => Department, (dept: { seminars: any; }) => dept.seminars)
    @JoinColumn({ name: "department_id" })
    department!: Department;
  
    // If each seminar is delivered by a specific professor, you can add:
    // @ManyToOne(() => Professor, (prof) => prof.seminars)
    // @JoinColumn({ name: "professor_id" })
    // deliveredBy: Professor;
  }
  