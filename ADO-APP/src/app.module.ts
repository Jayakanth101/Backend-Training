import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItems } from './WorkItems/WorkItems.entity';
import { WorkItemsModule } from './WorkItems/WorkItems.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'devuser',
            password: 'root',
            database: 'ado_app',
            entities: [WorkItems],
            synchronize: false,
        }), WorkItemsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
