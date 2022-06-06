import { IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}
