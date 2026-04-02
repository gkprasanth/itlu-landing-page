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
    name: "Richard Chuang",
    role: "Customer",
    text: "The food here is wonderfully authentic and absolutely delicious! I love this place! Although I am not as familiar with the Indian cuisine, but I see all other guests are Indians, so I’m more confident that the food must be authentic enough without too much of localized modifications. The dosa is a must-try. The décor is modern yet filled with vibrant Indian touches. The curries and spices are excellent, though some dishes might be a bit spicy for kids who aren’t used to Indian food. The staff are efficient, polite, and incredibly friendly. As first-time visitors still exploring the menu, we really appreciated how helpful and welcoming they were.",
    img: "/assets/img/testimonial/testi-1-1.png",
    quote: "/assets/img/icon/testi-1-quote.png",
    stars: 5,
  },
  {
    name: "Viraj Wadhwa",
    role: "Customer",
    text: "Incredible 10/10 all veg south indian food. I especially loved the paneer tikka kebab, vada, curry leaf mushroom, veggie uttappam, and filtered coffee, but everything was solid. They have lots of options. Highly recommend this place, don't miss it",
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
}) => {
  const [remoteTestimonials, setRemoteTestimonials] = useState<
    TestimonialType[] | null
  >(null);

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

  const finalTestimonials =
    remoteTestimonials && remoteTestimonials.length > 0
      ? remoteTestimonials.map((r) => ({
          name: r.name,
          role: r.role,
          text: r.text,
          img: r.image,
          quote: r.quoteImage || "/assets/img/icon/testi-1-quote.png",
          stars: r.stars || 5,
        }))
      : testimonials;
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
          {/* <img
            src={decorationImages.topLeft}
            alt="img"
            onError={onImgErrorFallback(
              decorationImages.topLeft || "/assets/img/icon/testi-top-1-2.png",
            )}
          /> */}
        </div>
        <div className="container" style={{ position: "relative" }}>
          {/* Hero shape positioned near left card */}
          {/* <div className="testi-hero-decoration">
            <img
              src={decorationImages.heroDecoration}
              alt="decoration"
              onError={onImgErrorFallback(
                decorationImages.heroDecoration ||
                  "/assets/img/icon/hero-1-3.png",
              )}
            />
          </div> */}

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
                onError={onImgErrorFallback(
                  titleDecorationImage || "/assets/img/icon/title-shape.png",
                )}
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
                  <div className="content">
                    <img
                      className="testi-1-quote"
                      src={t.quote}
                      alt="icon"
                      onError={onImgErrorFallback(
                        t.quote || "/assets/img/icon/testi-1-quote.png",
                      )}
                    />
                    <p className="box-text">"{t.text}"</p>
                  </div>
                  <div className="bottom">
                    <h4 className="box-title">{t.name}</h4>
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
