import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @UseGuards(AuthGuard()) 
  @Post()
  async create(@Body() createAssetDto: CreateAssetDto, @Req() req) {
      return this.assetsService.create(createAssetDto, req.user._id);
  }

  @Get()
  async findAll() {
    return this.assetsService.findAll();
  }
}