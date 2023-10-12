import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notifications'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationsRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: string): Promise<Notification | null> {
    throw new Error('Method not implemented.')
  }

  create(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
