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
import {
  MandalaSVG,
  KolamBorder,
  SectionDivider,
} from "../components/DecorativeElements";

function Home() {
  return (
    <div className="relative overflow-hidden">
      <Header />
      <Navbar value={true} />

      <div className="relative">
        <MandalaSVG className="mandala-top-right mandala-float margin-top-40" />
        <Hero />
        <KolamBorder />
      </div>

      <FoodMarquee />

      <div className="relative">
        <About />
        <MandalaSVG className="mandala-bottom-left" style={{ opacity: 0.1 }} />
      </div>

      <SectionDivider />
      <MenuCard />

      <div className="relative">
        <KolamBorder
          style={{ transform: "rotate(180deg)", marginTop: "-20px" }}
        />
        <Gallery />
        <KolamBorder style={{ marginTop: "20px" }} />
      </div>

      <div className="relative">
        <MandalaSVG
          className="mandala-top-right"
          style={{
            top: "10%",
            right: "-50px",
            width: "200px",
            height: "200px",
          }}
        />
        <Catering />
      </div>

      <Testimonials />

      <SectionDivider />
      <FAQs />

      <div className="relative bg-smoke">
        <KolamBorder style={{ marginTop: "20px" }} />
        <Contact
          sectionTitle="Contact"
          titleHighlight="Our Veg Restaurant"
          description="We'd love to hear from you! Reach out to us for reservations, feedback, or to learn more about our authentic vegetarian menu and homely dining experience."
          formTitle="Get In Touch!"
          submitButtonText="SEND MESSAGE NOW"
        />
      </div>

      <Location />
    </div>
  );
}

export default Home;
