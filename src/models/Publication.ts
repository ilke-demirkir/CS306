import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Professor } from "./Professor";

@Entity()
export class Publication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  // Many publications -> One professor (the author)
  @ManyToOne(() => Professor, (prof) => prof.publications)
  @JoinColumn({ name: "professor_id" })
  author!: Professor;
}
