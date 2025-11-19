import { useEffect, useState } from "react";
import "../Testimonials.css";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { Testimonial as TestimonialType } from "../lib/api";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  img: string;
  quote: string;
  stars: number;
}

interface TestimonialsProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  titleHighlight?: string;
  testimonials?: Testimonial[];
  titleDecorationImage?: string;
  decorationImages?: {
    topLeft?: string;
    heroDecoration?: string;
  };
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Prabhas",
    role: "Hero",
    text: "The thali here reminded me of my grandmother's kitchen. Every dish was bursting with flavor and tradition!",
    img: "/assets/img/testimonial/testi-1-1.png",
    quote: "/assets/img/icon/testi-1-quote.png",
    stars: 5,
  },
  {
    name: "Sai Pallavi",
    role: "Heroine",
    text: "As a vegetarian, I finally found a place that celebrates authentic Indian food. The dosas and sweets are a must-try!",
    img: "/assets/img/testimonial/testi-1-2.png",
    quote: "/assets/img/icon/testi-1-quote.png",
    stars: 5,
  },
];

const Testimonials: React.FC<TestimonialsProps> = ({
  sectionSubtitle = "Testimonials",
  sectionTitle = "Our Guests",
  titleHighlight = "Love Our Veg Cuisine",
  testimonials = defaultTestimonials,
  titleDecorationImage = "/assets/img/icon/title-shape.png",
  decorationImages = {
    topLeft: "/assets/img/icon/testi-top-1-2.png",
    heroDecoration: "/assets/img/icon/hero-1-3.png",
  },
}) => {
  const [remoteTestimonials, setRemoteTestimonials] = useState<TestimonialType[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await apiGet<TestimonialType[]>(endpoints.testimonials);
  // Helpful debug: log what we received from the API so you can confirm
  // the backend returned the updated image URL.
  console.info("Testimonials fetched from API:", items);
        setRemoteTestimonials(items.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.warn("Failed to load testimonials:", err);
      }
    })();
  }, []);

  const finalTestimonials = remoteTestimonials && remoteTestimonials.length > 0 ? remoteTestimonials.map((r) => ({
    name: r.name,
    role: r.role,
    text: r.text,
    img: r.image,
    quote: r.quoteImage || "/assets/img/icon/testi-1-quote.png",
    stars: r.stars || 5,
  })) : testimonials;
  return (
    <div>
      <section
        className="testi-area-1 space-bottom"
        id="testi-sec"
        style={{ position: "relative", overflow: "visible" }}
      >
        <div
          className="shape-mockup d-none d-xxl-block jump"
          style={{ bottom: "2%", left: 0 }}
        >
          <img src={decorationImages.topLeft} alt="img" onError={onImgErrorFallback(decorationImages.topLeft || "/assets/img/icon/testi-top-1-2.png")} />
        </div>
        <div className="container" style={{ position: "relative" }}>
          {/* Hero shape positioned near left card */}
          <div className="testi-hero-decoration">
            <img src={decorationImages.heroDecoration} alt="decoration" onError={onImgErrorFallback(decorationImages.heroDecoration || "/assets/img/icon/hero-1-3.png")} />
          </div>

          <div className="title-area text-center mb-60">
            <span className="sub-title text-anime-style-1">
              {sectionSubtitle}
            </span>
            <h2 className="sec-title text-anime-style-2">
              {sectionTitle}{" "}
              <span className="text-theme">{titleHighlight}</span>
            </h2>
            <div className="centered-decor-line">
                <img
                  className="img-anime-style-1"
                  src={titleDecorationImage}
                  alt="img"
                  onError={onImgErrorFallback(titleDecorationImage || "/assets/img/icon/title-shape.png")}
                />
            </div>
          </div>
          <div className="row gy-40 gx-30">
            {finalTestimonials.map((t, idx) => (
              <div className="col-xl-6" key={t.name + idx}>
                <div
                  className={`testi-1-item wow ${idx % 2 === 0 ? "fadeinleft" : "fadeinright"}`}
                  data-wow-delay=".3s"
                >
                  <div className="client-thumb">
                    <img src={t.img} alt="img" onError={onImgErrorFallback(t.img || "/assets/img/testimonial/testi-1-1.png")} />
                  </div>
                  <div className="content">
                    <img className="testi-1-quote" src={t.quote} alt="icon" onError={onImgErrorFallback(t.quote || "/assets/img/icon/testi-1-quote.png")} />
                    <p className="box-text">"{t.text}"</p>
                  </div>
                  <div className="bottom">
                    <h4 className="box-title">{t.name}</h4>
                    <p>{t.role} </p>
                    <div className="th-social">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <i className="fa-solid fa-star" key={i}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
