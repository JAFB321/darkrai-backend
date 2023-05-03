import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Tratamiento } from "./Tratamiento"

@Entity()
export class Paciente {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @OneToMany(() => Tratamiento, (tratamiento) => tratamiento.paciente, { cascade: true })
    tratamientos: Tratamiento[]
}
