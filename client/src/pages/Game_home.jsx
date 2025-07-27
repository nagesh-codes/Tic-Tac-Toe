import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../components/SocketProvider';
import { error, warning } from '../App';
import './Game_home.css';

const Game_home = () => {
  const [roomid, setRoomid] = useState(sessionStorage.getItem('room') || 'Room ID');
  const [win, setWin] = useState(0);
  const [loose, setLoose] = useState(0);
  const [draw, setDraw] = useState(0);
  const [curPlayer, setCurPlayer] = useState('...');
  const { socket } = useSocket();
  const [pl1, setPl1] = useState('Player 1');
  const [pl2, setPl2] = useState('Player 2');
  const [disable, setDisable] = useState(true);
  const player = sessionStorage.getItem('player');
  const [sign, setSign] = useState('');
  const navigate = useNavigate();
  const [gameStatus, setGameStatus] = useState(Array(9).fill(''));

  const waitForCells = () =>
    new Promise((resolve) => {
      const check = () => {
        const cells = document.querySelectorAll(".cell");
        if (cells.length === 9) {
          resolve(cells);
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });

  const updateGameStatus = async (data) => {
    try {
      console.log(data);
      setRoomid(data.roomid);
      setPl1(`${data.pl1} ${data.pl1_sta[2]}`);
      setPl2(`${data.pl2} ${data.pl2_sta[2]}`);

      if (player === data.pl1) {
        setWin(data.pl1_sta[0]);
        setLoose(data.pl1_sta[1]);
        setSign(data.pl1_sta[2]);
      } else {
        setWin(data.pl2_sta[0]);
        setLoose(data.pl2_sta[1]);
        setSign(data.pl2_sta[2]);
      }

      setDraw(data.draw);

      const nextPlayer = data.turn === 0 ? data.pl1 : data.pl2;
      setCurPlayer(nextPlayer);
      setDisable(nextPlayer !== player);
      setGameStatus(data.game_status);

    } catch (e) {
      console.error(e);
    }
  };

  const handleCellClick = (e) => {
    const index = Array.from(e.target.parentNode.children).indexOf(e.target);
    if (gameStatus[index] !== '') {
      warning('This box is already filled!');
      return;
    }

    if (player === curPlayer) {
      const newGameStatus = [...gameStatus];
      newGameStatus[index] = sign;

      socket.emit('cellClick', { roomid, arr: newGameStatus, player });
    } else {
      warning("It's not your turn!");
    }
  };

  const handleClick = () => {
    sessionStorage.removeItem('player');
    sessionStorage.removeItem('room');
  };

  useEffect(() => {
    const applyCellStyles = async () => {
      const allCells = await waitForCells();
      gameStatus.forEach((value, index) => {
        const cell = allCells[index];
        cell.classList.remove('x', 'o');
        cell.textContent = '';
        if (value === 'X' || value === 'O') {
          cell.textContent = value;
          cell.classList.add(value.toLowerCase());
        }
      });
    };

    if (gameStatus.some(cell => cell !== '')) {
      applyCellStyles();
    }

  }, [gameStatus]);

  useEffect(() => {
    if (!socket) return;
    if (!sessionStorage.getItem('room')) {
      warning('Please create or join a room first.');
      navigate("/");
      return;
    }

    socket.emit('takeInfo', {
      roomid: sessionStorage.getItem('room'),
      player: sessionStorage.getItem('player'),
      name: sessionStorage.getItem('player')
    });

    socket.on('getInfo', updateGameStatus);
    socket.on('newGameState', updateGameStatus);

    socket.on('discnn', () => {
      error('Your game partner has disconnected.');
      setDisable(true);
    });

    return () => {
      socket.off('getInfo', updateGameStatus);
      socket.off('newGameState', updateGameStatus);
      socket.off('discnn');
    };
  }, [socket, navigate]);


  return (
    <>
      <div className="game-home-container">
        <div className="wrapper">
          <div className="left-panel">
            <h1>Tic-Tac-Toe Fun!</h1>
            <p className="description hide">Challenge your friend in this vibrant Tic-Tac-Toe match!</p>
            <div className="players-display">
              <div className="player-card player-x active-player">
                <span id="playerXName">{pl1}</span>
                <i className="fas fa-times"></i>
              </div>
              <div className="player-card player-o">
                <span id="playerOName">{pl2}</span>
                <i className="far fa-circle"></i>
              </div>
            </div>
            <div id="gameStatus" className="game-status">It`s {curPlayer} Turn</div>
            <div className="btns">
              <button className="reset-btn">Reset Game</button>
              <button className="restart-btn">Restart Game</button>
            </div>
            <Link className="home-btn" to={"/"} onClick={handleClick}>Go To Home</Link>
          </div>

          <div className="right-panel">
            <div id="gameBoard" className="game-board">
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
            </div>
            <div className="info-area">
              <div className="game-btn win">WIN: <span>{win}</span></div>
              <div className="game-btn loose">Loose: <span>{loose}</span></div>
              <div className="game-btn draw">DRAW: <span>{draw}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game_home;