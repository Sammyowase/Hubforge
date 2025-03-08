# Hubforge

![Hubforge Banner](https://hubforge.vercel.app/banner.png)

## 🚀 Overview
Hubforge is a **Next.js**-based application designed to streamline productivity and collaboration. It integrates **Clerk for authentication**, **Prisma for database management**, and **Tailwind CSS with Shadcn UI for styling**, providing a modern and efficient user experience.

## ✨ Features
- 🔐 **User Authentication**: Secure login and registration powered by Clerk.
- 🗄 **Database Management**: Uses Prisma ORM with PostgreSQL, hosted on Neon.
- 🎨 **Modern UI**: Styled with Tailwind CSS and Shadcn UI for a sleek design.
- ⚡ **State Management**: Efficient data handling with React hooks.
- 🔑 **Role-based Access**: Different permissions for users based on their roles.
- 🚀 **Fast Deployment**: Optimized for Vercel hosting.

## 🛠 Tech Stack
### Frontend
- **Next.js**
- **React.js**
- **Tailwind CSS**
- **Shadcn UI**

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL (Neon)**

### Authentication & Deployment
- **Authentication**: Clerk
- **Database Hosting**: Neon
- **Deployment**: Vercel

## 📦 Installation
### Prerequisites
- Node.js (latest LTS version recommended)
- Git
- A PostgreSQL database (Neon recommended)
- Clerk account for authentication

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Sammyowase/Hubforge.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd Hubforge
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Set up environment variables in a `.env` file:**
   ```sh
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```
5. **Run database migrations:**
   ```sh
   npx prisma migrate dev
   ```
6. **Start the development server:**
   ```sh
   npm run dev
   ```
7. **Open the app in your browser:**
   ```sh
   http://localhost:3000
   ```

## 🌍 Production Link
🔗 Live Application: [Hubforge](https://hubforge.vercel.app/)

## 🚀 Deployment
To deploy on Vercel, run:
```sh
vercel
```
Or configure in the Vercel dashboard with appropriate environment variables.

## 🤝 Contributing
### How to Contribute
1. **Fork the repository**
2. **Create a new branch:**
   ```sh
   git checkout -b feature-branch
   ```
3. **Make your changes and commit:**
   ```sh
   git commit -m "Added new feature"
   ```
4. **Push the changes:**
   ```sh
   git push origin feature-branch
   ```
5. **Create a Pull Request on GitHub**

### Code Guidelines
- Follow best practices for React and Next.js development.
- Ensure proper documentation and comments.
- Use ESLint and Prettier for code formatting.

## 🛠 Issues & Debugging
- **Check browser console and logs** for errors.
- **Run the development server in debug mode:**
  ```sh
  npm run dev
  ```
- **Use Prisma Studio to inspect the database:**
  ```sh
  npx prisma studio
  ```
- **If issues persist, open a GitHub Issue describing the bug.**

## 📜 License
This project is licensed under the **MIT License**.

## 📬 Contact
For questions or contributions, contact **Samuel Owase**:
- **GitHub**: [Sammyowase](https://github.com/Sammyowase)
- **Email**: samuelowase02@gmail.com

