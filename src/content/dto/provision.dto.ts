import { Field, Int, ObjectType, InputType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType()
export class ProvisionDto {
  @Field(() => String)
  id: string

  @Field(() => String)
  title: string

  @Field(() => String)
  type: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  cover?: string

  @Field(() => String)
  url: string

  @Field(() => Date)
  created_at: Date

  @Field(() => Boolean)
  allow_download: boolean

  @Field(() => Boolean)
  is_embeddable: boolean

  @Field(() => String, { nullable: true })
  format?: string

  @Field(() => Int)
  bytes: number

  @Field(() => Int)
  total_likes: number

  @Field(() => GraphQLJSONObject)
  metadata: object
}

@InputType()
export class CreateContentInput {
  @Field(() => String)
  contentTypeId: string

  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  cover?: string
}
