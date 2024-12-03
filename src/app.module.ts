import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { SessionsModule } from './sessions/sessions.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RoomsModule, 
    CurriculumModule, 
    SessionsModule, 
    ImportModule,
  ],
})
export class AppModule {}
