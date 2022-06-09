import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private repo: Repository<Asset>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(body, file, authToken) {
    try {
      const image = await this.cloudinary.uploadImage(file);
      const asset = this.repo.create({
        title: body.title,
        description: body.description,
        user: authToken.userId,
        imagePath: image.url,
        imageName: file.originalname,
        imageMimeType: image.format,
        imagePublicId: image.public_id,
      });

      const created = await this.repo.save(asset);
      return created;
    } catch {
      throw new BadRequestException(
        'Something went wrong while creating asset',
      );
    }
  }

  async data(file) {
    console.log(file, '     ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
    return await this.cloudinary.uploadImage(file).catch((err) => {
      throw new BadRequestException(err);
    });
  }

  async getAll(authToken) {
    const user = authToken.userId;
    const data = await this.repo.find({
      where: {
        user: {
          id: user,
        },
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
      await this.cloudinary.deleteImage(asset.imagePublicId);
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

  async updateAsset(id, attrs: Partial<Asset>, image) {
    const asset = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    if (image) {
      //delete old image
      await this.cloudinary.deleteImage(asset.imagePublicId);
      //replace with new image
      const newImage = await this.cloudinary.uploadImage(image);
      asset.imagePath = newImage.url;
      asset.imageName = image.originalname;
      asset.imageMimeType = newImage.format;
      asset.imagePublicId = newImage.public_id;
    }
    Object.assign(asset, attrs);
    await this.repo.save(asset);
    delete asset.user.password;
    return asset;
  }
}
