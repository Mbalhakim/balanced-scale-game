export type Player = {
  id: string;
  name: string;
  ready: boolean;
  points: number;
  alive: boolean;
  currentSelection?: number;
  image: string;
};

export type Room = {
  name: string;
  players: number;
  maxPlayers: number;
  status: 'lobby' | 'starting' | 'in-game' | 'completed';
};

export type GameState = {
  status: 'lobby' | 'playing' | 'eliminated' | 'game-over' | 'spectating' | 'victory' | 'stage-transition';
  players: Player[];
  currentStage: number;
  selectedNumber: number | null;
  results: { 
    target: number; 
    winner: string | null;
    losers: string[]; 
  } | null;
  rooms: Room[];
  selectedRoom: string;
  playerName: string;
  error?: string;
  countdown?: number;
};