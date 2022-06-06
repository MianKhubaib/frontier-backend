import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsController } from './assets.controller';
import { Asset } from './asset.entity';
import { AssetsService } from './assets.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), CloudinaryModule],
  controllers: [AssetsController],
  providers: [AssetsService, JwtService],
})
export class AssetsModule {}
