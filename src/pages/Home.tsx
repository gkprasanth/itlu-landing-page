import About from "../components/About";
import Contact from "../components/Contact";
import Catering from "../components/Catering";
import FAQs from "../components/FAQs";
import FoodMarquee from "../components/FoodMarquee";
import Gallery from "../components/Gallery";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Location from "../components/Location";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";

function Home() {
  return (
    <>
      <Header />
      <Navbar value={true} />
      <Hero />
      <FoodMarquee />
      <About />
      <MenuCard />
      <Gallery />
      <Catering />
      <Testimonials />
      <FAQs />
      <Contact
        sectionTitle="Contact"
        titleHighlight="Our Veg Restaurant"
        description="We'd love to hear from you! Reach out to us for reservations, feedback, or to learn more about our authentic vegetarian menu and homely dining experience."
        formTitle="Get In Touch!"
        submitButtonText="SEND MESSAGE NOW"
      />
      <Location />
    </>
  );
}

export default Home;
