-- ============================================================================
-- ThreadIt â€” MANUAL full setup (schema + sample data)
--
-- Paste this whole file into the Supabase SQL Editor (SQL Studio) and Run.
-- It is self-contained and idempotent: creates every table/enum/index/FK if
-- missing, then inserts Reddit-style sample data with backdated timestamps.
-- Safe to re-run.
--
-- (This mirrors prisma/migrations/00000000000000_init + prisma/seed.sql, but
--  packaged for manual execution so you never need the Prisma CLI.)
-- ============================================================================

BEGIN;

-- =========================== SCHEMA =========================================

-- Enum (guarded â€” CREATE TYPE has no IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VoteType') THEN
    CREATE TYPE "VoteType" AS ENUM ('Upvote', 'Downvote');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "email" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailVerified" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "access_token" TEXT,
    "expiresAt" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "banner" TEXT,
    "profile" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postImage" TEXT,
    "postOwnerId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT,
    "userId" TEXT NOT NULL,
    "commentId" TEXT,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Vote" (
    "id" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "_CommunityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "Comment_id_key" ON "Comment"("id");
CREATE UNIQUE INDEX IF NOT EXISTS "Vote_id_key" ON "Vote"("id");
CREATE UNIQUE INDEX IF NOT EXISTS "Vote_userId_postId_commentId_key" ON "Vote"("userId", "postId", "commentId");
CREATE UNIQUE INDEX IF NOT EXISTS "_CommunityToUser_AB_unique" ON "_CommunityToUser"("A", "B");
CREATE INDEX IF NOT EXISTS "_CommunityToUser_B_index" ON "_CommunityToUser"("B");

-- Foreign keys (guarded â€” ADD CONSTRAINT has no IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Account_userId_fkey') THEN
    ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Session_userId_fkey') THEN
    ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_postOwnerId_fkey') THEN
    ALTER TABLE "Post" ADD CONSTRAINT "Post_postOwnerId_fkey" FOREIGN KEY ("postOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_communityId_fkey') THEN
    ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_commentId_fkey') THEN
    ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_postId_fkey') THEN
    ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_userId_fkey') THEN
    ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Vote_userId_fkey') THEN
    ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Vote_postId_fkey') THEN
    ALTER TABLE "Vote" ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Vote_commentId_fkey') THEN
    ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_CommunityToUser_A_fkey') THEN
    ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_CommunityToUser_B_fkey') THEN
    ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

-- =========================== SAMPLE DATA ====================================

-- Users â€” passwords are bcrypt hashes of "password123" (demo only).
INSERT INTO "User" ("id", "name", "email", "image", "password", "createdAt", "emailVerified") VALUES
  ('usr_ada',     'ada_lovelace',   'ada@threadit.dev',     'https://i.pravatar.cc/150?img=5',  '$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2023-11-02 09:14:00', '2023-11-02 09:20:00'),
  ('usr_linus',   'linus_t',        'linus@threadit.dev',   'https://i.pravatar.cc/150?img=12', '$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2023-11-05 18:41:00', '2023-11-05 18:50:00'),
  ('usr_grace',   'grace_hopper',   'grace@threadit.dev',   'https://i.pravatar.cc/150?img=45', '$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2023-12-01 07:02:00', '2023-12-01 07:10:00'),
  ('usr_dennis',  'dennis_r',       'dennis@threadit.dev',  'https://i.pravatar.cc/150?img=33', '$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2024-01-15 22:30:00', '2024-01-15 22:35:00'),
  ('usr_margaret','margaret_h',     'margaret@threadit.dev','https://i.pravatar.cc/150?img=47', '$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2024-02-20 11:11:00', '2024-02-20 11:20:00'),
  ('usr_alan',    'alan_turing',    'alan@threadit.dev',    'https://i.pravatar.cc/150?img=8',  '$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2024-03-10 14:05:00', '2024-03-10 14:12:00'),
  ('usr_katherine','katherine_j',   'katherine@threadit.dev','https://i.pravatar.cc/150?img=16','$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2024-04-22 08:48:00', '2024-04-22 08:55:00'),
  ('usr_tim',     'tim_bl',         'tim@threadit.dev',     'https://i.pravatar.cc/150?img=51', '$2a$10$D8s5m4rZ2h3q0Xw2wq7cLuY0S6mJ9d7q3sVvJ0y7oQeH9m1u2v3W', '2024-05-30 19:23:00', '2024-05-30 19:30:00')
ON CONFLICT ("id") DO NOTHING;

-- Communities (subforums)
INSERT INTO "Community" ("id", "name", "description", "banner", "profile", "createdAt") VALUES
  ('com_programming', 'programming',
    'Computer programming discussion, news and questions. Be excellent to each other.',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80',
    '2023-11-03 10:00:00'),
  ('com_technology', 'technology',
    'Tech news, gadgets, and everything that runs on electricity.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&q=80',
    '2023-11-10 12:30:00'),
  ('com_gaming', 'gaming',
    'A subforum for (almost) anything related to games: video games, board games, card games, etc.',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80',
    '2023-12-05 09:15:00'),
  ('com_science', 'science',
    'The best place on ThreadIt to discuss and share peer-reviewed science.',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&q=80',
    '2024-01-20 08:00:00'),
  ('com_askthreadit', 'AskThreadIt',
    'Ask the community anything and everything. No stupid questions.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80',
    '2024-02-01 16:45:00'),
  ('com_webdev', 'webdev',
    'A community dedicated to all things web development: frontend, backend, and everything between.',
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80',
    '2024-03-15 11:00:00')
ON CONFLICT ("id") DO NOTHING;

-- Memberships â€” implicit m2m table "_CommunityToUser": A = Community.id, B = User.id
INSERT INTO "_CommunityToUser" ("A", "B") VALUES
  ('com_programming', 'usr_ada'), ('com_programming', 'usr_linus'), ('com_programming', 'usr_dennis'), ('com_programming', 'usr_grace'), ('com_programming', 'usr_tim'),
  ('com_technology',  'usr_linus'), ('com_technology', 'usr_margaret'), ('com_technology', 'usr_katherine'), ('com_technology', 'usr_tim'),
  ('com_gaming',      'usr_dennis'), ('com_gaming', 'usr_alan'), ('com_gaming', 'usr_katherine'),
  ('com_science',     'usr_grace'), ('com_science', 'usr_alan'), ('com_science', 'usr_katherine'), ('com_science', 'usr_margaret'),
  ('com_askthreadit', 'usr_ada'), ('com_askthreadit', 'usr_margaret'), ('com_askthreadit', 'usr_alan'), ('com_askthreadit', 'usr_grace'),
  ('com_webdev',      'usr_ada'), ('com_webdev', 'usr_tim'), ('com_webdev', 'usr_dennis')
ON CONFLICT ("A", "B") DO NOTHING;

-- Posts
INSERT INTO "Post" ("id", "heading", "content", "postImage", "postOwnerId", "communityId", "createdAt") VALUES
  ('post_rust_gc',
   'After 5 years of C++, I switched to Rust. Here is what surprised me.',
   'The borrow checker felt hostile for about two weeks, and then something clicked. I stopped fighting it and started designing around ownership. Whole classes of bugs I used to chase in valgrind simply vanished. Compile times are still rough on big crates though. What was your turning point?',
   'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=80',
   'usr_linus', 'com_programming', '2024-02-11 13:22:00'),
  ('post_tabs_spaces',
   'Hot take: tabs for indentation, spaces for alignment. Fight me.',
   'Tabs let every dev pick their own indent width without reformatting the file. Spaces keep alignment stable across widths. Using both, each for its job, is objectively correct and I am tired of pretending otherwise.',
   NULL,
   'usr_dennis', 'com_programming', '2024-03-02 21:40:00'),
  ('post_first_compiler',
   'I wrote my first compiler this weekend and I am buzzing',
   'It only targets a tiny stack VM and the error messages are garbage, but it parses, type-checks, and runs recursive fibonacci. Highly recommend the experience to anyone who wants to actually understand how languages work.',
   'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1000&q=80',
   'usr_ada', 'com_programming', '2024-04-18 10:05:00'),
  ('post_battery_breakthrough',
   'New solid-state battery claims 500 mile range and 10 minute charge',
   'The press release is heavy on adjectives and light on independent data, as always. Still, the cell chemistry paper behind it is legit. Curious whether this scales past the lab.',
   'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1000&q=80',
   'usr_margaret', 'com_technology', '2024-04-05 09:30:00'),
  ('post_phone_repair',
   'Right-to-repair just passed in another state. Slow but real progress.',
   'Manufacturers have to provide parts, tools, and manuals now. My cynical side says they will price the parts absurdly, but even a crack in the walled garden is worth celebrating.',
   NULL,
   'usr_katherine', 'com_technology', '2024-05-12 17:12:00'),
  ('post_indie_game',
   'Spent 3 years solo-developing this game and it launches tomorrow. AMA.',
   'Pixel-art metroidvania, hand-animated, roughly 12 hours of content. I quit my job for this and I am equal parts terrified and thrilled. Ask me anything about the grind.',
   'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
   'usr_alan', 'com_gaming', '2024-05-20 20:00:00'),
  ('post_backlog',
   'My backlog has 240 unplayed games. Send help.',
   'Every sale I tell myself "this is the one I will actually finish." Reader, I did not. How do you all decide what to play next?',
   NULL,
   'usr_dennis', 'com_gaming', '2024-06-01 14:33:00'),
  ('post_jwst_image',
   'JWST just imaged a galaxy from 300 million years after the Big Bang',
   'The light left this thing before Earth existed, before the Sun existed, when the universe was a toddler. Take a moment with that. Full-resolution data is on the archive now.',
   'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1000&q=80',
   'usr_grace', 'com_science', '2024-05-28 06:48:00'),
  ('post_sleep_study',
   'Large study links consistent sleep timing to lower mortality, more than duration',
   'Interesting nuance: going to bed at wildly different times seems worse than simply sleeping fewer but regular hours. Correlation caveats apply, but the effect size is notable.',
   NULL,
   'usr_katherine', 'com_science', '2024-06-14 08:20:00'),
  ('post_career_switch',
   'Is 34 too old to switch into software engineering?',
   'Currently a mechanical engineer, decent at math, been doing hobby Python for a year. Everyone online is 22 with a CS degree. Be honest with me.',
   NULL,
   'usr_margaret', 'com_askthreadit', '2024-06-20 12:00:00'),
  ('post_saved_money',
   'What is a small habit that quietly saved you a lot of money?',
   'Mine: a 48-hour rule before any purchase over $50. Half the time I forget I even wanted the thing. What is yours?',
   NULL,
   'usr_ada', 'com_askthreadit', '2024-07-02 19:15:00'),
  ('post_css_grid',
   'CSS Grid finally made me delete a thousand lines of flexbox hacks',
   'I resisted for years out of pure inertia. One afternoon of subgrid and template-areas later, my layout code is readable by an actual human. If you are still nesting flex containers 6 deep, this is your sign.',
   'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1000&q=80',
   'usr_tim', 'com_webdev', '2024-06-25 15:40:00'),
  ('post_framework_fatigue',
   'Framework fatigue is real. I shipped a whole app with just HTML, CSS and a sprinkle of JS.',
   'No build step, no node_modules black hole, loads in 40ms. Not every project needs a virtual DOM and a state management library the size of a small moon.',
   NULL,
   'usr_dennis', 'com_webdev', '2024-07-08 11:27:00')
ON CONFLICT ("id") DO NOTHING;

-- Top-level comments
INSERT INTO "Comment" ("id", "content", "postId", "userId", "commentId", "createdAt") VALUES
  ('cmt_rust_1', 'The moment it clicked for me was realizing lifetimes are just the compiler writing down what I already believed but never wrote out.', 'post_rust_gc', 'usr_ada', NULL, '2024-02-11 14:05:00'),
  ('cmt_rust_2', 'Compile times get much better with sccache and cargo check while iterating. Do not run full builds constantly.', 'post_rust_gc', 'usr_grace', NULL, '2024-02-11 15:20:00'),
  ('cmt_tabs_1', 'This is the only correct answer and the fact that it is controversial says a lot about our field.', 'post_tabs_spaces', 'usr_linus', NULL, '2024-03-02 22:10:00'),
  ('cmt_compiler_1', 'Congrats! The jump from "parses" to "type-checks" is the fun part. Wait until you add optimization passes.', 'post_first_compiler', 'usr_dennis', NULL, '2024-04-18 11:30:00'),
  ('cmt_battery_1', 'Every year we get the 500 mile 10 minute battery press release. I will believe it when I can buy one.', 'post_battery_breakthrough', 'usr_linus', NULL, '2024-04-05 10:15:00'),
  ('cmt_game_1', 'Wishlisted. How did you handle burnout over three years solo?', 'post_indie_game', 'usr_katherine', NULL, '2024-05-20 20:45:00'),
  ('cmt_jwst_1', 'Images like this recalibrate my sense of scale for about a week and then I go back to being annoyed at traffic.', 'post_jwst_image', 'usr_alan', NULL, '2024-05-28 07:30:00'),
  ('cmt_career_1', '34 is not old. I switched at 38 and I am now a senior. Your engineering background is an asset, not a liability.', 'post_career_switch', 'usr_grace', NULL, '2024-06-20 12:40:00'),
  ('cmt_career_2', 'The people who are 22 with a CS degree still cannot debug a race condition. Domain experience matters more than you think.', 'post_career_switch', 'usr_tim', NULL, '2024-06-20 13:05:00'),
  ('cmt_money_1', 'Cooking a big batch on Sunday. Cut my food spend in half and I eat better.', 'post_saved_money', 'usr_margaret', NULL, '2024-07-02 20:00:00'),
  ('cmt_grid_1', 'template-areas is the feature that finally sold my whole team on Grid. Layouts read like ASCII art.', 'post_css_grid', 'usr_ada', NULL, '2024-06-25 16:20:00')
ON CONFLICT ("id") DO NOTHING;

-- Nested replies (children of the above)
INSERT INTO "Comment" ("id", "content", "postId", "userId", "commentId", "createdAt") VALUES
  ('cmt_rust_1a', 'That is the best one-line description of lifetimes I have ever read. Stealing it.', 'post_rust_gc', 'usr_linus', 'cmt_rust_1', '2024-02-11 14:40:00'),
  ('cmt_rust_2a', 'sccache changed my life, seconded. Also mold as the linker if you are on Linux.', 'post_rust_gc', 'usr_dennis', 'cmt_rust_2', '2024-02-11 16:00:00'),
  ('cmt_tabs_1a', 'Counterpoint: a single formatter config ends the debate forever and nobody has to think about it again.', 'post_tabs_spaces', 'usr_ada', 'cmt_tabs_1', '2024-03-02 22:55:00'),
  ('cmt_game_1a', 'Honestly? Badly, at first. I started taking real weekends off around year two and my velocity actually went up.', 'post_indie_game', 'usr_alan', 'cmt_game_1', '2024-05-20 21:15:00'),
  ('cmt_career_1a', 'This is exactly what I needed to read today. Thank you, genuinely.', 'post_career_switch', 'usr_margaret', 'cmt_career_1', '2024-06-20 14:20:00')
ON CONFLICT ("id") DO NOTHING;

-- Post votes (commentId NULL for post votes)
INSERT INTO "Vote" ("id", "type", "userId", "postId", "commentId") VALUES
  ('vote_p01', 'Upvote',   'usr_ada',      'post_rust_gc',              NULL),
  ('vote_p02', 'Upvote',   'usr_grace',    'post_rust_gc',              NULL),
  ('vote_p03', 'Upvote',   'usr_dennis',   'post_rust_gc',              NULL),
  ('vote_p04', 'Downvote', 'usr_tim',      'post_rust_gc',              NULL),
  ('vote_p05', 'Upvote',   'usr_linus',    'post_tabs_spaces',          NULL),
  ('vote_p06', 'Downvote', 'usr_ada',      'post_tabs_spaces',          NULL),
  ('vote_p07', 'Upvote',   'usr_grace',    'post_first_compiler',       NULL),
  ('vote_p08', 'Upvote',   'usr_dennis',   'post_first_compiler',       NULL),
  ('vote_p09', 'Upvote',   'usr_linus',    'post_battery_breakthrough', NULL),
  ('vote_p10', 'Upvote',   'usr_katherine','post_battery_breakthrough', NULL),
  ('vote_p11', 'Upvote',   'usr_dennis',   'post_indie_game',           NULL),
  ('vote_p12', 'Upvote',   'usr_katherine','post_indie_game',           NULL),
  ('vote_p13', 'Upvote',   'usr_alan',     'post_jwst_image',           NULL),
  ('vote_p14', 'Upvote',   'usr_katherine','post_jwst_image',           NULL),
  ('vote_p15', 'Upvote',   'usr_margaret', 'post_jwst_image',           NULL),
  ('vote_p16', 'Upvote',   'usr_grace',    'post_career_switch',        NULL),
  ('vote_p17', 'Upvote',   'usr_tim',      'post_career_switch',        NULL),
  ('vote_p18', 'Upvote',   'usr_ada',      'post_css_grid',             NULL),
  ('vote_p19', 'Upvote',   'usr_dennis',   'post_css_grid',             NULL),
  ('vote_p20', 'Upvote',   'usr_tim',      'post_framework_fatigue',    NULL),
  ('vote_p21', 'Upvote',   'usr_margaret', 'post_saved_money',          NULL),
  ('vote_p22', 'Upvote',   'usr_alan',     'post_backlog',              NULL),
  ('vote_p23', 'Upvote',   'usr_grace',    'post_sleep_study',          NULL),
  ('vote_p24', 'Upvote',   'usr_ada',      'post_phone_repair',         NULL)
ON CONFLICT ("id") DO NOTHING;

-- Comment votes (postId NULL for comment votes)
INSERT INTO "Vote" ("id", "type", "userId", "postId", "commentId") VALUES
  ('vote_c01', 'Upvote', 'usr_linus',    NULL, 'cmt_rust_1'),
  ('vote_c02', 'Upvote', 'usr_dennis',   NULL, 'cmt_rust_1'),
  ('vote_c03', 'Upvote', 'usr_ada',      NULL, 'cmt_rust_2'),
  ('vote_c04', 'Upvote', 'usr_margaret', NULL, 'cmt_career_1'),
  ('vote_c05', 'Upvote', 'usr_ada',      NULL, 'cmt_career_1'),
  ('vote_c06', 'Upvote', 'usr_grace',    NULL, 'cmt_career_2'),
  ('vote_c07', 'Upvote', 'usr_katherine',NULL, 'cmt_jwst_1'),
  ('vote_c08', 'Upvote', 'usr_tim',      NULL, 'cmt_grid_1')
ON CONFLICT ("id") DO NOTHING;

COMMIT;
