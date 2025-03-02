import { Repository, DataSource } from 'typeorm'
import { Injectable, Logger } from '@nestjs/common'
import { Content } from 'src/content/entity'
import { InjectDataSource } from '@nestjs/typeorm'

@Injectable()
export class ContentRepository extends Repository<Content> {
  private readonly logger = new Logger(ContentRepository.name)

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Content, dataSource.createEntityManager())
  }

  async findOneWithRelations(contentId: string): Promise<Content | null> {
    this.logger.log(`Searching for content with ID: ${contentId}`)

    const content = await this.dataSource.getRepository(Content).findOne({
      where: { id: contentId },
      relations: ['contentType'],
    })

    if (!content) {
      this.logger.warn(`No content found for ID: ${contentId}`)
    } else {
      this.logger.log(`Content found: ${JSON.stringify(content, null, 2)}`)
    }

    return content
  }
}
