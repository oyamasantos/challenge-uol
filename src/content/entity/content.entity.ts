import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Company } from 'src/company/entity'
import { ContentType } from './content-type.entity'

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description?: string

  @Column()
  url: string

  @Column()
  cover?: string

  @Column({ type: 'int' })
  total_likes: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date | null

  @ManyToOne(() => ContentType, (contentType) => contentType.contents)
  @JoinColumn({ name: 'content_type_id' })
  contentType: ContentType

  @ManyToOne(() => Company, (company) => company.contents)
  @JoinColumn({ name: 'company_id' })
  company: Company
}
