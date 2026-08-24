# Feature Checklist — GymGear App

This file lists remaining features, their current status, and notes or related files to inspect.

- [x] Verify profile follower display and fix UI
  - Status: completed
  - Notes: Updated `SocialSidebarRight.tsx` with real follower ranking, `toggleFollowUser` & `getTopUsersByFollowers`.

- [x] Fix follow/unfollow edge cases and counts
  - Status: completed
  - Notes: `toggleFollowUser()` in `src/lib/supabaseDB.ts` implemented; profile follow button updated.

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
  - File: `SUPABASE_SETUP.sql`.

- [x] Add API route for repost toggle
  - Status: completed
  - File: `src/app/api/repost/route.ts`.

- [x] Add light theme and improve contrast across app
  - Status: completed
  - Notes: `src/app/globals.css` updated with scrollbars, navbar transparency, modal overlays, inputs, and button overrides.

- [x] Replace navbar logo and swap by theme; make clickable
  - Status: completed
  - Files: `src/components/Navbar.tsx`, `public/LogoGymGear.png`, `public/LogoGymGearDark.png`.

- [x] Remove extra icon near logo
  - Status: completed

- [x] Update footer: logo, contact info, slogan
  - Status: completed
  - File: `src/components/Footer.tsx`.

- [x] Make left sidebar 'Bài Viết Đã Lưu', 'Showroom' và 'Hội Chủ Phòng Gym' clickable
  - Status: completed
  - Files: `src/components/SocialSidebarLeft.tsx`, `src/app/showroom/page.tsx`, `src/app/community/page.tsx`.

- [x] Stories feature (Instagram-style 24h stories strip + full viewer modal)
  - Status: completed
  - Files: `src/components/StoriesBar.tsx`, `src/components/StoryViewer.tsx`, `src/app/api/stories/[id]/route.ts`, `SUPABASE_SETUP.sql`.

- [ ] Badges / awards system
  - Status: not-started

- [ ] Chatbot integration
  - Status: not-started

