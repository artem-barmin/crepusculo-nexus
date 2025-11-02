-- Create function to enforce single primary photo per user
CREATE OR REPLACE FUNCTION enforce_single_primary_photo()
RETURNS TRIGGER AS $$
BEGIN
  -- If this photo is being set as primary
  IF NEW.is_primary = true THEN
    -- Set all other photos for this user to non-primary
    -- Keep the current one (NEW) as primary
    UPDATE user_photos
    SET is_primary = false
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs after INSERT or UPDATE
CREATE TRIGGER ensure_single_primary_photo
  AFTER INSERT OR UPDATE OF is_primary ON user_photos
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION enforce_single_primary_photo();
