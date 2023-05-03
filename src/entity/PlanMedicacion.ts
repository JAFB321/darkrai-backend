import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Tratamiento } from "./Tratamiento"
import { Medicamento } from "./Medicamento"
import { Dosis } from "./Dosis"

@Entity()
export class PlanMedicacion {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    tratamientoId: number

    @Column()
    medicamentoId: number

    @Column({default: 0})
    cantidadTotal: number

    @Column()
    fechaInicio: Date

    @Column()
    fechaFin: Date

    @Column({default: 1})
    cantidadDosis: number

    @Column({default: 1})
    intervaloHoras: number

    @Column()
    activo: boolean

    @ManyToOne(() => Tratamiento, (tratamiento) => tratamiento.planesMedicacion)
    tratamiento: Tratamiento

    @ManyToOne(() => Medicamento, (medicamento) => medicamento.planesMedicacion)
    medicamento: Medicamento

    @OneToMany(() => Dosis, (dosis) => dosis.planMedicacion, { cascade: true })
    dosis: Dosis[]

}
