import { IsOptional } from 'class-validator';

export class UpdateAssetDto {
  @IsOptional()
  title: string;
  @IsOptional()
  description: string;
}
