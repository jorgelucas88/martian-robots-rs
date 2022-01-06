import { Module } from '@nestjs/common';
import { RobotsModule } from './robots/robots.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [RobotsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
   }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
