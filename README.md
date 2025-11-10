# 🍞 Crumbit

A modern, full-stack Reddit clone built with Next.js 13, TypeScript, and MongoDB. Crumbit is a social discussion platform where users can create communities, share posts, and engage in conversations.

🌐 **Live Demo:** [https://crumbit.vercel.app/](https://crumbit.vercel.app/)

![Crumbit](https://img.shields.io/badge/Crumbit-Social%20Discussion%20Platform-FF4500?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### For Users

- 🔍 **Community Search** - Search and discover communities by name
- 📝 **Rich Text Posts** - Create posts with rich text editor (EditorJS) supporting headers, lists, code blocks, and more
- 📸 **Image Uploads** - Upload images directly in posts using UploadThing
- ⬆️⬇️ **Voting System** - Upvote/downvote posts and comments to show your opinion
- 💬 **Nested Comments** - Engage in threaded discussions with nested comment replies
- 🔔 **Custom Feeds** - Personalized feed based on subscribed communities
- 📱 **Responsive Design** - Beautiful, responsive UI that works on all devices

### For Communities

- 👥 **Community Creation** - Create and manage your own communities (subreddits)
- 📊 **Community Management** - Subscribe/unsubscribe to communities
- 🎨 **Community Pages** - Dedicated pages for each community with posts and information
- 📈 **Post Analytics** - View post engagement with vote counts and comment numbers

### Authentication & Security

- 🔐 **NextAuth.js Integration** - Secure authentication with multiple providers
- 🌐 **OAuth Support** - Sign in with Google
- 🔒 **JWT Sessions** - Secure session management with JWT tokens
- 👤 **User Profiles** - Manage your profile with avatar support

### Performance & Caching

- ⚡ **Redis Caching** - Fast post caching with Upstash Redis
- 🚀 **Server-Side Rendering** - Optimized performance with Next.js SSR
- 📦 **Infinite Scroll** - Efficient pagination with infinite scroll

## 🛠️ Tech Stack

### Frontend

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **EditorJS** - Rich text editor
- **React Query** - Data fetching and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern ORM for database management
- **MongoDB** - NoSQL database
- **NextAuth.js** - Authentication library
- **Upstash Redis** - Caching layer
- **UploadThing** - File upload service

### Services & Tools

- **UploadThing** - Image upload and management
- **Upstash Redis** - Serverless Redis for caching
- **Date-fns** - Date utility library
- **Axios** - HTTP client

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- UploadThing account (for image uploads)
- Google OAuth credentials (for OAuth login)
- Upstash Redis account (optional, for caching)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/reddit-clone-1.git
   cd reddit-clone-1
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="your_mongodb_connection_string"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"

   # Redis (Upstash) - Optional
   REDIS_URL="your_redis_url"
   REDIS_SECRET="your_redis_secret"

   # UploadThing
   UPLOADTHING_SECRET="your_uploadthing_secret"
   UPLOADTHING_APP_ID="your_uploadthing_app_id"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```text
reddit-clone-1/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # NextAuth routes
│   │   │   ├── subreddit/    # Community routes
│   │   │   ├── posts/        # Post routes
│   │   │   ├── search/       # Search routes
│   │   │   └── uploadthing/  # File upload routes
│   │   ├── r/                 # Community pages
│   │   │   └── [slug]/       # Dynamic community routes
│   │   ├── (auth)/            # Authentication pages
│   │   └── settings/          # User settings
│   ├── components/            # React components
│   │   ├── ui/                # UI components (Radix UI)
│   │   ├── post-vote/         # Post voting components
│   │   ├── CommentsSection.tsx
│   │   ├── Editor.tsx          # Rich text editor
│   │   ├── PostFeed.tsx       # Post feed component
│   │   └── SearchBar.tsx      # Community search
│   ├── lib/                   # Utility functions
│   │   ├── validators/        # Zod schemas
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client
│   │   └── redis.ts           # Redis client
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
└── package.json
```

## 🎨 Key Features Implementation

### Rich Text Editor

The post creation uses EditorJS with support for:

- Headers (H1-H6)
- Paragraphs and lists
- Code blocks
- Links and embeds
- Tables
- Image uploads

### Voting System

Complete voting system with:

- Post upvote/downvote
- Comment upvote/downvote
- Vote count display
- User vote tracking
- Redis caching for popular posts

### Comment Threading

Nested comment system with:

- Top-level comments
- Nested replies
- Comment voting
- Real-time updates
- User attribution

### Community Management

Full community features including:

- Community creation
- Subscribe/unsubscribe
- Community-specific feeds
- Community information pages
- Member management

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma studio` - Open Prisma Studio

## 🌐 Deployment

**Live Application:** [https://crumbit.vercel.app/](https://crumbit.vercel.app/)

The easiest way to deploy Crumbit is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables
4. Deploy!

Crumbit is optimized for Vercel's platform and works seamlessly with their serverless functions.

## 📝 Database Schema

The application uses MongoDB with Prisma ORM. Key models include:

- **User** - User accounts and authentication
- **Subreddit** - Community/subreddit data
- **Post** - Post content and metadata
- **Comment** - Comment threads and replies
- **Vote** - Post voting data
- **CommentVote** - Comment voting data
- **Subscription** - User-community subscriptions
- **Account** - OAuth account connections
- **Session** - User sessions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Maruf Hossain

- GitHub: [@MarufPulok](https://github.com/MarufPulok)
- LinkedIn: [Maruf Hossain](https://www.linkedin.com/in/marufhpulok/)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Rich text editor by [EditorJS](https://editorjs.io/)
- Database with [MongoDB](https://www.mongodb.com/) and [Prisma](https://www.prisma.io/)
- Icons from [Lucide React](https://lucide.dev/)

---

⭐ If you find this project helpful, please consider giving it a star!
