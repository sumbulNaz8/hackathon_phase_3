# Todo App with Brown-Yellow Theme

A beautiful and functional todo application with a distinctive brown-yellow color scheme built using Next.js, TypeScript, and Tailwind CSS.

## Features

- Clean, intuitive user interface with brown-yellow color theme
- Task management (create, read, update, delete)
- Task completion toggling
- Responsive design for all device sizes
- Modern UI components with smooth transitions
- Local storage persistence

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Create environment files:
```bash
# In the frontend directory
cp .env.local.example .env.local
```

4. Configure environment variables:
Edit the `.env.local` file in the frontend directory and set your environment variables.

## Running the Application

### Development Mode

To run the application in development mode:

```bash
cd frontend
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

To build and run the application in production mode:

```bash
cd frontend
npm run build
npm run start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Dashboard page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── layout/            # Layout components
│   ├── tasks/             # Task-related components
│   └── ui/                # UI components
├── lib/                   # Utilities and types
└── public/                # Static assets
```

## Color Palette

The application uses a consistent brown-yellow color scheme:

- `#3E2723` - Dark brown (headers, backgrounds)
- `#5D4037` - Medium brown (secondary backgrounds)
- `#8D6E63` - Light brown (task cards)
- `#BCAAA4` - Lighter brown (borders, text)
- `#FFC107` - Primary yellow (buttons, accents)
- `#FFE082` - Light yellow (hover states)
- `#66BB6A` - Success green (completed tasks)
- `#EF5350` - Error red (delete buttons)

## Components

### Layout Components
- `Header` - Application header with user info and logout

### UI Components
- `Button` - Reusable button component with multiple variants

### Task Components
- `TaskCard` - Individual task display with actions
- `TaskList` - List of tasks with empty state

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint the codebase

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please file an issue in the repository."# hackathon_2" 
