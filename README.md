# SecureFile - File Scanning Platform

<p align="center">
    <img src="https://skillicons.dev/icons?i=ts,nextjs,react,prisma,postgresql,tailwind,aws" />
</p>

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Authentication:** Auth0
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Deployment:** AWS EC2
- **API Integration:** VirusTotal API
- **UI Components:** Custom components with Lucide Icons

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── scan/
│   ├── dashboard/
│   │   ├── history/
│   │   ├── scans/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── FileUpload.tsx
│   │   ├── ScanHistory.tsx
│   │   ├── ScanResults.tsx
│   │   └── Sidebar.tsx
│   └── ui/
├── lib/
│   ├── prisma.ts
│   └── services/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── public/
```

## 🛠️ Installation Steps

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# .env.local
DATABASE_URL=
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
VIRUSTOTAL_API_KEY=
```

4. Run Prisma migrations
```bash
npx prisma migrate dev
```

5. Seed the database
```bash
npx prisma db seed
```

6. Start the development server
```bash
npm run dev
```

## 🌟 Features

- **Secure File Upload:** Upload files up to 5MB for virus scanning
- **Real-time Scanning:** Integration with VirusTotal API
- **User Dashboard:** View scan history and results
- **Detailed Reports:** Comprehensive scan results from multiple security vendors
- **Authentication:** Secure user authentication via Auth0
- **Responsive Design:** Works on desktop and mobile devices

## 📊 Database Schema

```prisma
model User {
  id            String      @id @default(uuid())
  email         String      @unique
  name          String?
  fileScans     FileScan[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model FileScan {
  id            String      @id @default(uuid())
  fileName      String
  fileSize      Int
  scanId        String?
  status        ScanStatus  @default(PENDING)
  user          User        @relation(fields: [userId], references: [id])
  userId        String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum ScanStatus {
  PENDING
  SCANNING
  COMPLETED
  ERROR
}
```

## 🌐 API Routes

- `POST /api/scan` - Upload and scan a file
- `GET /api/scan/:id` - Get scan results
- `GET /api/scan/history` - Get user's scan history

## 🔐 Security Features

- File size limitation (5MB max)
- Secure file handling
- Auth0 authentication
- API rate limiting
- Secure environment variables

## 🚀 Deployment

The application is deployed on AWS EC2:

1. Set up EC2 instance
2. Configure security groups
3. Install dependencies
4. Set up PostgreSQL database
5. Configure Nginx
6. Set up PM2 for process management

## 📝 Development Notes

- Uses Next.js App Router for routing
- Implements server-side rendering for better performance
- Optimized for t2.micro instances
- Implements proper error handling
- Uses Prisma for type-safe database queries

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.