import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ethereum-Mantle Bridge')
    .setDescription(
      'This project provides a bridge between the Ethereum blockchain and the Mantle chain using the NestJS framework. \n' +
        'It offers a robust and efficient solution for multi-stage liquidity transfers, leveraging the convenience of RPC \n' +
        'to ensure atomic separation of commands. \n' +
        '\n' +
        'This approach mitigates the impact of errors or disconnections at any step of the liquidity transfer process, which can take \n' +
        'up to 7 days on the mainnet. The server is designed to be easily integrated into any environment as a microservice.\n',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3020);
}
bootstrap();
