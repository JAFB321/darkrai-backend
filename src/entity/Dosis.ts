import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm"
import { PlanMedicacion } from "./PlanMedicacion"
import { Enfermero } from "./Enfermero"

@Entity()
export class Dosis {

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    planMedicacionId?: number

    @Column()
    fecha: Date

    @Column()
    cantidad: number

    @Column({default: false})
    suministrado: boolean

    @Column({nullable: true})
    cantidadSuministrada?: number

    @Column({nullable: true})
    fechaSuministracion?: Date

    @Column({nullable: true})
    enfermeroSuministracionId?: number

    @ManyToOne(() => PlanMedicacion, (planMedicacion) => planMedicacion.dosis)
    planMedicacion?: PlanMedicacion

    @ManyToOne(() => Enfermero, (enfermero) => enfermero.dosis)
    enfermeroSuministracion?: Enfermero

}
