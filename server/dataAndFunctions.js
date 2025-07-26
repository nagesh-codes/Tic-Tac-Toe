export let USERS = {
  socketID: {
    name: "Alice",
    roomId: "roomA",
    email: "example@gmail.com"
  },
};

export let ROOMS = {
  "roomA": {
    unique_id: "abc123",
    createdAt: Date.now(),
    createdBy: 'socketID',
    game_status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    players: {
      "userId1": [1, 2],
      "userId2": [3, 4]
    },
    draw: 1,
    isFull: false,
    turn: 0
  }
};

const game_win_chance = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];


export const generateRoomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result;
  const charactersLength = characters.length;
  const length = 6;
  do {
    result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  } while (Object.keys(ROOMS).some(room => room === result))
  return result;
}

export const checkWin = (game_status) => {
  for (let ind of game_win_chance) {
    const [a, b, c] = ind;
    if (game_status[a] && game_status[a] === game_status[b] && game_status[a] === game_status[c]) {
      return true;
    }
  }
  return false;
};