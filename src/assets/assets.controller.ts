import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dtos/create-asset.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './utils/file-upload.utils';
import { UpdateAssetDto } from './dtos/update-asset.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(
    private assetService: AssetsService,
    private readonly jwtService: JwtService,
  ) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() body: CreateAssetDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request,
  ) {
    if (!image) {
      throw new BadRequestException('Asset must have an image');
    }
    const jwt = request.headers['authorization'].replace('Bearer ', '');
    const authToken = this.jwtService.decode(jwt, { json: true });
    const asset = await this.assetService.create(body, image, authToken);
    return asset;
  }

  @Post('/data')
  @UseInterceptors(FileInterceptor('file'))
  async data(@UploadedFile() file: Express.Multer.File) {
    return this.assetService.data(file);
  }

  @Get()
  async getAll(@Req() request: Request) {
    const jwt = request.headers['authorization'].replace('Bearer ', '');
    const authToken = this.jwtService.decode(jwt, { json: true });
    const assets = await this.assetService.getAll(authToken);
    return assets;
  }

  @Get('/:id')
  async findAsset(@Param('id') id: string) {
    const asset = await this.assetService.findOne(parseInt(id));
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    return asset;
  }

  @Delete('/:id')
  async deleteAsset(@Param('id') id: string) {
    const asset = await this.assetService.remove(parseInt(id));
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    return asset;
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updatesensor(
    @Param('id') id: number,
    @Body() body: UpdateAssetDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.assetService.updateAsset(id, body, image);
  }
}
