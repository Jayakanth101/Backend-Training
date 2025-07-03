import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConif = new DocumentBuilder()
        .setTitle("Azure Devops (clone) - End points")
        .setDescription("Swagger end points for ADO training project")
        .setVersion('1.0')
        .addTag("NestADOExpressApp")
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConif);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
