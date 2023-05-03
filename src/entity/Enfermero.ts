import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { Dosis } from "./Dosis"
import { User } from "./User"

@Entity()
export class Enfermero {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    userId: string

    @OneToMany(() => Dosis, (Dosis) => Dosis.enfermeroSuministracion)
    dosis?: Dosis[]

    @OneToOne(() => User, (user) => user.enfermero, {cascade: true})
    @JoinColumn()
    user?: User
}
