import * as fs from 'fs'
import * as path from 'path'
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ContentRepository } from 'src/content/repository'
import { ContentType } from 'src/content/entity/content-type.entity'
import { ProvisionDto, CreateContentInput } from 'src/content/dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name)
  private readonly expirationTime = 3600 // 1 hour

  constructor(
    private readonly contentRepository: ContentRepository,
    @InjectRepository(ContentType) private readonly contentTypeRepository: Repository<ContentType>,
  ) {}

  async provision(contentId: string): Promise<ProvisionDto> {
    this.logger.log(`Provision method called with contentId=${contentId}`)
    if (!contentId) {
      this.logger.error(`Invalid Content ID: ${contentId}`)
      throw new UnprocessableEntityException(`Content ID is invalid: ${contentId}`)
    }

    this.logger.log(`Provisioning content for id=${contentId}`)
    let content

    try {
      content = await this.contentRepository.findOneWithRelations(contentId)
    } catch (error) {
      this.logger.error(`Database error while fetching content: ${error}`)
      throw new NotFoundException(`Database error: ${error}`)
    }
    this.logger.log(`Content found: ${JSON.stringify(content)}`)
    if (!content) {
      this.logger.warn(`Content not found for id=${contentId}`)
      throw new NotFoundException(`Content not found: ${contentId}`)
    }

    const filePath = content.url ? content.url : undefined
    let bytes = 0

    try {
      bytes = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
    } catch (error) {
      this.logger.error(`File system error: ${error}`)
    }

    const url = this.generateSignedUrl(content.url || '')

    this.logger.log(`Content type found: ${JSON.stringify(content.contentType)}`)

    if (!content.contentType) {
      this.logger.warn(`Missing content type for ID=${contentId}`)
      throw new BadRequestException('Content type is missing')
    }

    const contentTypeName = content.contentType.name

    if (['pdf', 'image', 'video', 'link'].includes(contentTypeName)) {
      switch (contentTypeName) {
        case 'pdf':
          return {
            id: content.id,
            title: content.title,
            cover: content.cover,
            created_at: content.created_at,
            description: content.description,
            total_likes: content.total_likes,
            type: 'pdf',
            url,
            allow_download: true,
            is_embeddable: false,
            format: 'pdf',
            bytes,
            metadata: {
              author: 'Unknown',
              pages: Math.floor(bytes / 50000) || 1,
              encrypted: false,
            },
          }
        case 'image':
          return {
            id: content.id,
            title: content.title,
            cover: content.cover,
            created_at: content.created_at,
            description: content.description,
            total_likes: content.total_likes,
            type: 'image',
            url,
            allow_download: true,
            is_embeddable: true,
            format: path.extname(content.url || '').slice(1) || 'jpg',
            bytes,
            metadata: { resolution: '1920x1080', aspect_ratio: '16:9' },
          }
        case 'video':
          return {
            id: content.id,
            title: content.title,
            cover: content.cover,
            created_at: content.created_at,
            description: content.description,
            total_likes: content.total_likes,
            type: 'video',
            url,
            allow_download: false,
            is_embeddable: true,
            format: path.extname(content.url || '').slice(1) || 'mp4',
            bytes,
            metadata: { duration: Math.floor(bytes / 100000) || 10, resolution: '1080p' },
          }
        case 'link':
          return {
            id: content.id,
            title: content.title,
            cover: content.cover,
            created_at: content.created_at,
            description: content.description,
            total_likes: content.total_likes,
            type: 'link',
            url: content.url || 'http://default.com',
            allow_download: false,
            is_embeddable: true,
            format: null,
            bytes: 0,
            metadata: { trusted: content.url?.includes('https') || false },
          }
      }
    }

    this.logger.warn(`Unsupported content type for ID=${contentId}, type=${contentTypeName}`)
    throw new BadRequestException(`Unsupported content type: ${contentTypeName}`)
  }

  async create(data: CreateContentInput): Promise<ProvisionDto> {
    const { title, description, url, cover, contentTypeId } = data

    const contentType = await this.contentTypeRepository.findOne({ where: { id: contentTypeId } })
    if (!contentType) {
      throw new NotFoundException('Content type not found')
    }

    const content = this.contentRepository.create({
      title,
      description,
      url,
      cover,
      contentType,
    })

    const savedContent = await this.contentRepository.save(content)

    return {
      id: savedContent.id,
      title: savedContent.title,
      type: savedContent.contentType.name,
      description: savedContent.description,
      cover: savedContent.cover,
      url: savedContent.url,
      created_at: savedContent.created_at,
      allow_download: false,
      is_embeddable: true,
      format: null,
      bytes: 0,
      total_likes: 0,
      metadata: {},
    }
  }

  private generateSignedUrl(originalUrl: string): string {
    const expires = Math.floor(Date.now() / 1000) + this.expirationTime
    return `${originalUrl}?expires=${expires}&signature=${Math.random().toString(36).substring(7)}`
  }
}
