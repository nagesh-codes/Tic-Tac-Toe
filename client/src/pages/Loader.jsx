import './Loader.css'

const Loader = ({ text = "Loading Please Wait!" }) => {
    return (
        <>
            <div className="loader-container">
                <div className="outer-loader">
                    <div className="inner-loader"></div>
                </div>
                <div className="loader-text">{text}</div>
            </div>
        </>
    )
}

export default Loader;