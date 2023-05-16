import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Tratamiento } from "./Tratamiento"

@Entity()
export class Paciente {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column({nullable: true})
    edad: number

    @Column({nullable: true})
    genero: string

    @Column({nullable: true})
    peso: number

    @Column({nullable: true})
    altura: number

    @Column({nullable: true})
    contactoEmergencia: string

    @Column({nullable: true})
    noSeguridadSocial: string

    @OneToMany(() => Tratamiento, (tratamiento) => tratamiento.paciente, { cascade: true })
    tratamientos: Tratamiento[]
}
