import { Module } from '@nestjs/common';
import { AlgorithmController } from './controller/algorithm.controller';
import { AlgorithmService } from './service/algorithm.service';

@Module({
  providers: [
    AlgorithmService,
  ],
  controllers: [
    AlgorithmController,
  ]
})
export class AlgorithmModule {}
