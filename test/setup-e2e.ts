import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

const prisma = new PrismaClient()
const randomSchemaId = randomUUID()

const generateDatabaseUrl = (schemaId: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is already defined')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

beforeAll(async () => {
  const urlDataBase = generateDatabaseUrl(randomSchemaId)
  process.env.DATABASE_URL = urlDataBase

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${randomSchemaId}" CASCADE`,
  )
  await prisma.$disconnect()
})
