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
    users: {
      "userId1": [0, 0],
      "userId2": [0, 0]
    },
    draw: 1
  }
};


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
  return result
}