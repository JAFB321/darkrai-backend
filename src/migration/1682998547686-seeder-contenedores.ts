import { MigrationInterface, QueryRunner } from "typeorm"

export class seederContenedores1682998547686 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.createQueryBuilder()
        .insert()
        .into('contenedor')
        .values([
            {
                motor: 1,
                pasoActual: 1
            },
            {
                motor: 2,
                pasoActual: 1
            },
            {
                motor: 3,
                pasoActual: 1
            }
        ])
        .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
