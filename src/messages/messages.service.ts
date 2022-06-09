import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
const Pusher = require('pusher');
@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private repo: Repository<Message>) {}

  async create(body) {
    try {
      const asset = this.repo.create({
        message: body.message,
        sentBy: body.sentBy,
        receivedBy: body.receivedBy,
      });

      const created = await this.repo.save(asset);
      const pusher = new Pusher({
        appId: '1421115',
        key: '76e5a0d02d7fd527d3a5',
        secret: '39b6951102d09788763a',
        cluster: 'ap2',
        useTLS: true,
      });

      pusher.trigger('message', 'inserted', created);
      return created;
    } catch {
      throw new BadRequestException(
        'Something went wrong while sending message',
      );
    }
  }

  async getAll() {
    return await this.repo.find();
  }

  async deleteAll() {
    const messages = await this.repo.find();
    messages.map(async (message) => {
      await this.repo.remove(message);
    });
    return 'All Message Deleted Successfully';
  }
}
