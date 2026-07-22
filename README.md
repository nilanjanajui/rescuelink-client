# 🛟 RescueLink — Client

The frontend for **RescueLink**, a disaster relief coordination platform that connects volunteers with active relief missions. Built with Next.js 15 (App Router) and TypeScript.

This is the client half of the project. See the companion [rescuelink-server](https://github.com/nilanjanajui/rescuelink-server) repo for the API backend.

---

## 🔗 Links

| | URL |
|---|---|
| **Live Site** | https://rescuelink-client.vercel.app |
| **Live API** | https://rescuelink-server.onrender.com |
| **Server Repo** | https://github.com/nilanjanajui/rescuelink-server |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **User** | `demo.user@rescuelink.org` | *(set in your `.env.local`)* |
| **Admin** | `demo.admin@rescuelink.org` | *(set in your `.env.local`)* |

Or use the **Demo Login (User)** / **Demo Login (Admin)** buttons on `/login`.

---

## 🗺️ Application Page Routes (17 Pages)

### Public Routes
- 🏠 **Home Page** (`/`) — Hero, How It Works, Featured Missions, Impact Stats, Testimonials, Newsletter
- 🔍 **Explore Missions** (`/explore`) — Debounced search, filter by disaster/urgency/status, sort, Grid/Map toggle, pagination
- 📌 **Mission Details** (`/missions/[id]`) — Image gallery, live recruitment progress, updates timeline, volunteer join modal
- 🔑 **Login** (`/login`) — Email/password login, Google sign-in, instant Demo Login buttons
- 📝 **Register** (`/register`) — Account onboarding with role selection (`User`, `Admin`, `Tenant`) and skill tags
- ℹ️ **About Us** (`/about`) — Mission overview, core operational values, impact metrics, team advisors
- 📞 **Contact Us** (`/contact`) — Interactive contact form with category routing (`General`, `Partnership`, `Media`, `Emergency`)
- 🔒 **Privacy Policy** (`/privacy-policy`) — Data handling, encryption standards, volunteer privacy rights
- 📄 **Terms of Service** (`/terms-of-service`) — Platform guidelines, code of conduct, liability terms
- 📖 **Disaster Preparedness Manuals** (`/resources/disaster-manuals`) — Emergency readiness guides for Floods, Earthquakes, Fires, Cyclones
- 📊 **Impact Reports** (`/resources/impact-reports`) — Operations audits, supply statistics, annual performance metrics
- 📰 **Press Kit** (`/resources/press-kit`) — Media downloads, brand guidelines, logo assets, press contact
- ⭐ **Success Stories** (`/resources/success-stories`) — Case studies of completed operations and volunteer spotlights

### Protected Routes (Login Required)
- 📊 **Dashboard** (`/dashboard`) — Posted/joined mission counters, platform stats (Admins), recent activity, Admin verification queue
- ➕ **Add Mission** (`/missions/add`) — Post new disaster relief mission with location, urgency, needed skills, image URL
- ⚙️ **Manage Missions** (`/missions/manage`) — Active/Resolved status toggle, delete mission modal, Admin global view switch
- 👤 **User Profile** (`/profile`) — Account details, joined mission history timeline, logout action

---

## 🛠 Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Better Auth (client authentication)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Landing, explore, mission details, login/register, static pages, resources
│   ├── (protected)/       # Dashboard, missions/add, missions/manage, profile
│   └── api/auth/[...all]/ # Better Auth route handler
├── components/
│   ├── sections/          # Homepage sections (Hero, HowItWorks, FeaturedMissions, etc.)
│   ├── missions/          # Mission card, map view, join modal, updates feed, related missions
│   ├── profile/           # Joined missions list, user card
│   ├── layout/            # Navbar, footer
│   └── ui/                # Button, card, input, modal, badge, skeleton
├── lib/                   # API client, auth client, formatting helpers
└── types/                 # Shared TypeScript types
scripts/
└── seed-auth.ts           # Seeds demo user/admin/org accounts via Better Auth
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
```env
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
Creates the demo user, demo admin (promoted to `role: admin`), and three org-poster accounts.

### 4. Run
```bash
npm run dev
```
Visit **http://localhost:3000**.

---

## 📄 License

Built for educational/demo purposes as part of a full-stack TypeScript Project.
