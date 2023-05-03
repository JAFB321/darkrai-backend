import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import { Enfermero } from "./Enfermero"

export type UserRoles = 'enfermero' | 'admin'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    nombre: string

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    rol: UserRoles

    @OneToOne(() => Enfermero, (enfermero) => enfermero.user)
    enfermero?: Enfermero

}
