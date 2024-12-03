import { useState } from "react";
import { Footer, Navbar, Services, Transactions, Welcome } from "./components";
import DotsMobileStepper from "./components/Webinar/Webinar";
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
      <DotsMobileStepper />
      {/* <Services /> */}
      <Transactions />
      {/* <Footer /> */}
      {/* {
                showWebinar && <Webinar  />
            } */}
    </div>
  );
};

export default App;
