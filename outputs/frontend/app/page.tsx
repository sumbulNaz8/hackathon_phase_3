import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3E2723] p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-[#FFC107] mb-6">📝 Todo App</h1>
          <p className="text-[#BCAAA4] text-lg mb-8">
            Manage your tasks with our beautiful brown-yellow interface
          </p>
          <div className="space-y-4">
            <Link href="/login">
              <div className="w-full py-3 px-4 bg-[#FFC107] text-[#3E2723] font-bold rounded-md hover:bg-[#FFE082] transition-colors cursor-pointer">
                Login
              </div>
            </Link>
            <Link href="/signup">
              <div className="w-full py-3 px-4 bg-[#8D6E63] text-white font-bold rounded-md hover:bg-[#BCAAA4] transition-colors cursor-pointer">
                Sign Up
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}