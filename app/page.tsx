import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Alice in Borderland Game</h1>
      <Link href="/multiplayer">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Enter Game Lobby
        </button>
      </Link>
    </div>
  );
}
