import { ImageOverlay } from "react-leaflet";
import Footer from "../components/Footer";
import HealthMap from "../components/HealthMap";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <HealthMap />
      <Footer />
    </>
  );
};

export default Home;
