import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContentService } from './service/content.service'
import { ContentRepository } from './repository/content.repository'
import { ContentType } from './entity/content-type.entity'
import { Content } from './entity/content.entity'
import { ContentResolver } from './resolver/content.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentType])],
  providers: [ContentService, ContentRepository, ContentResolver],
  exports: [ContentService, ContentRepository],
})
export class ContentModule {}
