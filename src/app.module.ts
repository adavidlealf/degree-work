import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [RoomsModule, CurriculumModule, SessionsModule],
})
export class AppModule {}
