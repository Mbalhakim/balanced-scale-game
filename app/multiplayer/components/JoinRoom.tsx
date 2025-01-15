import RoomList from "./RoomList";
import { Room } from "@/app/hooks/useMultiplayer";

type JoinRoomProps = {
  playerName: string;
  setPlayerName: (name: string) => void;
  selectedRoom: string;
  setSelectedRoom: (roomName: string) => void; // Update this prop
  handleJoinRoom: () => void;
  availableRooms: Room[];
};

export default function JoinRoom({
  playerName,
  setPlayerName,
  selectedRoom,
  setSelectedRoom, // Properly passed as a prop
  handleJoinRoom,
  availableRooms,
}: JoinRoomProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <h1 className="text-3xl font-bold">Join a Room</h1>
      <div className="mt-4 flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="p-2 mb-4 text-gray-900 border border-gray-300 rounded"
        />
        <RoomList
          availableRooms={availableRooms}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom} // Pass `setSelectedRoom` directly
        />
        <button
          onClick={handleJoinRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
