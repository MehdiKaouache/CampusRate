import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('CampusRate API')
    .setDescription(
      'API REST permettant de consulter des endroits du campus et de publier des appreciations.',
    )
    .setVersion('1.0.0')
    .addTag('Places', 'Gestion des endroits du campus')
    .addTag('Reviews', 'Gestion des appreciations')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/openapi.json',
    customSiteTitle: 'CampusRate - Documentation',
  });
}