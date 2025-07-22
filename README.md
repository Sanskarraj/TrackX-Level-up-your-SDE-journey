# 🚀 TrackX – Your Ultimate DSA Journey Tracker

<div align="center">

![TrackX Logo](https://via.placeholder.com/200x80/4f46e5/ffffff?text=TrackX)

**A minimal yet powerful DSA Sheet Tracker to help you stay consistent and level up your problem-solving skills**

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 🌟 About

TrackX is inspired by the renowned [GeeksforGeeks SDE Sheet](https://www.geeksforgeeks.org/dsa/sde-sheet-a-complete-guide-for-sde-preparation/) – a comprehensive collection of carefully curated Data Structures and Algorithms problems designed for coding interview excellence.

### 🎯 Perfect for:
- 🏢 **FAANG Preparation** - Ace your dream company interviews
- 🌱 **DSA Beginners** - Start your coding journey with confidence  
- 🎓 **Students** - Master concepts with structured learning
- 💼 **Working Professionals** - Upskill and advance your career

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 📊 **Progress Tracking**
- ✅ Mark questions as solved/unsolved
- 📈 Visual progress dashboard
- 🏆 Achievement badges & milestones
- 📅 Daily streak counter

</td>
<td width="50%">

### 🔍 **Smart Organization**
- 🏷️ Filter by topics & difficulty
- 🔄 Sort by various criteria
- 🔖 Bookmark important problems
- 📝 Personal notes & solutions

</td>
</tr>
<tr>
<td width="50%">

### 🔐 **Secure & Personalized**
- 🔑 Google OAuth integration
- 👤 Personal user profiles
- 💾 Cloud-synced progress
- 🔒 Data privacy protection

</td>
<td width="50%">

### 🎨 **Modern Experience**
- 🌙 Dark/Light mode toggle
- 📱 Fully responsive design
- ⚡ Lightning-fast performance
- 🎯 Intuitive user interface

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Authentication | Styling |
|:--------:|:-------:|:--------:|:--------------:|:-------:|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) | ![API Routes](https://img.shields.io/badge/API_Routes-0070f3?style=flat&logo=next.js&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) | ![NextAuth](https://img.shields.io/badge/NextAuth-000000?style=flat&logo=next.js&logoColor=white) | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Next.js 13+** | **Server Actions** | **Prisma ORM** | **Google OAuth** | **Tailwind CSS** |

</div>

### 🔧 Additional Tools:
- 🔷 **TypeScript** - Type-safe development
- 🗃️ **PlanetScale** - Scalable database solution
- 🚀 **Vercel** - Seamless deployment

---

## 🚀 Quick Start

### 📋 Prerequisites
- Node.js 18.0 or higher
- Git
- A PostgreSQL database (or PlanetScale account)
- Google Cloud Console account

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/trackx.git
cd trackx

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2️⃣ Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="your_postgresql_connection_string"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_ID="your_google_client_id"
GOOGLE_SECRET="your_google_client_secret"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret"

# Optional: For production
VERCEL_URL="your_production_url"
```

### 3️⃣ Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Seed the database with DSA problems
npm run seed
```

### 4️⃣ Launch Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

🎉 Open [http://localhost:3000](http://localhost:3000) and start tracking your DSA journey!

---

## 📁 Project Structure

```
📦 trackx/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 api/               # Server-side API routes
│   │   ├── 📂 auth/          # Authentication endpoints
│   │   └── 📂 problems/      # Problem management APIs
│   ├── 📂 dashboard/         # User dashboard pages
│   ├── 📂 auth/              # Authentication pages
│   ├── 📂 problems/          # Problem listing pages
│   └── 📄 layout.tsx         # Root layout component
│
├── 📂 components/            # Reusable UI components
│   ├── 📂 ui/               # Base UI components
│   ├── 📂 dashboard/        # Dashboard-specific components
│   └── 📂 problems/         # Problem-related components
│
├── 📂 lib/                  # Utility functions & configurations
│   ├── 📄 auth.ts          # NextAuth configuration
│   ├── 📄 db.ts            # Database connection
│   └── 📄 utils.ts         # Helper functions
│
├── 📂 prisma/              # Database schema & migrations
│   ├── 📄 schema.prisma    # Database schema
│   └── 📂 migrations/      # Migration files
│
├── 📂 public/              # Static assets
│   ├── 📄 logo.svg         # TrackX logo
│   └── 📂 icons/           # Application icons
│
└── 📂 styles/              # Global styles
    └── 📄 globals.css      # Tailwind & custom CSS
```

---

## 🎨 Screenshots

<div align="center">

### 🏠 Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400/f3f4f6/374151?text=Dashboard+Preview)

### 📝 Problem List
![Problems](https://via.placeholder.com/800x400/f3f4f6/374151?text=Problems+List+Preview)

</div>

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Found a Bug?
1. Check if it's already reported in [Issues](https://github.com/your-username/trackx/issues)
2. If not, create a new issue with detailed description
3. Include steps to reproduce and expected behavior

### 💡 Have a Feature Idea?
1. Open a [Feature Request](https://github.com/your-username/trackx/issues/new)
2. Describe the feature and its benefits
3. We'll discuss and prioritize it

### 🔧 Want to Code?
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Resources & References

- 📖 [GeeksforGeeks SDE Sheet](https://www.geeksforgeeks.org/dsa/sde-sheet-a-complete-guide-for-sde-preparation/) - Original inspiration
- 📘 [Next.js Documentation](https://nextjs.org/docs) - Framework guide
- 🔐 [NextAuth.js Guide](https://next-auth.js.org/) - Authentication setup
- 🗃️ [Prisma Documentation](https://www.prisma.io/docs/) - Database ORM guide

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

### **Sanskar Masurkar**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-username)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/your-username)

*"Turning DSA preparation from overwhelming to organized, one problem at a time."*

</div>

---

## 🙏 Acknowledgments

- 🎯 **GeeksforGeeks** for the comprehensive SDE Sheet
- 🚀 **Vercel** for hosting and deployment platform
- 💖 **Open Source Community** for the amazing tools and libraries
- 👥 **Contributors** who help make TrackX better

---

<div align="center">

### ⭐ Star this repo if TrackX helped you in your DSA journey!


</div>
