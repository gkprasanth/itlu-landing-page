import { useEffect, useState } from "react";
import "../Events.css";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { EventItem } from "../lib/api";

interface EventTiming {
  days: string;
  open: string;
  close: string;
}

interface EventsProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  eventImage?: string;
  videoLink?: string;
  timings?: EventTiming[];
  buttonText?: string;
  buttonLink?: string;
  maskImages?: {
    container?: string;
    thumb?: string;
  };
}

const defaultTimings: EventTiming[] = [
  {
    days: "Monday to Tuesday",
    open: "10:00 AM",
    close: "20:00 PM",
  },
  {
    days: "Friday to Sunday",
    open: "12:00 AM",
    close: "23:00 PM",
  },
];

const Events: React.FC<EventsProps> = ({
  sectionSubtitle = "Events",
  sectionTitle = "Our Events",
  eventImage = "/assets/img/opening/opening-1-left.jpg",
  videoLink = "https://www.youtube.com/watch?v=_sI_Ps7JSEk",
  timings = defaultTimings,
  buttonText = "Book your Table",
  buttonLink = "/menu",
  maskImages = {
    container: "/assets/img/bg/opening-bg-mask.png",
    thumb: "/assets/img/bg/opening-1-mask.png",
  },
}) => {
  const [remoteEvent, setRemoteEvent] = useState<EventItem | null>(null);

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
        const items = await apiGet<EventItem[]>(endpoints.events);
        if (items && items.length > 0) setRemoteEvent(items.sort((a, b) => a.order - b.order)[0]);
      } catch (err) {
        console.warn("Failed to load events:", err);
      }
    })();

    return () => clearTimeout(timer);
  }, []);
  const finalEventImage = remoteEvent?.image || eventImage;
  const finalTimings = remoteEvent
    ? [
        { days: "Monday to Thursday", open: remoteEvent.mondayToThursday.startTime, close: remoteEvent.mondayToThursday.endTime },
        { days: "Friday to Saturday", open: remoteEvent.fridayToSaturday.startTime, close: remoteEvent.fridayToSaturday.endTime },
      ]
    : timings;

  return (
    <div>
      <section className="opening-sec-1 space overflow-hidden " id="events-sec">
        <div className="container">
          <div
            className="opening-container-wrap bg-gradient-to-br from-amber-00 via-yellow-500 to-green-700"
            data-mask-src={maskImages.container}
          >
            <div className="row gy-40 align-items-center ">
              <div className="col-xl-7">
                <div
                  className="opening-1-thumb"
                  data-mask-src={maskImages.thumb}
                >
                  <img src={finalEventImage} alt="img" onError={onImgErrorFallback(eventImage)} />
                  <div className="opening-1-video">
                    <a href={videoLink} className="play-btn popup-video"></a>
                  </div>
                </div>
              </div>
              <div className="col-xl-5">
                <div className="opening-right">
                  <div className="title-area text-center mb-60">
                    <span className="sub-title text-anime-style-1">
                      {sectionSubtitle}
                    </span>
                    <h2 className="sec-title text-anime-style-2 text-white">
                      {sectionTitle}
                    </h2>
                  </div>
                  <div
                    className="time-table-wrap me-xl-5 wow fadeinup"
                    data-wow-delay=".4s"
                  >
                    {finalTimings.map((item, idx) => (
                      <div className="item" key={item.days + idx}>
                        <p className="box-text">{item.days}</p>
                        <div className="open-time">
                          <h4 className="box-title">{item.open}</h4>
                          <h4 className="box-title">{item.close}</h4>
                        </div>
                      </div>
                    ))}
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

export default Events;
