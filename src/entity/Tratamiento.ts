import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { PlanMedicacion } from "./PlanMedicacion"
import { Paciente } from "./Paciente"

@Entity()
export class Tratamiento {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    pacienteId: number

    @OneToMany(() => PlanMedicacion, (planMedicacion) => planMedicacion.tratamiento, { cascade: true })
    planesMedicacion: PlanMedicacion[]

    @ManyToOne(() => Paciente, (paciente) => paciente.tratamientos)
    paciente: Paciente

}
