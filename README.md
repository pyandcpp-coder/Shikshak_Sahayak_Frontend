# Shiksha Sahayak - Frontend



**Transform any content into an interactive learning experience.**

This is the frontend for Shiksha Sahayak, a powerful AI-driven learning assistant. This application allows users to input content from various sources (PDFs, websites, YouTube videos) and then engages them with an interactive chat, automated summaries, and knowledge-testing quizzes.

This project was built with a modern, responsive interface using Next.js and shadcn/ui.

**[Live Demo](https://shikshak-sahayak.vercel.app)** 

---

## ✨ Key Features

-   **Multi-Source Content Input**: Start a learning session from:
    -   📄 **PDF Documents**: Upload a PDF file directly.
    -   🌐 **Website URLs**: Paste a link to any article or webpage.
    -   ▶️ **YouTube Videos**: Learn from the transcript of any YouTube video.
-   **Interactive Chat**: Ask contextual questions about the provided content and get instant, AI-powered answers.
-   **AI-Generated Summaries**: Get a concise and accurate summary of the entire document or video.
-   **Automated Quizzes**: Test your understanding with multiple-choice quizzes generated automatically from the content.
-   **Sleek & Responsive UI**: A clean, modern, and mobile-friendly interface built with Tailwind CSS and shadcn/ui.

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

To run this project locally, you will need to have the [Shiksha Sahayak Backend](https://github.com/pyandcpp-coder/shiksha-sahayak-backend) running as well.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pyandcpp-coder/shiksha-sahayak-frontend.git
    cd shiksha-sahayak-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env.local` in the root of the project and add the URL of your running backend server.

    ```env
    # .env.local
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```
    *(This assumes your backend is running locally on port 8000)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🌐 Deployment

This application is optimized for deployment on **Vercel**.

1.  **Push to GitHub:** Ensure your repository is pushed to GitHub.
2.  **Import to Vercel:** Import the project into Vercel from your GitHub repository. Vercel will automatically detect the Next.js framework.
3.  **Configure Environment Variable:** In the Vercel project settings, go to "Environment Variables" and add `NEXT_PUBLIC_API_URL`. The value should be the public URL of your deployed backend (e.g., your Render service URL).

Vercel will automatically build and deploy the application upon every push to the `main` branch.

---

## 🔗 Backend Repository

This is a frontend-only application and **requires** its corresponding backend to function.

➡️ **Find the backend repository here: [pyandcpp-coder/shiksha-sahayak-backend](https://github.com/pyandcpp-coder/Shikshak_Sahayak_Backend)**

---

