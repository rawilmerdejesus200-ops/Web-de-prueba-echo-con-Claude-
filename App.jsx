// components/App.jsx
const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4";

function App() {
  const { useState } = React;
  const [doorOpened, setDoorOpened] = useState(false);

  return (
    <>
      <CustomCursor />
      {!doorOpened && <DoorIntro onOpened={() => setDoorOpened(true)} />}

      <div className={`page-content ${doorOpened ? 'page-content-ready' : ''}`}>
        <Navbar />
        <Hero ready={doorOpened} videoUrl={VIDEO_URL} />
        <Marquee />
        <MansionTour />
        <PropertiesGrid />
        <GarageScroller />
        <CinematicShowcase videoUrl={VIDEO_URL} />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
