import "../COMPONENTES STYLE/FondoVideo.css"

const FondoVideo = () => {
  return (
        <video autoPlay muted loop playsInline className="background-video">
            <source src="/fondovideo.mp4" type="video/mp4" />
        </video>
  )
}

export default FondoVideo
