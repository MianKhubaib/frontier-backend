import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { response } from 'express';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Asset) private repo: Repository<Asset>) {}

  async create(body, file) {
    try {
      const asset = this.repo.create({
        title: body.title,
        description: body.description,
        imagePath: file.path,
        imageName: file.filename,
        imageMimeType: file.mimetype,
      });
      console.log(file);
      const created = await this.repo.save(asset);
      return created;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
