# PrepGrid — AI-Powered Interview & Practice Platform

---

## 🔗 Links

- **Live URL:** https://prepgrid.netlify.app
- **GitHub:** https://github.com/yourusername/prepgrid
- **Demo Video:** https://youtu.be/your-video-link

---

## 📌 Project Overview

PrepGrid is a full-stack placement preparation platform that helps engineering students crack technical interviews through AI-driven mock interviews, in-browser coding practice, timed quizzes, and personalised performance tracking.

The platform mirrors the real interview experience — an AI interviewer asks role-specific questions, evaluates your answers in real time, scores each response out of 10, and gives actionable feedback. The quiz module generates topic-specific MCQs on demand, with a live leaderboard tracking top scorers. The code editor supports 4 languages with Judge0-powered execution.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, React Router v6 |
| State Management | Zustand, TanStack React Query |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| AI | Groq API (Llama 3.3 70B) |
| Code Execution | Judge0 CE via RapidAPI |
| Authentication | JWT (access + refresh tokens), OTP via Nodemailer |
| Payments | Razorpay (sandbox/test mode) |
| Charts | Recharts |
| Code Editor | Monaco Editor |
| Deployment | Netlify (frontend), Render (backend) |

---

## ✅ Features Built

### Practice Module
- Coding question bank with 10 seeded problems (Easy/Medium/Hard)
- Topics: Arrays, Strings, Trees, DP, Graphs, SQL, Linked Lists, Stack/Queue
- In-browser Monaco code editor with syntax highlighting
- Language support: JavaScript, Python, Java, C++
- Judge0-powered code execution with test case results
- Bookmark questions, track solved/unsolved status
- Topic and difficulty filtering + search

### AI Interview Module
- Role-based mock interviews: Frontend, Backend, Full Stack, DSA
- Groq (Llama 3.3 70B) powered adaptive questioning
- Per-answer scoring (0–10) with detailed feedback and improvement tips
- Voice input support via Web Speech API
- Session history stored per user
- End-of-interview summary: verdict, strengths, weak areas

### AI Quiz Module
- Generate 10 MCQ questions on any topic on demand
- 30-second timer per question with auto-advance
- AI-generated explanations for each answer
- Leaderboard showing top scorers per topic
- Confetti animation on score ≥ 70%

### User System
- Full authentication: register, email OTP verification, login, forgot password
- JWT access tokens (15 min) + refresh tokens (7 days)
- User dashboard: problems solved, interviews done, avg score, streak tracker
- 30-day activity bar chart, topic breakdown pie chart
- AI-detected weak areas with recommended topics
- Recent submissions history

### Payments
- Razorpay sandbox integration
- Free tier: 5 AI interviews/month, 10 practice questions/month
- Pro tier: ₹499/month, unlimited access
- Billing history page

### Admin Panel
- Platform-wide stats: total users, questions, interviews, submissions
- Most attempted topics with bar visualization
- Average score by interview role
- Registered users table with plan and activity info

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js v20+
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)
- Judge0 RapidAPI key (free tier)
- Razorpay test keys
- Gmail App Password for OTP

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in all env vars (see below)
npm run seed      # loads 10 sample questions
npm run dev       # starts on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in all env vars (see below)
npm run dev       # starts on http://localhost:5173
```

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/prepgrid
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GROQ_API_KEY=gsk_xxxxxxxxxxxx
JUDGE0_API_KEY=your_judge0_key
JUDGE0_HOST=judge0-ce.p.rapidapi.com
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
VITE_JUDGE0_HOST=judge0-ce.p.rapidapi.com
VITE_JUDGE0_KEY=your_judge0_key
```

---

## 📁 Project Structure

```
prepgrid/
├── backend/
│   └── src/
│       ├── index.js          # Express server entry
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API routes
│       ├── middleware/        # Auth, rate limiting
│       ├── services/         # AI (Groq), email
│       └── seed.js           # Database seeder
└── frontend/
    └── src/
        ├── pages/            # 15 route-level pages
        ├── components/       # Sidebar, AuthLayout
        ├── hooks/            # Zustand auth store
        ├── utils/            # Axios API client
        └── styles/           # Global CSS
```

---

## ⚠️ Known Limitations

- Code execution requires Judge0 RapidAPI key (free tier has limited requests)
- AI features require Groq API key (14,400 free requests/day)
- Razorpay is in sandbox/test mode only — no real payments processed
- No mobile responsive layout (desktop only)
- Admin panel has no question CRUD UI (questions added via seed script)
- Voice input only works in Chrome/Edge (Web Speech API)

---

## Future Scope

- Mobile responsive design
- Video-based mock interviews with facial expression analysis
- Collaborative coding rooms for pair programming practice
- Company-specific question banks (Google, Amazon, etc.)
- Resume analyzer with AI feedback
- Integration with LinkedIn for profile-based question recommendations
- Real payment processing for Pro plan
- IDE themes and font customization
