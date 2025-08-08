-- Create name_parts table for username generation
CREATE TABLE public.name_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('adjective', 'noun')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert adjectives
INSERT INTO public.name_parts (word, type) VALUES
('Alluring', 'adjective'), ('Captivating', 'adjective'), ('Charming', 'adjective'), ('Daring', 'adjective'), ('Dazzling', 'adjective'),
('Dreamy', 'adjective'), ('Enchanting', 'adjective'), ('Enticing', 'adjective'), ('Exotic', 'adjective'), ('Fierce', 'adjective'),
('Flirty', 'adjective'), ('Gorgeous', 'adjective'), ('Hot', 'adjective'), ('Hypnotic', 'adjective'), ('Irresistible', 'adjective'),
('Kinky', 'adjective'), ('Luscious', 'adjective'), ('Lusty', 'adjective'), ('Magnetic', 'adjective'), ('Mysterious', 'adjective'),
('Naughty', 'adjective'), ('Passionate', 'adjective'), ('Playful', 'adjective'), ('Provocative', 'adjective'), ('Radiant', 'adjective'),
('Ravishing', 'adjective'), ('Seductive', 'adjective'), ('Sensual', 'adjective'), ('Sexy', 'adjective'), ('Sizzling', 'adjective'),
('Smoking', 'adjective'), ('Spicy', 'adjective'), ('Steamy', 'adjective'), ('Stunning', 'adjective'), ('Sultry', 'adjective'),
('Tantalizing', 'adjective'), ('Tempting', 'adjective'), ('Thrilling', 'adjective'), ('Wild', 'adjective'), ('Wicked', 'adjective'),
('Blazing', 'adjective'), ('Burning', 'adjective'), ('Electric', 'adjective'), ('Forbidden', 'adjective'), ('Hypnotizing', 'adjective'),
('Intoxicating', 'adjective'), ('Mesmerizing', 'adjective'), ('Mystical', 'adjective'), ('Sinful', 'adjective'), ('Smoldering', 'adjective'),
('Bewitching', 'adjective'), ('Breathtaking', 'adjective'), ('Dangerous', 'adjective'), ('Delicious', 'adjective'), ('Electrifying', 'adjective'),
('Erotic', 'adjective'), ('Flaming', 'adjective'), ('Glamorous', 'adjective'), ('Heavenly', 'adjective'), ('Intense', 'adjective'),
('Lavish', 'adjective'), ('Luxurious', 'adjective'), ('Magnificent', 'adjective'), ('Ornate', 'adjective'), ('Powerful', 'adjective'),
('Pristine', 'adjective'), ('Regal', 'adjective'), ('Sophisticated', 'adjective'), ('Supreme', 'adjective'), ('Untamed', 'adjective'),
('Velvet', 'adjective'), ('Vivacious', 'adjective'), ('Wanton', 'adjective'), ('Yearning', 'adjective'), ('Zesty', 'adjective'),
('Bold', 'adjective'), ('Brazen', 'adjective'), ('Cheeky', 'adjective'), ('Clever', 'adjective'), ('Cunning', 'adjective'),
('Fearless', 'adjective'), ('Feisty', 'adjective'), ('Frisky', 'adjective'), ('Impish', 'adjective'), ('Mischievous', 'adjective'),
('Nimble', 'adjective'), ('Quick', 'adjective'), ('Sassy', 'adjective'), ('Sharp', 'adjective'), ('Slick', 'adjective'),
('Smart', 'adjective'), ('Smooth', 'adjective'), ('Snappy', 'adjective'), ('Swift', 'adjective'), ('Witty', 'adjective'),
('Amber', 'adjective'), ('Bronze', 'adjective'), ('Crimson', 'adjective'), ('Golden', 'adjective'), ('Ivory', 'adjective'),
('Jade', 'adjective'), ('Onyx', 'adjective'), ('Pearl', 'adjective'), ('Ruby', 'adjective'), ('Sapphire', 'adjective'),
('Silver', 'adjective'), ('Emerald', 'adjective'), ('Diamond', 'adjective'), ('Platinum', 'adjective'), ('Copper', 'adjective'),
('Midnight', 'adjective'), ('Dawn', 'adjective'), ('Sunset', 'adjective'), ('Starlight', 'adjective'), ('Moonlit', 'adjective');

-- Insert nouns
INSERT INTO public.name_parts (word, type) VALUES
('Angel', 'noun'), ('Badger', 'noun'), ('Bear', 'noun'), ('Bunny', 'noun'), ('Butterfly', 'noun'),
('Cat', 'noun'), ('Cheetah', 'noun'), ('Cougar', 'noun'), ('Deer', 'noun'), ('Dolphin', 'noun'),
('Dragon', 'noun'), ('Eagle', 'noun'), ('Falcon', 'noun'), ('Fox', 'noun'), ('Gazelle', 'noun'),
('Hawk', 'noun'), ('Jaguar', 'noun'), ('Kitten', 'noun'), ('Leopard', 'noun'), ('Lion', 'noun'),
('Lioness', 'noun'), ('Lynx', 'noun'), ('Panther', 'noun'), ('Phoenix', 'noun'), ('Puma', 'noun'),
('Raven', 'noun'), ('Shark', 'noun'), ('Stallion', 'noun'), ('Swan', 'noun'), ('Tiger', 'noun'),
('Tigress', 'noun'), ('Unicorn', 'noun'), ('Vixen', 'noun'), ('Wolf', 'noun'), ('Wolverine', 'noun'),
('Cobra', 'noun'), ('Python', 'noun'), ('Viper', 'noun'), ('Scorpion', 'noun'), ('Spider', 'noun'),
('Mantis', 'noun'), ('Bee', 'noun'), ('Hornet', 'noun'), ('Wasp', 'noun'), ('Dragonfly', 'noun'),
('Firefly', 'noun'), ('Moth', 'noun'), ('Beetle', 'noun'), ('Ant', 'noun'), ('Cricket', 'noun'),
('Rose', 'noun'), ('Lily', 'noun'), ('Orchid', 'noun'), ('Tulip', 'noun'), ('Jasmine', 'noun'),
('Lavender', 'noun'), ('Violet', 'noun'), ('Iris', 'noun'), ('Poppy', 'noun'), ('Daisy', 'noun'),
('Sunflower', 'noun'), ('Peony', 'noun'), ('Camellia', 'noun'), ('Magnolia', 'noun'), ('Hibiscus', 'noun'),
('Flame', 'noun'), ('Fire', 'noun'), ('Ember', 'noun'), ('Spark', 'noun'), ('Blaze', 'noun'),
('Lightning', 'noun'), ('Thunder', 'noun'), ('Storm', 'noun'), ('Hurricane', 'noun'), ('Tornado', 'noun'),
('Comet', 'noun'), ('Star', 'noun'), ('Moon', 'noun'), ('Sun', 'noun'), ('Galaxy', 'noun'),
('Nova', 'noun'), ('Meteor', 'noun'), ('Planet', 'noun'), ('Constellation', 'noun'), ('Aurora', 'noun'),
('Diamond', 'noun'), ('Ruby', 'noun'), ('Emerald', 'noun'), ('Sapphire', 'noun'), ('Pearl', 'noun'),
('Opal', 'noun'), ('Jade', 'noun'), ('Onyx', 'noun'), ('Amber', 'noun'), ('Crystal', 'noun'),
('Jewel', 'noun'), ('Treasure', 'noun'), ('Crown', 'noun'), ('Throne', 'noun'), ('Scepter', 'noun'),
('Blade', 'noun'), ('Arrow', 'noun'), ('Bow', 'noun'), ('Shield', 'noun'), ('Sword', 'noun'),
('Dagger', 'noun'), ('Spear', 'noun'), ('Lance', 'noun'), ('Axe', 'noun'), ('Hammer', 'noun');

-- Update the generate_username function to use the table
CREATE OR REPLACE FUNCTION public.generate_username()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  random_adjective TEXT;
  random_noun TEXT;
  new_username TEXT;
  counter INTEGER := 1;
BEGIN
  -- Get random adjective
  SELECT word INTO random_adjective 
  FROM public.name_parts 
  WHERE type = 'adjective' 
  ORDER BY RANDOM() 
  LIMIT 1;
  
  -- Get random noun
  SELECT word INTO random_noun 
  FROM public.name_parts 
  WHERE type = 'noun' 
  ORDER BY RANDOM() 
  LIMIT 1;
  
  -- Combine adjective and noun
  new_username := random_adjective || ' ' || random_noun;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) LOOP
    new_username := random_adjective || ' ' || random_noun || ' ' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN new_username;
END;
$function$;