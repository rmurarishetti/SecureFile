// app/api/protected/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { virusTotal } from '../../../../../lib/services/virustotal';
import { prisma } from '../../../../../lib/prisma';

/**
* API Configuration
* force-dynamic: Disables caching for this route
* maxDuration: Sets maximum execution time to 60 seconds
*/
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
* File Upload API Endpoint
* Handles file uploads for virus scanning
* 
* @route POST /api/protected/upload
* @param request - Contains form data with file and email
* 
* @returns {Object} Response object
* @returns {boolean} response.success - Indicates if upload was successful
* @returns {string} response.scanId - ID of the created scan
* @returns {string} response.message - Status message
* 
* @throws {400} - Missing email, missing file, or file size exceeds limit
* @throws {404} - User not found
* @throws {500} - Server error during processing
*/
export async function POST(request: NextRequest) {
  try {
    // Handle file upload
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const email = formData.get('email') as string;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Create scan record in pending state
    const fileScan = await prisma.fileScan.create({
      data: {
        fileName: file.name,
        fileSize: file.size,
        status: 'PENDING',
        userId: user.id
      }
    });

    try {
      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Upload to VirusTotal
      const vtResponse = await virusTotal.uploadFile(buffer, file.name);

      // Update scan record with VirusTotal ID
      await prisma.fileScan.update({
        where: { id: fileScan.id },
        data: {
          scanId: vtResponse.scanId,
          status: 'SCANNING'
        }
      });

      return NextResponse.json({
        success: true,
        scanId: fileScan.id,
        message: 'File uploaded and scan initiated'
      });
    } catch (error) {
      // Update scan record to error state
      await prisma.fileScan.update({
        where: { id: fileScan.id },
        data: {
          status: 'ERROR'
        }
      });

      throw error;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}