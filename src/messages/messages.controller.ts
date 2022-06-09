import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/new')
  async addNewMessage(@Body() body: CreateMessageDto) {
    return await this.messagesService.create(body);
  }

  @Get('sync')
  getAll() {
    return this.messagesService.getAll();
  }

  @Delete('all')
  deleteAll() {
    return this.messagesService.deleteAll();
  }
}
