/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrganizationService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async getOrganization(user: User) {
    return this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });
  }

  async updateOrganization(user: User, updateData: any) {
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    Object.assign(organization, updateData);
    return this.organizationRepository.save(organization);
  }

  async uploadLogo(
    user: User,
    file: Express.Multer.File,
    folder: string = 'logos',
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.logoUrl) {
      try {
        // Extract object key from logoUrl
        const oldKey = organization.logoUrl.split('.com/')[1];

        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: oldKey,
          }),
        );
      } catch (error) {
        console.error('Error deleting old logo:', error.message);
        // continue even if deletion fails (optional)
      }
    }

    const fileName = `${folder}/${uuid()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    organization.logoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    return this.organizationRepository.save(organization);
  }

  async removeLogo(user: User) {
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.logoUrl) {
      try {
        const key = organization.logoUrl.split('.amazonaws.com/')[1]; 
        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
          }),
        );
      } catch (error) {
        throw new BadRequestException('Failed to delete logo from storage');
      }
    }

    organization.logoUrl = null;
    return this.organizationRepository.save(organization);
  }
}
