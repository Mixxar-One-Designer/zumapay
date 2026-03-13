import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-5 bg-white shadow-md flex justify-between">
      <h1 className="text-2xl font-bold text-blue-600">ZumaPay MVP</h1>
      <div>
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}