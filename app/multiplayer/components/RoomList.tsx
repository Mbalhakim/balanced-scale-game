type Room = {
  name: string;
  players: number;
  maxPlayers: number;
};

type RoomListProps = {
  availableRooms: Room[];
  selectedRoom: string;
  onSelectRoom: (roomName: string) => void;
};

const RoomList: React.FC<RoomListProps> = ({ availableRooms, selectedRoom, onSelectRoom }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Select a Room:</h2>
      {availableRooms.map((room) => (
        <div key={room.name} className="mb-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="room"
              value={room.name}
              checked={selectedRoom === room.name}
              onChange={() => onSelectRoom(room.name)} // Properly calls the function
            />
            <span>
              {room.name} ({room.players}/{room.maxPlayers} players)
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RoomList;