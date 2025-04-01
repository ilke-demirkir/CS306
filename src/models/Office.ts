import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Professor } from "./Professor";

@Entity()
export class Office {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roomNumber!: string;

  // One office can be assigned to many professors (if they share an office)
  @OneToMany(() => Professor, (prof) => prof.office)
  professors!: Professor[];
}
