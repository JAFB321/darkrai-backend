import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { Medicamento } from "./Medicamento"

@Entity()
export class Contenedor {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    motor: number

    @Column()
    pasoActual: number

    @Column({default: 10})
    pasosTotal: number

    @Column({nullable: true})
    medicamentoId?: number

    @OneToOne(() => Medicamento, (medicamento) => medicamento.contenedor)
    @JoinColumn()
    medicamento?: Medicamento
}
