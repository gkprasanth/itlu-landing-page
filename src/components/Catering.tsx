import { useEffect, useState } from "react";
import "../Catering.css";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { CateringItem } from "../lib/api";

interface CateringProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  cateringImage?: string;
  videoLink?: string;
  buttonText?: string;
  buttonLink?: string;
  maskImages?: {
    container?: string;
    thumb?: string;
  };
}

const Catering: React.FC<CateringProps> = ({
  sectionSubtitle = "Catering",
  sectionTitle = "Our Catering Services",
  cateringImage = "/catering.jpeg",
  videoLink = "https://www.youtube.com/watch?v=_sI_Ps7JSEk",
  buttonText = "Contact Us for Catering",
  buttonLink = "#contact-sec",
  maskImages = {
    container: "/assets/img/bg/opening-bg-mask.png",
    thumb: "/assets/img/bg/opening-1-mask.png",
  },
}) => {
  const [remoteCatering, setRemoteCatering] = useState<CateringItem | null>(null);

  useEffect(() => {
    const applyMask = () => {
      const maskElement = document.querySelector(
        ".opening-container-wrap[data-mask-src]",
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
      const thumbMaskElement = document.querySelector(
        ".opening-1-thumb[data-mask-src]",
      );
      if (thumbMaskElement) {
        const thumbMaskSrc = thumbMaskElement.getAttribute("data-mask-src");
        if (thumbMaskSrc) {
          (thumbMaskElement as HTMLElement).style.maskImage =
            `url(${thumbMaskSrc})`;
          (thumbMaskElement as HTMLElement).style.webkitMaskImage =
            `url(${thumbMaskSrc})`;
          thumbMaskElement.classList.add("bg-mask");
        }
      }
    };

    const timer = setTimeout(applyMask, 100);
    (async () => {
      try {
        const items = await apiGet<CateringItem[]>(endpoints.catering);
        if (items && items.length > 0) setRemoteCatering(items.sort((a, b) => a.order - b.order)[0]);
      } catch (err) {
        console.warn("Failed to load catering:", err);
      }
    })();

    return () => clearTimeout(timer);
  }, []);

  const finalCateringImage = remoteCatering?.image || cateringImage;
  const finalTitle = remoteCatering?.title || sectionTitle;
  const finalDescription = remoteCatering?.description || "We provide professional catering services for all your special occasions. From intimate gatherings to grand celebrations, our authentic vegetarian cuisine will delight your guests.";

  return (
    <div>
      <section className="opening-sec-1 space overflow-hidden" id="catering-sec">
        <div className="container">
          <div
            className="opening-container-wrap"
            data-mask-src={maskImages.container}
          >
            <div className="row gy-40 align-items-center">
              <div className="col-xl-7">
                <div
                  className="opening-1-thumb"
                  data-mask-src={maskImages.thumb}
                >
                  <img src={finalCateringImage} alt="img" onError={onImgErrorFallback(cateringImage)} />
                  <div className="opening-1-video">
                    <a href={videoLink} className="play-btn popup-video"></a>
                  </div>
                </div>
              </div>
              <div className="col-xl-5">
                <div className="opening-right">
                  <div className="title-area text-center mb-40">
                    <span className="sub-title text-anime-style-1">
                      {sectionSubtitle}
                    </span>
                    <h2 className="sec-title text-anime-style-2 text-white">
                      {finalTitle}
                    </h2>
                  </div>
                  <div className="catering-content text-center mb-40 wow fadeinup" data-wow-delay=".4s">
                    <p className="text-white opacity-75">
                      {finalDescription}
                    </p>
                  </div>
                  <div
                    className="bottom text-center mt-40 wow fadeinup"
                    data-wow-delay=".2s"
                  >
                    <a href={buttonLink} className="book-table-btn">
                      {buttonText}
                    </a>
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

export default Catering;
