// lib/services/user.ts
import { prisma } from '../prisma'

export async function getOrCreateUser(auth0User: { 
  sub: string, 
  email: string,
  name?: string 
}) {
  try {
    // Try to find existing user
    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0User.sub }
    })

    if (user) {
      return user
    }

    // Create new user if not found
    return await prisma.user.create({
      data: {
        auth0Id: auth0User.sub,
        email: auth0User.email,
        name: auth0User.name
      }
    })
  } catch (error) {
    console.error('Error in getOrCreateUser:', error)
    throw error
  }
}

export async function getUserFiles(userId: string, page = 1, limit = 10) {
  try {
    const [files, total] = await Promise.all([
      prisma.fileScan.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit
      }),
      prisma.fileScan.count({
        where: { userId }
      })
    ])

    return {
      files,
      total,
      pages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Error in getUserFiles:', error)
    throw error
  }
}