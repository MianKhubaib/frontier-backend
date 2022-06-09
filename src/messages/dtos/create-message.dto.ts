import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  message: string;

  @IsNotEmpty()
  sentBy: string;

  @IsNotEmpty()
  receivedBy: string;
}
