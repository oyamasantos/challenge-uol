import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Content } from './content.entity'

@Entity('content_types')
export class ContentType {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  name: string

  @OneToMany(() => Content, (content) => content.contentType)
  contents: Content[]
}
