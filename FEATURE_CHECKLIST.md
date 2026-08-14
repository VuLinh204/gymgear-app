# Feature Checklist — GymGear App

This file lists remaining features, their current status, and notes or related files to inspect.

- [ ] Verify profile follower display and fix UI
  - Status: in-progress
  - Notes: Profile UI fetches `/api/follow` but the follower count may not reflect DB state in some cases. Check `src/app/user/[id]/page.tsx` and `src/app/api/follow/route.ts`.
 
- [x] Fix follow/unfollow edge cases and counts
  - Status: completed
  - Notes: `toggleFollowUser()` in `src/lib/supabaseDB.ts` implemented; profile follow button updated. Verify RLS in Supabase.

- [x] Add hover-profile popup component
  - Status: completed
  - Files: `src/components/AuthorPreview.tsx`, wired in `src/components/PostCard.tsx`.

- [x] Ensure author name shows immediately (no '...')
  - Status: completed
  - Files: `AuthorPreview` accepts `initialName`/`initialAvatar`.

- [x] Implement repost/share preserving original author
  - Status: completed (requires DB migration run in Supabase)
  - Files: `SUPABASE_SETUP.sql` (adds `reposts`), `src/lib/supabaseDB.ts` (toggleRepost, fetchPosts counting), `src/app/api/repost/route.ts`, `src/components/PostCard.tsx` (share button wiring).

- [x] Create `reposts` DB table and RLS policies
  - Status: completed
  - File: `SUPABASE_SETUP.sql` (run this in Supabase SQL editor if not already applied).

- [x] Add API route for repost toggle
  - Status: completed
  - File: `src/app/api/repost/route.ts`

- [ ] Add light theme and improve contrast across app
  - Status: not-started / partial
  - Notes: Some global CSS variables exist (`src/app/globals.css`) but many Tailwind utilities still hard-code colors. Plan: audit common components and migrate to CSS variables or Tailwind config.

- [x] Replace navbar logo and swap by theme; make clickable
  - Status: completed
  - Files: `src/components/Navbar.tsx`, `public/LogoGymGear.png`, `public/LogoGymGearDark.png`

- [x] Remove extra icon near logo
  - Status: completed

- [x] Update footer: logo, contact info, slogan
  - Status: completed
  - File: `src/components/Footer.tsx`

- [x] Make left sidebar 'Bài Viết Đã Lưu' clickable
  - Status: completed
  - File: `src/components/SocialSidebarLeft.tsx`

- [ ] Stories feature (design + implementation)
  - Status: not-started

- [ ] Badges / awards system
  - Status: not-started

- [ ] Chatbot integration
  - Status: not-started

- [x] Push changes to GitHub with conventional commits
  - Status: completed

If you want, I can:
- continue and fix the profile follower display now (I will reproduce the flow, add logging in `src/app/api/follow/route.ts` and `src/lib/supabaseDB.ts`, and patch any mismatch), or
- open a PR with this checklist and request your review.
