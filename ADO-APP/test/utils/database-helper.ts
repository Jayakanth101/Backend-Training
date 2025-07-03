// test/utils/database-helper.ts
import { DataSource } from "typeorm";

export async function clearDatabase(dataSource: DataSource) {
    const entities = dataSource.entityMetadatas;

    const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(", ");

    try {
        await dataSource.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`);
    } catch (error) {
        console.error("Failed to truncate tables:", error.message);
    }
}

