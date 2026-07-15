# 🛟 RescueLink — Client

The frontend for **RescueLink**, a disaster relief coordination platform that connects volunteers with active relief missions. Built with Next.js and TypeScript.

This is the client half of the project. See the companion [rescuelink-server](https://github.com/nilanjanajui/rescuelink-server) repo for the API.

---

## 🔗 Links

| | URL |
|---|---|
| **Live Site** | [your-deployed-url-here] |
| **Server Repo** | https://github.com/nilanjanajui/rescuelink-server |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **User** | `demo.user@rescuelink.org` | *(set in your `.env.local`)* |
| **Admin** | `demo.admin@rescuelink.org` | *(set in your `.env.local`)* |

Or use the **Demo Login (User)** / **Demo Login (Admin)** buttons on `/login`.

---

## ✨ Features

### Public
- **Landing page** — hero, how-it-works, featured missions, disaster categories, impact stats, testimonials, partners, newsletter signup
- **Explore missions** — search, filter (disaster type / urgency / status), sort (urgency / recency / volunteers needed), pagination, skeleton loaders
- **Mission details** — image gallery, overview, live recruitment progress, updates feed, related missions
- **About, Contact, Privacy Policy, Terms of Service**
- **Resource pages** — disaster manuals, impact reports, press kit, success stories

### Authentication
- Email/password login & registration with validation
- Google social login
- Demo login buttons (instant sign-in as user or admin)
- Role-based UI (user / admin / tenant)

### Protected (logged-in)
- **Dashboard** — posted missions, joined missions, and (for admins) platform-wide stats
- **Add Mission** (`/missions/add`)
- **Manage Missions** (`/missions/manage`) — view, mark resolved/reopen, delete; admin scope toggle for all missions
- **Profile** — account info, joined missions list

---

## 🛠 Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Better Auth (client)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # landing, explore, mission details, login/register, static pages
│   ├── (protected)/       # dashboard, missions/add, missions/manage, profile
│   └── api/auth/[...all]/ # Better Auth route handler
├── components/
│   ├── sections/          # homepage sections
│   ├── missions/          # mission card, join button, updates feed, related missions
│   ├── profile/           # joined missions list, sign out
│   ├── layout/            # navbar, footer
│   └── ui/                # button, card, input, modal, badge, skeleton
├── lib/                   # api client, auth client, formatting helpers
└── types/                 # shared TypeScript types
scripts/
└── seed-auth.ts           # seeds demo user/admin/org accounts via Better Auth
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.6+
- The [rescuelink-server](https://github.com/nilanjanajui/rescuelink-server) API running (locally or deployed)

### 1. Install
```bash
git clone https://github.com/nilanjanajui/rescuelink-client.git
cd rescuelink-client
npm install
```

### 2. Configure environment

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000

MONGO_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret

NEXT_PUBLIC_DEMO_USER_EMAIL=demo.user@rescuelink.org
NEXT_PUBLIC_DEMO_USER_PASSWORD=your_demo_user_password
NEXT_PUBLIC_DEMO_ADMIN_EMAIL=demo.admin@rescuelink.org
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=your_demo_admin_password
```

### 3. Seed demo accounts
```bash
npm run seed:auth
```
Creates the demo user, demo admin (promoted to `role: admin`), and three org-poster accounts used by the server's mission seed data.

### 4. Run
```bash
npm run dev
```
Visit **http://localhost:3000**.

> Make sure the server is running first (see the server README) so API calls succeed.

---

## 🔐 Roles

- **User** — post/manage own missions, join missions, view dashboard
- **Admin** — everything a user can, plus platform-wide stats and managing all missions
- **Tenant** — browse-only accounts, redirected away from posting/management routes

Protected routes are gated server-side (in a layout) — unauthenticated visitors are redirected to `/login`.

---

## 📄 License

Built for educational/demo purposes as part of a full-stack TypeScript assignment.
