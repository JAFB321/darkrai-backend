import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm"
import { PlanMedicacion } from "./PlanMedicacion"
import { Contenedor } from "./Contenedor"

@Entity()
export class Medicamento {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    concentrado: number

    @Column({nullable: true})
    lote: number

    @Column({nullable: true})
    caducidad: Date

    @OneToMany(() => PlanMedicacion, (planMedicacion) => planMedicacion.medicamento)
    planesMedicacion: PlanMedicacion[]

    @OneToOne(() => Contenedor, (contenedeor) => contenedeor.medicamento)
    contenedor?: Contenedor
}
