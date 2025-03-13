import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// Get team members
export async function GET(req: Request) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const teamMembers = await db.query(
      `SELECT 
        tm.id,
        tm.member_email as email,
        tm.role,
        tm.status,
        tm.joined_date,
        COALESCE(u.full_name, '') as name
       FROM team_members tm
       LEFT JOIN users u ON u.email = tm.member_email
       WHERE tm.user_id = ?
       ORDER BY tm.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// Invite new team member
export async function POST(req: Request) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const existingMember = await db.query(
      'SELECT id FROM team_members WHERE user_id = ? AND member_email = ?',
      [user.id, email]
    );

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: 'Team member already exists' },
        { status: 400 }
      );
    }

    // Insert new team member
    const memberId = uuidv4();
    await db.query(
      `INSERT INTO team_members (id, user_id, member_email, role)
       VALUES (?, ?, ?, ?)`,
      [memberId, user.id, email, role]
    );

    // TODO: Send invitation email to the team member

    return NextResponse.json({
      message: 'Team member invited successfully',
      memberId
    });
  } catch (error) {
    console.error('Error inviting team member:', error);
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}

// Delete team member
export async function DELETE(req: Request) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('id');

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Check if the team member belongs to the user
    const member = await db.query(
      'SELECT id FROM team_members WHERE id = ? AND user_id = ?',
      [memberId, user.id]
    );

    if (member.length === 0) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Delete the team member
    await db.query(
      'DELETE FROM team_members WHERE id = ?',
      [memberId]
    );

    return NextResponse.json({
      message: 'Team member removed successfully'
    });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
} 