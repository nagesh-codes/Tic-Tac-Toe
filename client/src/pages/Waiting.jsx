import cat1 from '../assets/cat1.gif'
import cat2 from '../assets/cat2.gif'
import './Waiting.css'

const Waiting = () => {
  return (
    <>
      <div className="waiting-container">
        <div className="wrapper">
          <div className="main-heading">
            Waiting Area!
          </div>
          <div className="middle">
            <div className="left-side">
              <div className="gif_area">
                <img src={cat1} alt="Loading..." />
              </div>
            </div>
            <div className="right-side">
              <div className="description">
                This is the waiting area where the host waits for a friend to join the private game room. Once the second player connects, the waiting screen will automatically disappear, and the game will begin. It's a simple, real-time lobby to ensure both players are ready before starting the match.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Waiting