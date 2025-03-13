import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Verify user authentication
    const user = await auth();
    if (!user) {
      console.log('Authentication failed: No user found');
      return NextResponse.json({ error: 'Please log in to create an event' }, { status: 401 });
    }

    console.log('Authenticated user:', { id: user.id, email: user.email });

    const formData = await req.formData();
    
    // Log received form data
    const formDataObj = Object.fromEntries(formData.entries());
    console.log('Received form data:', formDataObj);
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'price', 'capacity'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
      console.log('Validation failed: Missing fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Extract and validate event data
    const price = parseFloat(formData.get('price') as string);
    const capacity = parseInt(formData.get('capacity') as string);

    if (isNaN(price) || price < 0) {
      console.log('Validation failed: Invalid price value', { price });
      return NextResponse.json(
        { error: 'Price must be a non-negative number' },
        { status: 400 }
      );
    }

    if (isNaN(capacity) || capacity < 1) {
      console.log('Validation failed: Invalid capacity value', { capacity });
      return NextResponse.json(
        { error: 'Capacity must be a positive number' },
        { status: 400 }
      );
    }

    // Prepare event data
    const eventData = {
      title: formData.get('title'),
      description: formData.get('description'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      type: formData.get('type') || 'public',
      tier: formData.get('tier') || 'silver',
      price,
      capacity,
      logistics_phone: formData.get('logisticsPhone'),
      user_id: user.id,
    };

    console.log('Creating event with data:', eventData);

    // Create event in database
    try {
      const result = await db.query(
        `INSERT INTO events (
          title, description, date, time, location, type, tier,
          price, capacity, logistics_phone, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventData.title,
          eventData.description,
          eventData.date,
          eventData.time,
          eventData.location,
          eventData.type,
          eventData.tier,
          eventData.price,
          eventData.capacity,
          eventData.logistics_phone,
          eventData.user_id,
        ]
      );

      const eventId = result.insertId;
      console.log('Event created successfully:', { eventId });

      // Handle image uploads
      const images = [];
      for (let [key, value] of formData.entries()) {
        if (key.startsWith('image')) {
          const file = value as File;
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Create a unique filename
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
          const extension = path.extname(file.name);
          const filename = `event-${eventId}-${uniqueSuffix}${extension}`;
          
          // Save file to public/uploads directory
          const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
          await writeFile(filepath, buffer);
          
          // Store the public URL in the database
          const imageUrl = `/uploads/${filename}`;
          
          try {
            await db.query(
              `INSERT INTO event_images (event_id, image_url)
               VALUES (?, ?)`,
              [eventId, imageUrl]
            );
            images.push(imageUrl);
            console.log('Image saved:', { eventId, imageUrl });
          } catch (error) {
            console.error('Error saving image:', error);
            // Continue with other images if one fails
          }
        }
      }

      return NextResponse.json({
        success: true,
        eventId,
        message: 'Event created successfully',
        images
      });

    } catch (dbError: any) {
      console.error('Database error:', {
        error: dbError.message,
        code: dbError.code,
        eventData
      });
      
      if (dbError.code === 'ER_NO_REFERENCED_ROW_2') {
        return NextResponse.json(
          { error: 'Invalid user ID. Please log in again.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to save event to database. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error creating event:', {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 