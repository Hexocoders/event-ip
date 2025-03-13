-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Public events are viewable by everyone" 
ON events FOR SELECT 
USING (type = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own events" 
ON events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
ON events FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
ON events FOR DELETE 
USING (auth.uid() = user_id);

-- Event images policies
CREATE POLICY "Event images are viewable by everyone" 
ON event_images FOR SELECT 
USING (true);

CREATE POLICY "Users can add images to their events" 
ON event_images FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM events 
  WHERE events.id = event_images.event_id 
  AND events.user_id = auth.uid()
));

CREATE POLICY "Users can delete images from their events" 
ON event_images FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM events 
  WHERE events.id = event_images.event_id 
  AND events.user_id = auth.uid()
));

-- Tickets policies
CREATE POLICY "Users can view their purchased tickets" 
ON tickets FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = tickets.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can purchase tickets" 
ON tickets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Team members policies
CREATE POLICY "Team members are viewable by team owner" 
ON team_members FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add team members" 
ON team_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their team members" 
ON team_members FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove team members" 
ON team_members FOR DELETE 
USING (auth.uid() = user_id); 