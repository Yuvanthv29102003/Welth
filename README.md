# Welth - AI-Powered Personal Finance Platform 💰

A modern, full-stack personal finance management platform built with Next.js, featuring AI-powered insights, expense tracking, and budget management.

## Features ✨

- 🔐 Secure authentication with Clerk
- 💰 Expense tracking and management
- 📊 Budget planning and monitoring
- 🤖 AI-powered financial insights
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI with Shadcn UI components
- 📧 Email notifications with Resend
- 🔒 Rate limiting with ArcJet
- 📊 Database management with Prisma

## Tech Stack 🛠️

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: Prisma with PostgreSQL
- **Authentication**: Clerk
- **AI Integration**: Google Gemini
- **Email Service**: Resend
- **Rate Limiting**: ArcJet
- **Background Jobs**: Inngest

## Getting Started 🚀

1. Clone the repository:
```bash
git clone https://github.com/Yuvanthv29102003/Welth.git
cd Welth
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

RESEND_API_KEY=

ARCJET_KEY=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Author 👤

- Yuvanth Veluru
- GitHub: [@Yuvanthv29102003](https://github.com/Yuvanthv29102003)
