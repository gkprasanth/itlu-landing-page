import CircularText from "./CircularText";
import "../Hero.css";
import { useEffect, useState } from "react";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { HeroSection } from "../lib/api";

interface HeroProps {
  orderButtonText?: string;
  orderButtonLink?: string;
  circularText?: string;
  circularTextSpinDuration?: number;
  subTitle?: string;
  mainTitle?: string;
  heroImage?: string;
  heroImageAlt?: string;
  shapeImages?: {
    shape1?: string;
    shape2?: string;
    shape3?: string;
    shape4?: string;
    shape5?: string;
  };
}

const Hero: React.FC<HeroProps> = ({
  orderButtonText = "Order Now",
  orderButtonLink = "/",
  circularText = "MAKE FRESH EAT REFRESH",
  circularTextSpinDuration = 20,
  subTitle = "Traditional Veg Flavors",
  mainTitle = "Authentic Vegetarian Cuisine",
  heroImage = "assets/img/hero/hero-img.png",
  heroImageAlt = "Image",
  shapeImages = {
    shape1: "assets/img/icon/hero-1-1.png",
    shape2: "assets/img/icon/hero-1-2.png",
    shape3: "assets/img/icon/hero-1-3.png",
    shape4: "assets/img/icon/hero-1-4.png",
    shape5: "assets/img/icon/hero-1-5.png",
  },
}) => {
  const [remote, setRemote] = useState<HeroSection | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const hero = await apiGet<HeroSection>(endpoints.heroSection);
        setRemote(hero);
      } catch {
        // keep defaults
      }
    })();
  }, []);

  const finalHeroImage = remote?.backgroundImage || heroImage;
  const finalSubTitle = remote?.title1 || subTitle;
  const finalMainTitle = remote?.title2 || mainTitle;
  return (
    <div className="">
      <div className="th-hero-wrapper hero-1 bg-smoke" id="hero">
        <div className="hero-img-shape-1">
          <div className="logo-icon-wrap relative">
            {/* Rotating Mandala Background */}
            <div
              className="mandala-bg-rotate"
              style={{ width: "280px", height: "280px" }}
            >
              <img src="/order-now-mandala.png" alt="Order Now Mandala" />
            </div>

            <div className="logo-icon mb-4">
              <h4 className="order">
                <a href={orderButtonLink}>{orderButtonText}</a>
              </h4>
            </div>
            <CircularText
              text={circularText}
              onHover="speedUp"
              spinDuration={circularTextSpinDuration}
              className="custom-class"
            />
          </div>
        </div>
        <div
          className="shape-mockup movingX hero-shape-1-1"
          data-top="0%"
          data-right="5%"
        >
          <img src={shapeImages.shape1} alt="img" />
        </div>
        <div
          className="shape-mockup movingX hero-shape-1-2"
          style={{ top: "15%", right: "100%" }}
        >
          <img src={shapeImages.shape1} alt="img" />
        </div>
        <div
          className="shape-mockup hero-shape-1-2 gsap-scroll-rotate"
          data-top="35%"
          data-left="1%"
          style={{ top: "15%", left: "1%" }}
        >
          <img src={shapeImages.shape2} alt="img" />
        </div>
        <div
          className="shape-mockup jump-reverse hero-shape-1-3"
          data-top="5%"
          data-right="3%"
        >
          <img src={shapeImages.shape3} alt="img" />
        </div>
        <div
          className="shape-mockup movingX hero-shape-1-4"
          data-bottom="0%"
          data-left="5%"
        >
          <img src={shapeImages.shape4} alt="img" />
        </div>
        <div className="shape-mockup jump hero-shape-1-5">
          <img src={shapeImages.shape5} alt="img" />
        </div>

        <div className="hero-inner">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-8 col-lg-10">
                <div className="hero-style1">
                  <span className="sub-title gsap-scale-down-fade">
                    {finalSubTitle}
                  </span>
                  <h1 className="hero-title text-anime-style-2">
                    {" "}
                    {finalMainTitle}
                  </h1>
                  <div className="hero-img1 gsap-scale-up-fade">
                    <img
                      src={finalHeroImage}
                      alt={heroImageAlt}
                      onError={onImgErrorFallback(heroImage)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
