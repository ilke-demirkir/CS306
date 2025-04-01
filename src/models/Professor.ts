import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from "typeorm";
  import { Department } from "./Departmant";
  import { Office } from "./Office";
  import { Publication } from "./Publication";
  
  @Entity()
  export class Professor {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: string;
  
    // Many professors -> One department
    @ManyToOne(() => Department, (department) => department.professors)
    @JoinColumn({ name: "department_id" })
    department!: Department;
  
    // Many professors -> One office (if they share offices)
    @ManyToOne(() => Office, (office) => office.professors, { nullable: true })
    @JoinColumn({ name: "office_id" })
    office?: Office;
  
    // One professor -> Many publications
    @OneToMany(() => Publication, (publication) => publication.author)
    publications!: Publication[];
  }
  