import {
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
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils/file-upload.utils';
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
  @Post('/add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploadedFiles',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() body: CreateAssetDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const jwt = request.headers['authorization'].replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true });
    const asset = await this.assetService.create(body, file, json);
    return asset;
  }

  @Get('/all')
  async getAll(@Req() request: Request) {
    const jwt = request.headers['authorization'].replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true });
    const assets = await this.assetService.getAll(json);
    return assets;
  }

  @Get('/:id')
  async findAsset(@Param('id') id: string) {
    const asset = await this.assetService.findOne(parseInt(id));
    console.log(asset);
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    return asset;
  }

  @Delete('/:id')
  async deleteAsset(@Param('id') id: string) {
    const asset = await this.assetService.remove(parseInt(id));
    console.log(asset);
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    return asset;
  }

  @Patch('update/:id')
  async updatesensor(@Param('id') id: number, @Body() body: UpdateAssetDto) {
    return this.assetService.updateAsset(id, body);
  }
}
