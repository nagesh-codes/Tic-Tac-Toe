export let USERS = {
  socketID: {
    name: "Alice",
    roomid: "roomA",
    email: "example@gmail.com"
  },
};

export let ROOMS = {
  "roomA": {
    unique_id: "Amoor",
    createdAt: Date.now(),
    createdBy: 'socketID',
    game_status: ['', '', '', '', '', '', '', '', '', ''],
    players: {
      "userId1": [0, 0, 'O'],
      "userId2": [0, 0, 'X']
    },
    draw: 1,
    isFull: false,
    turn: 0,
    isDisabled: false
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

export const roomDeletion = () => {
  Object.values(ROOMS).map((val) => {
    if ((Date.now() - val.createdAt) >= (2 * 60 * 60 * 1000)) {
      delete ROOMS[val.unique_id.split('').reverse().join('')];
    }
  });
}

export const checkWin = (game_status) => {
  for (let ind of game_win_chance) {
    const [a, b, c] = ind;
    if (game_status[a] === game_status[b] && game_status[b] === game_status[c] && game_status[a] !== '' && game_status[b] !== '' && game_status[c] !== '') {
      return true;
    }
  }
  return false;
};

export const addPlayer = (data, ID) => {
  try {
    let ret_id = ID;
    const roomid = data.roomid;
    const old_id = Object.keys(USERS).find(id => USERS[id].roomid === roomid && USERS[id].name === data.name);
    if (old_id) {
      const value = USERS[old_id];
      delete USERS[old_id];
      USERS[ID] = value;
    }
    const players = ROOMS[roomid].players;
    const key_0 = Object.keys(players)[0];
    const key_1 = Object.keys(players)[1];
    const val_0 = players[key_0];
    const val_1 = players[key_1];
    if (!USERS[ID].email) {
      delete players[key_1];
      players[ID] = val_1;
      ret_id = key_0;
    } else {
      delete players[key_0];
      delete players[key_1];
      players[ID] = val_0;
      players[key_1] = val_1;
      ROOMS[roomid].createdBy = ID;
      ret_id = key_1;
    }
    return ret_id;
  } catch (error) {
    console.error(error.message);
  }
}