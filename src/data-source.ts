import "reflect-metadata"
import { DataSource } from "typeorm"
import { Dosis, Enfermero, Medicamento, User, Paciente, PlanMedicacion, Tratamiento } from "./entity"
import {seeder1682973485585} from './migration/1682973485585-seeder'
import {seederContenedores1682998547686} from './migration/1682998547686-seeder-contenedores'
import { Contenedor } from "./entity/Contenedor"

export default new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    // dropSchema: true,
    logging: false,
    entities: [User, Medicamento, Enfermero, Dosis, Paciente, PlanMedicacion, Tratamiento, Contenedor],
    subscribers: [],
    migrationsTableName: "migrations",
    // migrations: [seeder1682973485585, seederContenedores1682998547686],
    migrationsRun: true
})
