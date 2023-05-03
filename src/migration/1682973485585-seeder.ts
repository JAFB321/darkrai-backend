import { MigrationInterface, QueryRunner } from "typeorm"

export class seeder1682973485585 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.createQueryBuilder()
        .insert()
        .into('user')
        .values({
            nombre: 'Administrador',
            username: 'admin',
            rol: 'admin',
            password: 'admin123'
        })
        .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.createQueryBuilder()
        .delete()
        .from('user')
        .where({username: 'admin'})
        .execute()
    }

}
