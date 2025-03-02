import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { ContentService } from '../service/content.service';
import { ProvisionDto } from '../dto/provision.dto';
import { Content } from '../entity/content.entity';

@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) { }

  @Query(() => ProvisionDto, { nullable: true })
  async provision(@Args('contentId') contentId: string): Promise<ProvisionDto> {
    return this.contentService.provision(contentId);
  }
}
