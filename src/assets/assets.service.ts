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

  async create(body, file, authToken) {
    try {
      const asset = this.repo.create({
        title: body.title,
        description: body.description,
        user: authToken.userId,
      });
      if (file) {
        asset.imagePath = file.path;
        asset.imageName = file.filename;
        asset.imageMimeType = file.mimetype;
      }
      const created = await this.repo.save(asset);
      return created;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getAll(authToken) {
    const data = await this.repo.find({
      where: {
        user: authToken.userId,
      },
    });
    const mappedData = data.map((row) => {
      delete row.user.password;
      return row;
    });
    return mappedData;
  }

  async findOne(id) {
    const asset = this.repo.findOne({
      where: {
        id,
      },
    });
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    delete (await asset).user;
    return asset;
  }

  async remove(id) {
    const asset = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    try {
      const removed = await this.repo.remove(asset);
      delete removed.user;
      return removed;
    } catch (err) {
      throw new BadRequestException(
        err.detail,
        'Asset cannot be deleted if attached to sensor',
      );
    }
  }

  async updateAsset(id, attrs: Partial<Asset>) {
    const asset = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    Object.assign(asset, attrs);
    await this.repo.save(asset);
    delete asset.user.password;
    return asset;
  }
}
