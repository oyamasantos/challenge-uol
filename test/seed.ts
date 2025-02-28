/* eslint-disable no-console */
import { DataSource } from 'typeorm'
import { User } from 'src/user/entity'
import { Company } from 'src/company/entity'
import { AppDataSource } from 'src/database/data-source.database'
import { Content } from 'src/content/entity'
import { ContentType } from 'src/content/entity/content-type.entity'

export const seedDatabase = async (dataSource: DataSource) => {
  const queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()

  await queryRunner.manager.query('DELETE FROM users')
  await queryRunner.manager.query('DELETE FROM contents')
  await queryRunner.manager.query('DELETE FROM companies')
  await queryRunner.manager.query('DELETE FROM content_types')

  await queryRunner.manager.insert(ContentType, [
    { id: '11111111-1111-1111-1111-111111111111', name: 'pdf' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'image' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'video' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'link' },
  ])

  // const contentTypes = await queryRunner.manager.find(ContentType)
  // const getContentTypeId = (name: string) => contentTypes.find((ct) => ct.name === name)?.id

  const company1 = queryRunner.manager.create(Company, { name: 'Company A' })
  const company2 = queryRunner.manager.create(Company, { name: 'Company B' })
  const [createdCompany1, createdCompany2] = await Promise.all([
    queryRunner.manager.save(company1),
    queryRunner.manager.save(company2),
  ])

  const user1 = queryRunner.manager.create(User, {
    id: '18c37ce2-cd34-4305-9ca4-c15fc736beac',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    password: 'hashed-password',
    company: createdCompany1,
  })
  const user2 = queryRunner.manager.create(User, {
    name: 'Foo Bar',
    email: 'foo@example.com',
    role: 'admin',
    password: 'hashed-password',
    company: createdCompany2,
  })

  await Promise.all([queryRunner.manager.save(user1), queryRunner.manager.save(user2)])

  await Promise.all([
    queryRunner.manager.save(
      queryRunner.manager.create(Content, {
        id: '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
        title: 'Introdução à Cultura Tech',
        description: 'Uma imagem ilustrativa sobre a cultura de trabalho em equipe.',
        url: 'http://localhost:3000/uploads/image1.jpg',
        cover: 'http://localhost:3000/uploads/image1-cover.jpg',
        contentType: await queryRunner.manager.findOneBy(ContentType, { name: 'image' }),
        total_likes: 0,
        company: createdCompany1,
      }),
    ),
    queryRunner.manager.save(
      queryRunner.manager.create(Content, {
        id: '26a42e72-cc93-44b3-acae-01537a36322b',
        title: 'Ambiente de Trabalho Moderno',
        description: 'Espaços colaborativos e inovação nas empresas de tecnologia.',
        url: 'http://localhost:3000/uploads/image2.png',
        cover: 'http://localhost:3000/uploads/image2-cover.jpg',
        contentType: await queryRunner.manager.findOneBy(ContentType, { name: 'image' }),
        total_likes: 2,
        company: createdCompany1,
      }),
    ),
    queryRunner.manager.save(
      queryRunner.manager.create(Content, {
        id: '7acff1c5-4c43-4923-a323-d22a12573041',
        title: 'Guia de Boas Práticas em Desenvolvimento',
        description: 'Boas práticas de programação e metodologias ágeis.',
        url: 'http://localhost:3000/uploads/pdf1.pdf',
        cover: 'http://localhost:3000/uploads/pdf1-cover.jpg',
        contentType: await queryRunner.manager.findOneBy(ContentType, { name: 'pdf' }),
        total_likes: 4,
        company: createdCompany1,
      }),
    ),
    queryRunner.manager.save(
      queryRunner.manager.create(Content, {
        id: '3a5a94aa-17da-4e9a-b493-fe7e81294631',
        title: 'Manual de Arquitetura de Software',
        description: 'Padrões arquiteturais e boas práticas para sistemas escaláveis.',
        url: 'http://localhost:3000/uploads/pdf2.pdf',
        cover: 'http://localhost:3000/uploads/pdf2-cover.jpg',
        contentType: await queryRunner.manager.findOneBy(ContentType, { name: 'pdf' }),
        total_likes: 6,
        company: createdCompany2,
      }),
    ),
    queryRunner.manager.save(
      queryRunner.manager.create(Content, {
        id: '6969d6c7-40ea-4a3c-b635-d6546b971304',
        title: 'Plataforma de Aprendizado Online',
        description: 'Acesse este link para cursos e treinamentos de tecnologia.',
        url: 'https://learning.rocks',
        cover: null,
        contentType: await queryRunner.manager.findOneBy(ContentType, { name: 'link' }),
        total_likes: 8,
        company: createdCompany1,
      }),
    ),
    queryRunner.manager.save(
      queryRunner.manager.create(Content, {
        id: 'd060ab17-c961-4de7-929f-a0d52aa3ecf4',
        title: 'Inteligência Artificial',
        description: null,
        url: 'http://localhost:3000/uploads/video1.mp4',
        cover: 'http://localhost:3000/uploads/video1-cover.jpg',
        contentType: await queryRunner.manager.findOneBy(ContentType, { name: 'video' }),
        total_likes: 10,
        company: createdCompany1,
      }),
    ),
  ])

  await queryRunner.release()
  process.exit(0)
}

AppDataSource.initialize()
  .then(() => seedDatabase(AppDataSource))
  .catch((err) => console.error('Error seeding database:', err))
