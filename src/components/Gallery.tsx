import { useEffect, useState } from "react";
import "../Gallery.css";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { GalleryItem as GalleryItemType } from "../lib/api";

interface GalleryItem {
  img: string;
  alt: string;
}

interface GalleryProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  titleHighlight?: string;
  titleDecorationImage?: string;
  galleryItems?: GalleryItem[];
  maskImage?: string;
  buttonLink?: string;
  arrowIcons?: {
    left?: string;
    right?: string;
    plus?: string;
  };
}

const defaultGalleryItems: GalleryItem[] = [
  {
    img: "/assets/img/gallery/gallery_1_1.jpg",
    alt: "Traditional Veg Thali",
  },
  {
    img: "/assets/img/gallery/gallery_1_2.jpg",
    alt: "Paneer Butter Masala",
  },
  {
    img: "/assets/img/gallery/gallery_1_3.jpg",
    alt: "South Indian Dosa",
  },
  {
    img: "/assets/img/gallery/gallery_1_4.jpg",
    alt: "Mixed Veg Curry",
  },
  {
    img: "/assets/img/gallery/gallery_1_5.jpg",
    alt: "Dal Tadka & Rice",
  },
  {
    img: "/assets/img/gallery/gallery_1_6.jpg",
    alt: "Indian Sweets Platter",
  },
];

const Gallery: React.FC<GalleryProps> = ({
  sectionSubtitle = "Our Food Gallery",
  sectionTitle = "Explore Our",
  titleHighlight = "Traditional Veg Dishes",
  titleDecorationImage = "/assets/img/icon/title-shape.png",
  galleryItems = defaultGalleryItems,
  maskImage = "/assets/img/bg/gallery-1-mask.png",
  arrowIcons = {
    left: "/assets/img/icon/left-arrow.svg",
    right: "/assets/img/icon/right-arrow.svg",
    plus: "/assets/img/icon/plus-icon.svg",
  },
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [remoteItems, setRemoteItems] = useState<GalleryItemType[] | null>(null);

  const openImageModal = (item: GalleryItem, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedImage(item);
    document.body.style.overflow = "hidden"; 
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; 
  };

  useEffect(() => {
    (async () => {
      try {
        const items = await apiGet<GalleryItemType[]>(endpoints.gallery);
        setRemoteItems(items.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.warn("Failed to load gallery items:", err);
      }
    })();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    // Initialize gallery slider
    const initGallerySlider = () => {
      if (
        typeof window !== "undefined" &&
        (window as any).$ &&
        (window as any).Swiper
      ) {
        const $ = (window as any).$;
        const Swiper = (window as any).Swiper;

        const sliderElement = $("#gallerySlider1");

        // Destroy existing instance
        if (sliderElement[0] && sliderElement[0].swiper) {
          sliderElement[0].swiper.destroy(true, true);
        }

        const prevBtn = $('[data-slider-prev="#gallerySlider1"]');
        const nextBtn = $('[data-slider-next="#gallerySlider1"]');

        new Swiper(sliderElement.get(0), {
          loop: true,
          centeredSlides: true,
          spaceBetween: 30,
          speed: 800,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: nextBtn.get(0),
            prevEl: prevBtn.get(0),
          },
          breakpoints: {
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            576: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1.5,
              spaceBetween: 24,
            },
            992: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          },
        });
      }

      // Apply mask to slider-area-wrap
      const maskElement = document.querySelector(
        ".slider-area-wrap[data-mask-src]",
      );
      if (maskElement) {
        const maskSrc = maskElement.getAttribute("data-mask-src");
        if (maskSrc) {
          (maskElement as HTMLElement).style.maskImage = `url(${maskSrc})`;
          (maskElement as HTMLElement).style.webkitMaskImage =
            `url(${maskSrc})`;
          maskElement.classList.add("bg-mask");
        }
      }
    };

    const timer = setTimeout(initGallerySlider, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div
        className="gallery-sec-1 space bg-smoke overflow-hidden"
        id="gallery-sec-1"
      >
        <div className="container">
          <div
            className="title-area secTitle-gsap-anim-1 text-center mb-60"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span className="sub-title text-anime-style-1">
              {sectionSubtitle}
            </span>
            <h2
              className="sec-title text-anime-style-2"
              style={{ textAlign: "center" }}
            >
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
        </div>
        <div className="slider-area">
          <div className="slider-area-wrap" data-mask-src={maskImage}>
            <div
              className="swiper th-slider has-shadow gallery-1-slider"
              id="gallerySlider1"
            >
              <div className="swiper-wrapper">
                {((remoteItems && remoteItems.length > 0
                  ? remoteItems.map((ri) => ({ img: ri.image, alt: ri.title }))
                  : galleryItems) as GalleryItem[]).map((item, idx) => (
                  <div className="swiper-slide" key={(item.img || '') + idx}>
                    <div className="gallery-thumb-1">
                      <img src={item.img} alt={item.alt} onError={onImgErrorFallback(galleryItems[idx]?.img || defaultGalleryItems[idx % defaultGalleryItems.length].img)} />
                      <a
                        href="#"
                        className="gallery-btn popup-image"
                        onClick={(e) => openImageModal(item, e)}
                      >
                        <img src={arrowIcons.plus} alt="img" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            data-slider-prev="#gallerySlider1"
            className="slider-arrow slider-prev"
          >
            <img src={arrowIcons.left} alt="" />
          </button>
          <button
            data-slider-next="#gallerySlider1"
            className="slider-arrow slider-next"
          >
            <img src={arrowIcons.right} alt="" />
          </button>
        </div>
      </div>

      {/* Image Modal/Popup */}
      {selectedImage && (
        <div
          className="image-modal-overlay"
          onClick={closeImageModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px",
          }}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              className="modal-close-btn"
              onClick={closeImageModal}
              style={{
                position: "absolute",
                top: "-50px",
                right: "0",
                background: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000000",
                transition: "all 0.3s ease",
                zIndex: 100000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f0f0";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ✕
            </button>
            <img
              src={selectedImage.img}
              alt={selectedImage.alt}
              onError={onImgErrorFallback(defaultGalleryItems[0].img)}
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              }}
            />
            <p
              style={{
                color: "#ffffff",
                marginTop: "20px",
                fontSize: "18px",
                fontWeight: "600",
                textAlign: "center",
                fontFamily: '"Barlow Condensed", sans-serif',
              }}
            >
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
