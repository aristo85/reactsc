import { useState } from "react";
import { Footer, Navbar, Services, Transactions, Welcome } from "./components";
import Webinar from "./components/Webinar/Webinar";

const App = () => {
    const [showWebinar, setShowWebinar] = useState(true);

    const handleWebinarClose = () => {
      setShowWebinar(false);
  }

    return (
    <div className="main-h-screen">
      <div className="gradient-bg-welcome">
        {/* <Navbar /> */}
        <Welcome />
      </div>
      {/* <Services /> */}
      <Transactions />
      {/* <Footer /> */}
      {
                showWebinar && <Webinar handleWebinarClose={handleWebinarClose} style={{position: 'absolute', bottom: '10px'}} />
            }
    </div>
  );
};

export default App;
