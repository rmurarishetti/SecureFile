// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const virusTotalResponse = {
  "data": {
    "attributes": {
      "status": "completed",
      "stats": {
        "malicious": 0,
        "suspicious": 0,
        "undetected": 66,
        "harmless": 0
      },
      "results": {
        "Bitdefender": {
          "category": "undetected",
          "engine_name": "Bitdefender",
          "result": null
        },
        "Kaspersky": {
          "category": "undetected",
          "engine_name": "Kaspersky",
          "result": null
        },
        "McAfee": {
          "category": "undetected",
          "engine_name": "McAfee",
          "result": null
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike Falcon",
          "result": "malicious"
        },
        "Symantec": {
          "category": "suspicious",
          "engine_name": "Symantec",
          "result": "suspicious"
        }
      }
    }
  },
  "meta": {
    "file_info": {
      "size": 13946,
      "md5": "e7a3021779ce48df7fc34995f9d71e04",
      "sha1": "2796c923c381271cabc06cfcf217c5e435deda55",
      "sha256": "ff4e79f9b32eca0beabcc376f07723815d8c8ff06832f067f3445f7f871c54c9"
    }
  }
}

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@email.com',
      name: 'Test User',
    },
  })

  // Create some file scans
  await prisma.fileScan.createMany({
    data: [
      {
        userId: user.id,
        fileName: 'test-file-1.pdf',
        fileSize: 1024 * 1024, // 1MB
        scanId: 'scan-123',
        status: 'COMPLETED',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        userId: user.id,
        fileName: 'suspicious-file.exe',
        fileSize: 2.5 * 1024 * 1024, // 2.5MB
        scanId: 'scan-456',
        status: 'COMPLETED',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
      },
      {
        userId: user.id,
        fileName: 'important-doc.docx',
        fileSize: 512 * 1024, // 512KB
        scanId: 'scan-789',
        status: 'PENDING',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      }
    ]
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })