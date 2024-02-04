import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TasksCheckerScheduleService } from './tasks-checker-schedule.service';
import { MailOperationsModule } from '../mail-operations/mail-operations.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
    }),

    MailOperationsModule.forRoot(),
  ],
  providers: [
    TasksCheckerScheduleService,
  ],
})
export class ScheduleTasksModule {
}
