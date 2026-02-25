<div align="center">

# 💬 Slack Chat

**A real-time messaging app built with Next.js, Clerk, and Convex**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-1.32.0-EE342F?style=for-the-badge&logo=convex&logoColor=white)](https://convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-6.38.1-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-purple?style=flat-square)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/Tigmanshukumar/slack-clone/pulls)

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Site-success?style=for-the-badge)](https://slack-chat-bice.vercel.app/)


</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **Direct Messages** | Fast, private 1:1 conversations that update in real time |
| 👥 **Group Chats** | Create named group conversations with multiple members |
| ⚡ **Live Reactions** | React to any message with emoji — toggleable and counted |
| 🟢 **Presence** | See who's online at a glance with live status indicators |
| ✍️ **Typing Indicators** | Know when someone is composing a message |
| 🗑️ **Message Deletion** | Soft-delete your own messages with a visible placeholder |
| 🔔 **Unread Counts** | Per-conversation unread badge that clears when you open a chat |
| 📱 **Responsive** | Mobile-first sidebar navigation with a full desktop layout |
| 🔐 **Auth** | Email and social sign-in via Clerk, profiles sync automatically |
| ⏱️ **Smart Timestamps** | Readable times for today; full dates for older messages |

---

## 🖼️ Screenshots

<table>
  <tr>
    <td align="center"><b>Landing Page</b></td>
    <td align="center"><b>Chat Interface</b></td>
  </tr>
  <tr>
    <td><img src="https://i.postimg.cc/fRgkmnNk/screencapture-localhost-3000-2026-02-23-14-15-09.png" alt="Landing Page" width="400"/></td>
    <td><img src="https://i.postimg.cc/DzHJkVjY/screencapture-localhost-3000-chat-2026-02-23-14-34-23.png" alt="Chat Interface" width="400"/></td>
  </tr>
</table>

---

## 🛠️ Tech Stack

```
Frontend   →  Next.js 16 (App Router) + React 19 + TypeScript
Styling    →  Tailwind CSS v4
Auth       →  Clerk (email, OAuth, user profiles)
Database   →  Convex (real-time reactive queries & mutations)
Fonts      →  Inter via next/font
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.dev) account
- A [Convex](https://convex.dev) account

### 1. Clone the repository

```bash
git clone https://github.com/Tigmanshukumar/slack-clone.git
cd slack-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Initialize Convex

```bash
npx convex dev
```

This will push your schema and generate the typed API client.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
slack-clone/
├── app/
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ChatHeader.tsx      # Conversation header with user/group info
│   │   │   ├── Composer.tsx        # Message input bar
│   │   │   ├── GroupCreatorModal.tsx
│   │   │   ├── MessagesPane.tsx    # Message list with reactions & outbox
│   │   │   └── Sidebar.tsx         # User & conversation list
│   │   └── page.tsx                # Main chat page with all state
│   ├── components/
│   │   ├── AppFooter.tsx
│   │   └── home/
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       └── HowItWorks.tsx
│   ├── ConvexClientProvider.tsx
│   ├── layout.tsx
│   └── page.tsx
├── convex/
│   ├── schema.ts                   # Database schema (users, convos, messages…)
│   ├── users.ts                    # User sync & presence mutations
│   ├── conversations.ts            # DM & group conversation logic
│   ├── messages.ts                 # Send, delete, read-tracking
│   ├── reactions.ts                # Emoji reaction toggle
│   └── typing.ts                   # Typing indicator heartbeat
├── lib/
│   └── date.ts                     # Smart timestamp formatter
└── public/
```

---

## ⚙️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx convex dev` | Run Convex in dev mode (syncs schema & functions) |

---

## 🗄️ Data Model

```
users           clerkId, name, imageUrl, online, lastSeen
conversations   members[], isGroup, name?, lastMessage?, updatedAt
messages        conversationId, senderId, content, createdAt, readBy[], deleted
reactions       messageId, userId, emoji, createdAt
typing          conversationId, userId, updatedAt
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ by [Tigmanshu Kumar](https://github.com/Tigmanshukumar)

⭐ Star this repo if you found it useful!

</div>
