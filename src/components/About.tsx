import { useEffect, useState } from "react";
import "../About.css";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { AboutSection, HowWeWorkItem } from "../lib/api";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  image: string;
  delay: string;
}

interface AboutProps {
  aboutImage?: string;
  aboutImageAlt?: string;
  shapeImages?: {
    left?: string;
    right?: string;
  };
  sectionSubtitle?: string;
  sectionTitle?: string;
  titleHighlight?: string;
  description?: string;
  ownerName?: string;
  ownerTitle?: string;
  buttonText?: string;
  buttonLink?: string;
  processSectionSubtitle?: string;
  processSectionTitle?: string;
  processSectionDescription?: string;
  processSteps?: ProcessStep[];
  maskImages?: {
    outer?: string;
    inner?: string;
  };
}

const defaultProcessSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Order Your Favorites",
    description:
      "Browse our menu filled with delicious dishes, from signature specials to classic foods.",
    image: "/assets/img/process/process-3-1.png",
    delay: ".2s",
  },
  {
    number: "02",
    title: "Freshly Prepared with Care",
    description:
      "Our chefs get to work, preparing your meal with fresh, high-quality ingredients.",
    image: "/assets/img/process/process-3-2.png",
    delay: ".4s",
  },
  {
    number: "03",
    title: "Enjoy & Savor Every Bite",
    description:
      "Relax and enjoy your food in our cozy restaurant, or take it to-go. Great taste, great service",
    image: "/assets/img/process/process-3-3.png",
    delay: ".6s",
  },
];

const About: React.FC<AboutProps> = ({
  aboutImage = "/assets/img/about/about_1_1.png",
  aboutImageAlt = "About",
  shapeImages = {
    left: "/assets/img/shape/about-shape-1.1.png",
    right: "/assets/img/shape/about-shape-1.2.png",
  },
  sectionSubtitle = "About our restaurant",
  sectionTitle = "Inviting you to experience our",
  titleHighlight = "Traditional Veg restaurant",
  description = "Rooted in the rich heritage of Indian vegetarian cuisine, ITLU brings you the flavors of home-cooked meals, crafted with love and tradition. Our chefs use time-honored recipes and the freshest ingredients to create dishes that celebrate the diversity and depth of vegetarian food. We believe that the best meals are those shared with loved ones, where every bite tells a story of heritage, culture, and love. At ITLU, we're not just serving food – we're preserving traditions, creating connections, and building a community around the shared love of exceptional vegetarian cuisine.",
  ownerName = "Suraj",
  ownerTitle = "Restaurant owner",
  buttonText = "VISIT OUR RESTAURANT",
  buttonLink = "/menu",
  processSectionSubtitle = "Work Process",
  processSectionTitle = "how we work process!",
  processSectionDescription = "Here's a simple and clear 3-step work process for a restaurant, ideal for a website section or brochure to show how your service flows — especially for dine-in or traditional restaurants",
  processSteps = defaultProcessSteps,
  maskImages = {
    outer: "/assets/img/bg/process-sec-2-bg-mask.png",
    inner: "/assets/img/bg/process-sec-2-bg-inner.png",
  },
}) => {
  const [aboutRemote, setAboutRemote] = useState<AboutSection | null>(null);
  const [howItems, setHowItems] = useState<HowWeWorkItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const a = await apiGet<AboutSection>(endpoints.aboutSection);
        setAboutRemote(a);
      } catch (err) {
        console.warn("Failed to load about section:", err);
      }
    })();

    (async () => {
      try {
        const items = await apiGet<HowWeWorkItem[]>(endpoints.howWeWork);
        setHowItems(items.sort((x, y) => x.order - y.order));
      } catch (err) {
        console.warn("Failed to load how-we-work:", err);
      }
    })();
  }, []);

  const finalAboutImage = aboutRemote?.leftImage || aboutImage;
  const finalSectionSubtitle = aboutRemote?.rightTitle1 || sectionSubtitle;
  const finalSectionTitle = aboutRemote?.rightTitle2 || sectionTitle;
  const finalTitleHighlight = aboutRemote?.legendTitle || titleHighlight;
  const finalDescription = aboutRemote?.description || description;
  const finalProcessSteps =
    howItems.length > 0
      ? howItems.map((it, idx) => ({
        number: String(idx + 1).padStart(2, "0"),
        title: it.title,
        description: it.description,
        image: it.image,
        delay: `.${(idx + 1) * 2}s`,
      }))
      : processSteps;
  useEffect(() => {
    const applyMask = () => {
      const outerMaskElement = document.querySelector(
        ".process-sec-2-container-wrap[data-mask-src]",
      );
      if (outerMaskElement) {
        const maskSrc = outerMaskElement.getAttribute("data-mask-src");
        if (maskSrc) {
          (outerMaskElement as HTMLElement).style.maskImage = `url(${maskSrc})`;
          (outerMaskElement as HTMLElement).style.webkitMaskImage =
            `url(${maskSrc})`;
          outerMaskElement.classList.add("bg-mask");
        }
      }
    };

    const timer = setTimeout(applyMask, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div
        className="space space-extra-bottom"
        id="about-sec"
        style={{ overflow: "visible" }}
      >
        <div className="container">
          <div className="row gy-40 gx-80 align-items-center">
            <div className="col-xl-7 ps-xl-5">
              <div className="img-box1 ms-xl-2 flex justify-center xl:justify-start">
                <div className="relative inline-block gsap-fade-left">
                  {/* Rotating Mandala Background - Perfectly Centered on Image */}
                  <div
                    className="mandala-bg-rotate"
                    style={{
                      position: "absolute",
                      width: "130%",
                      height: "130%",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      opacity: 0.35,
                      zIndex: 0,
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      src="/order-now-mandala.png"
                      alt="Mandala Decor"
                      style={{ width: "100%", height: "100%", objectFit: "contain", marginLeft: "20px" }}
                    />
                  </div>
                  <img
                    src={finalAboutImage}
                    alt={aboutImageAlt}
                    className="relative z-10"
                    style={{ display: "block" }}
                    onError={onImgErrorFallback(aboutImage)}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-5 position-relative">
              <div className="shape-mockup jump-reverse d-none d-xl-block about-shape-left">
                <img
                  src={shapeImages.left}
                  alt="img"
                  onError={onImgErrorFallback(
                    shapeImages.left || "/assets/img/shape/about-shape-1.1.png",
                  )}
                />
              </div>
              <div className="shape-mockup jump d-none d-xl-block about-shape-right">
                <img
                  src={shapeImages.right}
                  alt="img"
                  onError={onImgErrorFallback(
                    shapeImages.right ||
                    "/assets/img/shape/about-shape-1.2.png",
                  )}
                />
              </div>
              <div className="title-area mb-1">
                <span className="sub-title text-anime-style-1">
                  {finalSectionSubtitle}
                </span>
                <h2 className="sec-title text-anime-style-2">
                  {finalSectionTitle} <br />
                  <span className="text-theme">{finalTitleHighlight}</span>
                </h2>
                <p
                  className="box-text me-xl-5 pe-xl-3 wow fadeinup"
                  data-wow-delay=".3s"
                >
                  {finalDescription}
                </p>
                <div
                  className="about-1-owner wow fadeinup"
                  data-wow-delay=".5s"
                >
                  <h4 className="box-title">{ownerName}</h4>
                  <p>{ownerTitle}</p>
                </div>
                <a
                  href={buttonLink}
                  className="order-now-btn visit-restaurant-btn wow fadeinup"
                  data-wow-delay=".7s"
                >
                  {buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="process-sec-2 overflow-hidden">
        <div className="container">
          <div
            className="process-sec-2-container-wrap"
            data-mask-src={maskImages.outer}
          >
            <div className="row gy-4 justify-content-center align-items-center process-row-responsive">
              <div className="col-xl-5 col-lg-5 col-12 d-flex flex-column align-items-center text-center process-title-col-responsive">
                <div className="title-area mb-1 pe-xl-5 me-xl-5 process-title-area-responsive">
                  <span className="sub-title text-anime-style-1">
                    {processSectionSubtitle}
                  </span>
                  <h2 className="sec-title text-anime-style-2 text-white pe-xl-5">
                    {processSectionTitle}
                  </h2>
                  <p className="box-text text-white text-anime-style-3">
                    {processSectionDescription}
                  </p>
                </div>
              </div>
              <div className="col-xl-7 col-lg-7 col-12 d-flex justify-center items-center  ">
                <div
                  className="process-sec-2-bg-inner-wrap"
                  data-mask-src={maskImages.inner}
                >
                  <div className="row gy-40 justify-content-center items-center">
                    {finalProcessSteps.map((step, index) => (
                      <div
                        key={index}
                        className="col-xl-4 col-md-6 col-12 d-flex justify-content-center mb-3"
                      >
                        <div
                          className="process-box-2 wow fadeinright"
                          data-wow-delay={step.delay}
                        >
                          <div className="box-img">
                            <img
                              src={step.image}
                              alt="icon"
                              onError={onImgErrorFallback(
                                defaultProcessSteps[
                                  index % defaultProcessSteps.length
                                ]?.image ||
                                "/assets/img/process/process-3-1.png",
                              )}
                            />
                          </div>
                          <div className="content">
                            <p className="box-number">{step.number}</p>
                            <h3 className="box-title">{step.title}</h3>
                            <p className="box-text">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
