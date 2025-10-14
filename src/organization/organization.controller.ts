/* eslint-disable prettier/prettier */
import { Controller, Get, Patch, Post, Delete, Body, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationService } from './organization.service';
import { User } from 'src/user/entities/user.entity';
import type { Request } from 'express';

@Controller('organization')
@UseGuards(AuthGuard('jwt'))
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  getOrganization(@Req() req: Request) {
    return this.organizationService.getOrganization(req.user as User);
  }

  @Patch()
  updateOrganization(@Req() req: Request, @Body() updateData: any) {
    return this.organizationService.updateOrganization(req.user as User, updateData);
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('logo'))
  uploadLogo(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    // In a real application, you would upload the file to a cloud storage service
    // and return the URL. For now, we'll just return a placeholder URL
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.organizationService.uploadLogo(req.user as User, file);
  }

  @Delete('logo')
  removeLogo(@Req() req: Request) {
    return this.organizationService.removeLogo(req.user as User);
  }
}