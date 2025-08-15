import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

export let USERS = {};
/*
sample! how players data will be save in USERS object
export let USERS = {
  socketID: {
      name: "Alice",
      roomid: "roomA",
      email: "example@gmail.com",
      isWin:false
  },
}
*/

export let ROOMS = {};
/*
sample! how rooms data will be stored in ROOMS object
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
*/

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
  try {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
  } catch (er) {
    console.log(er.message);
  }
}

export const roomDeletion = () => {
  try {
    Object.values(ROOMS).map((val) => {
      if ((Date.now() - val.createdAt) >= (2 * 60 * 60 * 1000)) {
        sendMail(USERS[val.createdBy]);
        delete ROOMS[val.unique_id.split('').reverse().join('')];
      }
    });
  } catch (er) {
    console.log(er.message);
  }
}

const sendMail = (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.APP_PASSWORD}`
      },
    });
    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: data.email,
      subject: 'Your Tic-Tac-Toe Room Has Been Deleted',
      html: `<!DOCTYPE html>
              <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Hello ${data.name},</h2>

                <p>
                  We wanted to let you know that your Tic-Tac-Toe game room 
                  <strong>"ROOM-${data.roomid}"</strong> has been successfully deleted.
                </p>

                <p>
                  If you'd like to play again, you're always welcome back!
                </p>

                <p style="text-align: center; margin: 30px 0;">
                  <a
                    href="${process.env.FRONTEND_URL}"
                    style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    🎮 Back to Play
                  </a>
                </p>

                <p>
                  Thank you for playing with us!<br />
                  - The Tic-Tac-Toe Team
                </p>
              </body>
              </html>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error Sending Email:', error.message);
      }
      console.log('Email Successfully sended to : ', data.email);
    })
  } catch (er) {
    console.log(er.message);
  }
}

export const checkWin = (game_status) => {
  try {
    for (let ind of game_win_chance) {
      const [a, b, c] = ind;
      if (game_status[a] === game_status[b] && game_status[b] === game_status[c] && game_status[a] !== '' && game_status[b] !== '' && game_status[c] !== '') {
        return true;
      }
    }
    return false;
  } catch (er) {
    console.log(er.message);
  }
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