type Player = {
    id: string;
    name: string;
    ready: boolean;
  };
  
  type PlayerListProps = {
    players: Player[];
    currentPlayerName: string;
    onToggleReady: () => void;
  };
  
  const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerName, onToggleReady }) => {
    return (
      <ul className="mt-4">
        {players.map((player) => (
          <li
            key={player.id}
            className={`${
              player.name === currentPlayerName ? "text-green-400" : "text-white"
            }`}
          >
            {player.name} {player.name === currentPlayerName ? "(You)" : ""}
            <span className={`ml-2 ${player.ready ? "text-green-500" : "text-red-500"}`}>
              {player.ready ? "Ready" : "Not Ready"}
            </span>
            {player.name === currentPlayerName && (
              <button
                onClick={onToggleReady}
                className="ml-4 px-2 py-1 bg-blue-500 text-white rounded"
              >
                {player.ready ? "Unready" : "Ready"}
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  export default PlayerList;
  