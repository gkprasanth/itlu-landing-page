import { useEffect, useState } from "react";
import "../FoodMarquee.css";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { FoodCategory } from "../lib/api";

interface UnifiedMenuItem {
  _id?: string;
  name?: string;
  itemsAvailable?: number;
  image?: string;
  order?: number;
}

interface MenuItem extends UnifiedMenuItem {
  id: number;
  title: string;
  itemCount: number;
  icon: string;
  category: string;
  slug: string;
}

interface FoodMarqueeProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  titleHighlight?: string;
  titleDecorationImage?: string;
  menuItems?: MenuItem[];
  categoryCardBottomImage?: string;
  itemsAvailableText?: string;
  arrowIcons?: {
    prev?: string;
    next?: string;
  };
  swiperOptions?: {
    speed?: number;
    autoplayDelay?: number;
  };
}

const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    title: "South Indian Thali",
    itemCount: 12,
    icon: "/assets/img/category/category_1-1.png",
    category: "thali",
    slug: "south-indian-thali",
  },
  {
    id: 2,
    title: "Paneer Butter Masala",
    itemCount: 10,
    icon: "/assets/img/category/category_1-2.png",
    category: "curries",
    slug: "paneer-butter-masala",
  },
  {
    id: 3,
    title: "Masala Dosa",
    itemCount: 8,
    icon: "/assets/img/category/category_1-2.png",
    category: "south-indian",
    slug: "masala-dosa",
  },
  {
    id: 4,
    title: "Dal Tadka",
    itemCount: 9,
    icon: "/assets/img/category/category_1-4.png",
    category: "dal",
    slug: "dal-tadka",
  },
  {
    id: 5,
    title: "Mixed Veg Sabzi",
    itemCount: 7,
    icon: "/assets/img/category/category_1-5.png",
    category: "vegetables",
    slug: "mixed-veg-sabzi",
  },
  {
    id: 6,
    title: "Gulab Jamun",
    itemCount: 5,
    icon: "/assets/img/category/category_1-1.png",
    category: "desserts",
    slug: "gulab-jamun",
  },
];

const FoodMarquee: React.FC<FoodMarqueeProps> = ({
  sectionSubtitle = "Veg Food Category",
  sectionTitle = "Traditional Indian",
  titleHighlight = "Veg Dishes",
  titleDecorationImage = "/assets/img/icon/title-shape.png",
  menuItems = defaultMenuItems,
  categoryCardBottomImage = "/assets/img/icon/cat-1-bottom.png",
  itemsAvailableText = "Items Available",
  arrowIcons = {
    prev: "/assets/img/icon/left-arrow.svg",
    next: "/assets/img/icon/right-arrow.svg",
  },
  swiperOptions = {
    speed: 1000,
    autoplayDelay: 2000,
  },
}) => {
  // Duplicate items for seamless infinite scroll
  const [remoteItems, setRemoteItems] = useState<FoodCategory[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await apiGet<FoodCategory[]>(endpoints.foodCategories);
        setRemoteItems(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (err) {
        console.warn("Failed to load food categories:", err);
      }
    })();
  }, []);

 
  const sourceItems = (remoteItems && remoteItems.length > 0 ? remoteItems : menuItems) as UnifiedMenuItem[];
  const normalized = sourceItems.map((it, idx) => ({
    id: it._id || idx,
    title: it.title || it.name || `Item ${idx}`,
    itemCount: it.itemCount || it.itemsAvailable || 0,
    icon: it.icon || it.image || "/assets/img/icon/default.png",
    category: it.category || it.slug || "",
    slug: it.slug || String(idx),
  }));

  const duplicatedItems = [...normalized, ...normalized];

  useEffect(() => {
    const initSlider = () => {
      type SwiperInstance = { destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void }
      interface WindowWithSwiper extends Window {
        Swiper?: new (el: Element | string, options?: unknown) => SwiperInstance
      }
      const w = window as unknown as WindowWithSwiper
      if (typeof window !== "undefined" && w.Swiper) {
        const Swiper = w.Swiper
        const sliderElement = document.getElementById("catSlider1") as (HTMLElement & { swiper?: SwiperInstance }) | null

        if (!sliderElement) return

        // Destroy existing swiper instance if any
        if (sliderElement.swiper) {
          sliderElement.swiper.destroy(true, true)
        }

        const prevBtn = document.querySelector(".slider-prev") || undefined
        const nextBtn = document.querySelector(".slider-next") || undefined

        const options = {
          slidesPerView: 1,
          spaceBetween: 24,
          loop: true,
          speed: swiperOptions.speed,
          autoplay: {
            delay: swiperOptions.autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          freeMode: false,
          grabCursor: true,
          navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
            1400: { slidesPerView: 6 },
          },
        }

        try {
          new Swiper(sliderElement, options)
          console.log("Swiper initialized successfully")
        } catch (error) {
          console.error("Error initializing Swiper:", error)
        }
      } else {
        console.warn("Swiper library not loaded")
      }
    }

    // Try to init immediately
    initSlider();

    // Also try after a delay to ensure DOM is ready
    const timer = setTimeout(initSlider, 500);

    return () => clearTimeout(timer);
  }, [swiperOptions.speed, swiperOptions.autoplayDelay]);

  return (
    <div>
      <section className="space overflow-hidden space-extra-bottom">
        <div className="container">
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
                onError={onImgErrorFallback(titleDecorationImage)}
              />
            </div>
          </div>
          <div className="slider-area">
            <div
              className="swiper th-slider"
              id="catSlider1"
              data-slider-options='{"loop":true,"breakpoints":{"0":{"slidesPerView":1},"576":{"slidesPerView":2},"768":{"slidesPerView":3},"992":{"slidesPerView":4},"1200":{"slidesPerView":5},"1400":{"slidesPerView":6}}}'
            >
              <div className="swiper-wrapper ">
                {duplicatedItems.map((item, index) => (
                  <div className="swiper-slide" key={`${item.id}-${index}`}>
                    <div
                      className="category-card hover:bg-gradient-to-br from-amber-500 via-yellow-500 to-green-700"
                      style={{ position: "relative" }}
                    >
                      <img
                        className="cat-i-bottom"
                        src={categoryCardBottomImage}
                        alt="img"
                        onError={onImgErrorFallback(categoryCardBottomImage)}
                      />
                      <div className="box-icon">
                        <img src={item.icon} alt={item.title} onError={onImgErrorFallback(item.icon || defaultMenuItems[index % defaultMenuItems.length].icon)} />
                      </div>
                      <h3 className="box-title">
                        <a href={`/category/${item.slug}`}>{item.title}</a>
                      </h3>
                      <p className="box-subtitle">
                        {item.itemCount} {itemsAvailableText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="slider-arrow slider-prev"
              type="button"
              aria-label="Previous slide"
            >
              <img src={arrowIcons.prev} alt="" />
            </button>
            <button
              className="slider-arrow slider-next"
              type="button"
              aria-label="Next slide"
            >
              <img src={arrowIcons.next} alt="" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodMarquee;
