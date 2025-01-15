# SecureFile - Secure File Scanning Platform

## 🚀 Overview

SecureFile is a secure file scanning platform that allows users to upload and analyze files for potential security threats using the VirusTotal API.

## 🌟 Key Features

- 🔒 **Secure File Upload:** Upload files up to 5MB for virus scanning
- 🦠 **Real-time Scanning:** Integration with VirusTotal API
- 📱 **User Dashboard:** View scan history and results
- 📊 **Detailed Reports:** Comprehensive scan results from multiple security vendors
- 👤 **Authentication:** Secure user authentication via Auth0

## 🛠️ Tech Stack

<p align="center">
    <img src="https://skillicons.dev/icons?i=ts,nextjs,react,prisma,postgresql,tailwind,aws,docker" />
</p>

### Core Technologies
- **Framework:** Next.js 14 (App Router)
  - Server-side rendering for optimal performance
  - App Router for simplified routing and layouts
  - API routes for backend functionality
  - TypeScript support for type safety

- **Frontend**
  - React 18 for component-based architecture
  - Tailwind CSS for responsive styling
  - Lucide Icons for consistent iconography
  - Shadcn UI components for enhanced UI elements

- **Backend & Database**
  - PostgreSQL (AWS RDS) for reliable data persistence
  - Prisma ORM for type-safe database operations
  - Auth0 for secure user authentication
  - VirusTotal API integration for file scanning

### Infrastructure
- **Containerization**
  - Docker for consistent development and deployment
  - Docker Compose for multi-container orchestration
  - Multi-stage builds for optimized production images

- **Cloud Services (AWS)**
  - EC2 for application hosting
  - RDS for managed database service
  - S3 for file storage (optional)
  - Route 53 for DNS management

### Development Tools
- **Version Control**
  - Git for source control
  - GitHub for repository hosting

- **Code Quality**
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript for static type checking

## 📁 Project Structure
```
├├── lib/                            # Core utilities and configurations
│   ├── prisma.ts                   # Prisma client configuration
│   └── services/                   # Service layer implementations
│       ├── user.ts                 # User management services
│       └── virustotal.ts           # VirusTotal API integration
│
├── prisma/                         # Database configuration
│   └── schema.prisma               # Database schema definition
│
├── public/                         # Static assets
│
├── src/app/                        # Next.js application routes
│   ├── api/                        # API route handlers
│   │   ├── auth/[auth0]           # Auth0 authentication endpoints
│   │   ├── protected/upload       # Protected file upload endpoint
│   │   ├── scans/                 # Scan-related endpoints
│   │   │   ├── [id]              # Individual scan operations
│   │   │   ├── check             # Scan status checking
│   │   │   └── history           # Scan history retrieval
│   │   ├── stats                 # Statistics endpoints
│   │   └── user                  # User management endpoints
│   │
│   ├── components/                # Reusable React components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── FileUpload.tsx    # File upload component
│   │   │   ├── ScanHistory.tsx   # Scan history display
│   │   │   ├── ScanResults.tsx   # Scan results display
│   │   │   └── Sidebar.tsx       # Dashboard sidebar
│   │   ├── AuthButtons.tsx       # Authentication buttons
│   │   ├── Hero.tsx             # Landing page hero section
│   │   ├── Logo.tsx             # Application logo
│   │   └── Navbar.tsx           # Navigation bar
│   │
│   ├── dashboard/                # Dashboard pages
│   │   ├── history/             # Scan history page
│   │   ├── scans/               # Individual scan pages
│   │   ├── layout.tsx           # Dashboard layout wrapper
│   │   └── page.tsx             # Dashboard main page
│   │
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Landing page
│   └── providers.tsx            # Application providers

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

## 🐳 Docker Setup

### Initial Setup
1. Clone the repository and switch to dockerisation branch:
```bash
git clone <repository-url>
cd securefile
git checkout dockerisation-client-side
```

### Prerequisites
- Docker
- Docker Compose

### Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://file_scanner_admin:your_password@postgres:5432/file_scanner

# Auth0 Configuration
AUTH0_SECRET=a_long_random_string
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
```

### VirusTotal API
```
VIRUSTOTAL_API_KEY=your_virustotal_api_key
```

### Build the development image
```
docker build -f Dockerfile.dev -t myapp-dev .
```
The development environment features:

- Hot reloading enabled
- Volume mounting for real-time code changes
- Development-specific optimizations
- Exposed port 3000 for local access


### Development Environment
### Build and Run Development Container

```
# Run the development container
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NODE_ENV=development \
  myapp-dev'

# Alternatively, using Docker Compose
docker-compose -f docker-compose.dev.yml up --build
```

### Production Environment
### Build and Run Prod Container

```
# Build the production image
docker build -f Dockerfile.prod -t myapp-prod .

# Run using Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```
The production environment includes:

- Production Ready Build of SecureFile
- Production-grade PostgreSQL


## 🌐 API Routes


### File Upload and Scanning
```typescript
POST /api/protected/upload
```
- **Purpose**: Upload file and initiate VirusTotal scan
- **Authentication**: Required
- **Request Body**: 
  ```typescript
  {
    file: File,      // File object (max 5MB)
    email: string    // User email
  }
  ```
- **Response**: 
  ```typescript
  {
    success: boolean,
    scanId: string,
    message: string
  }
  ```

### Scan Operations

#### Get Scan Details
```typescript
GET /api/scans/[id]/details
```
- **Purpose**: Retrieve detailed scan results
- **Authentication**: Required
- **Parameters**: 
  - `id`: Scan identifier
- **Response**:
  ```typescript
  {
    scan: {
      id: string,
      fileName: string,
      fileSize: number,
      status: string,
      createdAt: string
    },
    virusTotalData: Object | null
  }
  ```

#### Check Scan Status
```typescript
GET /api/scans/check
```
- **Purpose**: Check current status of a scan
- **Authentication**: Required
- **Query Parameters**:
  - `vtScanId`: VirusTotal scan ID
  - `dbId`: Database record ID
  - `email`: User email
- **Response**:
  ```typescript
  {
    status: 'COMPLETED' | 'PENDING',
    data: Object
  }
  ```

### User History and Stats

#### Get Scan History
```typescript
GET /api/scans/history
```
- **Purpose**: Retrieve user's scan history
- **Authentication**: Required
- **Query Parameters**:
  - `email`: User email
- **Response**:
  ```typescript
  {
    scans: Array<{
      id: string,
      fileName: string,
      status: string,
      createdAt: string
    }>
  }
  ```

#### Get User Stats
```typescript
GET /api/stats
```
- **Purpose**: Retrieve user's scanning statistics
- **Authentication**: Required
- **Query Parameters**:
  - `email`: User email
- **Response**:
  ```typescript
  {
    totalScans: number,
    threatsDetected: number,
    lastScanDate: string
  }
  ```

### User Management

#### Upsert User
```typescript
POST /api/user/upsert
```
- **Purpose**: Create or update user record
- **Authentication**: Required
- **Request Body**:
  ```typescript
  {
    email: string,
    name?: string
  }
  ```
- **Response**: User object

### Error Responses
All endpoints may return the following error structures:
```typescript
{
  error: string,
  status: number
}
```

Common status codes:
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized
- `404`: Resource Not Found
- `413`: Payload Too Large (file size exceeds limit)
- `500`: Internal Server Error

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
  scanId        String?     // Made optional since it's only available after successful scan
  status        ScanStatus  @default(PENDING)
  user          User        @relation(fields: [userId], references: [id])
  userId        String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([userId])
  @@index([scanId])
  @@index([createdAt])
  @@index([status])
}

enum ScanStatus {
  PENDING
  SCANNING
  COMPLETED
  ERROR
}
```

## AWS Architecture

<p align="center">
 <img src="./public/archi.png" alt="AWS Architecture">
</p>

The application is deployed on AWS using a secure and scalable architecture:

### Infrastructure Components

#### VPC (Virtual Private Cloud)
- Custom VPC for isolated network environment
- Split into public and private subnets for security
- Private subnet hosts sensitive resources like database
- Public subnet contains application server

#### EC2 Instance (T2)
- Hosted in public subnet
- Runs the Next.js application
- Docker containers for application and dependencies 
- Auto-scaling configuration based on demand

#### RDS PostgreSQL
- Hosted in private subnet for security
- Managed PostgreSQL database service
- Automated backups and maintenance
- Encrypted at rest and in transit

#### Network Security
- ENI (Elastic Network Interface) for network management
- Security groups controlling inbound/outbound traffic
- Private subnet accessible only through VPC
- Public subnet exposed via internet gateway

## Design Decisions & Future Roadmap 🚀

<div align="center">

### Why These Choices? 🤔

</div>

My journey in building SecureFile involved several key architectural and technical decisions that shaped the current implementation. Let me dive into the reasoning behind my choices and vision for the future.

### Framework Selection 🔧
I chose Next.js as my primary framework, leveraging its powerful features that combine frontend and backend capabilities in a single package. My decision was driven by its integrated approach to handling APIs and frontend components, eliminating the need for separate service implementations. The framework's flexibility in rendering strategies and excellent developer experience made it an ideal choice for rapid development.

### Infrastructure Decisions 📊
For my database needs, I opted for PostgreSQL hosted on AWS RDS rather than running it on EC2. This decision proved optimal as it offloaded database management responsibilities to AWS's managed service, providing automatic backups, better performance, and cost-effectiveness. The managed service approach allowed me to focus more on application development rather than database administration.

### Development Experience 🐳
I've containerized the entire application using Docker, making it environment-agnostic. Both development and production environments are containerized with different configurations, ensuring consistent behavior across various host machines and eliminating the "it works on my machine" syndrome.

<div align="center">

### Current Limitations 🚧

</div>

### Security & Authentication 🔓
Currently, the application runs over HTTP instead of HTTPS. This limitation exists because I haven't implemented a domain for the Application Load Balancer, which is necessary for enabling HTTPS on the Elastic Network Interface attached to my EC2 instance. While the ENI has an Elastic IP and IPv4 resolvable DNS name, I chose this approach for demonstration simplicity.

### Auth0 Integration Challenges 🔄
My authentication journey has been interesting. I initially started with Next.js 15 but encountered breaking changes in dynamic route handling and cookie management. The stable release of Auth0 hadn't caught up with these changes, forcing me to revert to Next.js 14. While I initially implemented server-rendered pages with protected routing, production incompatibilities with Auth0 led me to adopt client-side authentication and rendering to maintain development velocity.

<div align="center">

### Future Improvements 🎯

</div>

### Development Pipeline 🔨
A notable absence in my current setup is a CI/CD workflow. While GitHub Actions would be an excellent addition for automated testing and deployment, I had to balance implementation time against other critical features. This is a prime candidate for future enhancement.

### Known Issues and Solutions 🐛
My production Docker environment has some network interface issues that require debugging. Additionally, the API routes aren't fully protected due to Auth0 limitations with the latest Next.js versions. Once Auth0 releases updates compatible with recent Next.js changes, I can implement more robust security measures.

### The Road Ahead 🚀
My future improvements will focus on:
- Implementing HTTPS security
- Building a robust CI/CD pipeline
- Enhancing authentication mechanisms
- Fixing Docker networking issues
- Adding load balancing capabilities
- Implementing auto-scaling features

<div align="center">

### Final Thoughts 💭

</div>

As a developer, I've learned that development is often about making pragmatic choices and balancing ideal solutions against practical constraints. While my current implementation prioritizes functionality and user experience, I've left room for future enhancements. I've focused on delivering a solid foundation that I can iteratively improve.