import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1 className="main-heading">Welcome to <span class="no-break">Tic-Tac-Toe!</span></h1>
        <p className="hero-description">
          Dive into a vibrant and exciting Tic-Tac-Toe experience with a delightful pink theme.
          Challenge your friends in a classic game of X's and O's, designed for fun and friendly competition!
        </p>
      </header>

      <section className="about-section">
        <h2 className="section-heading">About the Game</h2>
        <p className="section-description">
        Tic-Tac-Toe takes the timeless game to a new level with its stunning visual design and smooth gameplay.
          It's perfect for quick matches with friends or family, offering a simple yet engaging challenge.
        </p>
        <div className="theme-boxes">
          <div className="theme-box pink-gradient">
            <h3>Vibrant Pink Theme</h3>
            <p>Immerse yourself in a world of beautiful pink and purple gradients.</p>
          </div>
          <div className="theme-box animated-elements">
            <h3>Smooth Animations</h3>
            <p>Enjoy fluid transitions and captivating animations with every move.</p>
          </div>
          <div className="theme-box responsive-design">
            <h3>Play Anywhere</h3>
            <p>Our responsive design ensures a great experience on any device.</p>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2 className="section-heading">How to Play</h2>
        <div className="rules-content">
          <div className="rule-item">
            <h3>1. The Board</h3>
            <p>The game is played on a 3x3 grid.</p>
          </div>
          <div className="rule-item">
            <h3>2. Players & Marks</h3>
            <p>There are two players, 'X' and 'O'. Players take turns marking one empty square at a time.</p>
          </div>
          <div className="rule-item">
            <h3>3. Objective</h3>
            <p>The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins the game.</p>
          </div>
          <div className="rule-item">
            <h3>4. Starting the Game</h3>
            <p>Player 'X' typically goes first. You can create a private room and invite your friends to join.</p>
          </div>
          <div className="rule-item">
            <h3>5. Draw Game</h3>
            <p>If all nine squares are filled and neither player has achieved three marks in a row, the game is a draw.</p>
          </div>
          <div className="rule-item">
            <h3>6. Reset & Replay</h3>
            <p>After a game concludes, you can easily reset the board to play another round.</p>
          </div>
        </div>
      </section>

      <div className="hero-section">
        <p className='play-heading'>Start The Fun Today!</p>
        <div className="hero-buttons">
          <Link to="/join_room" className="play-now-btn">Play Now!</Link>
          <Link to="/create_room" className="create-room-btn">Create Room</Link>
        </div>
      </div>

      <footer className="home-footer">
        <p>&copy; 2025 Pink Tic-Tac-Toe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
