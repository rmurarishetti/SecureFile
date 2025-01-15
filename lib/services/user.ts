// lib/services/user.ts
import { prisma } from '../prisma'
import type { Prisma, User, FileScan } from '@prisma/client'

/**
* Type definition for Auth0 user data
*/
type Auth0User = {
  email: string;
  name?: string;
}

/**
* Creates or updates a user record based on Auth0 credentials
* Includes recent file scans in the response
* 
* @param email - User's email address
* @param name - Optional user name
* @returns User record with recent file scans
*/
export async function getOrCreateUser({ email, name }: Auth0User) {
  try {
    const user = await prisma.user.upsert({
      where: { 
        email: email 
      },
      update: {
        name: name || undefined,
      },
      create: {
        email: email,
        name: name || undefined,
      },
      include: {
        fileScans: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error)
    throw error;
  }
}

/**
* Retrieves a user by email with their recent file scans
* 
* @param email - User's email address
* @returns User record with recent file scans or null
*/
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        fileScans: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
* Retrieves paginated file scans for a user
* Supports optional status filtering
* 
* @param userId - User's ID
* @param page - Page number (default: 1)
* @param limit - Items per page (default: 10)
* @param status - Optional status filter
* @returns Paginated file scans with metadata
*/
export async function getUserFiles(
  userId: string, 
  page = 1, 
  limit = 10,
  status?: string
) {
  try {
    const where = {
      userId
    } as Prisma.FileScanWhereInput;

    // Add status filter if provided
    if (status) {
      where.status = status as FileScan['status'];
    }

    const [files, total] = await Promise.all([
      prisma.fileScan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          fileName: true,
          fileSize: true,
          status: true,
          scanId: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.fileScan.count({ where })
    ]);

    return {
      files,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error('Error in getUserFiles:', error)
    throw error;
  }
}

/**
* Interface for user statistics
*/
interface UserStats {
  total: number;
  pending: number;
  completed: number;
  error: number;
  [key: string]: number; // Add index signature for string keys
}

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const stats = await prisma.fileScan.groupBy({
      by: ['status'],
      where: {
        userId
      },
      _count: true
    });

    const defaultStats: UserStats = {
      total: 0,
      pending: 0,
      completed: 0,
      error: 0
    };

    return stats.reduce((acc, curr) => {
      const status = curr.status.toLowerCase() as keyof UserStats;
      acc[status] = curr._count;
      acc.total += curr._count;
      return acc;
    }, defaultStats);
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

// Added function for getting a single file scan
export async function getFileScan(id: string, userId: string) {
  try {
    return await prisma.fileScan.findFirst({
      where: {
        id,
        userId
      }
    });
  } catch (error) {
    console.error('Error getting file scan:', error);
    throw error;
  }
}