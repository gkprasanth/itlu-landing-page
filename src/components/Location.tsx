import { useEffect, useState } from "react";
import { Facebook, Twitter, Linkedin, Phone } from "lucide-react";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { LocationSection } from "../lib/api";

function Location() {
  const [data, setData] = useState<LocationSection | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiGet<LocationSection>(endpoints.locationSection);
        if (mounted) setData(res);
      } catch (err) {
        // Keep using static defaults if fetch fails
        // console.warn left intentionally for debugging during development
        console.warn("Could not load location section from API, using defaults", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const defaults: LocationSection = {
    address: "Cable Bridge Rd, Masthan Nagar, CBI Colony, Jubilee Hills, Hyderabad, Telangana 500033",
    openingLine1: "Monday - Saturday: 6:00pm – 10:00pm",
    openingLine2: "Sunday: is the holiday",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      twitter: "https://www.twitter.com/",
      linkedin: "https://www.linkedin.com/",
      whatsapp: "https://www.whatsapp.com/",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.7310056272386!2d89.2286059153658!3d24.00527418490799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fe9b97badc6151%3A0x30b048c9fb2129bc!2sAngfuztheme!5e0!3m2!1sen!2sbd!4v1651028958211!5m2!1sen!2sbd",
  };

  const current = data ?? defaults;

  return (
    <div>
      <section className="restaurant-location-sec-1 overflow-hidden">
        <div className="container">
          <div className="row gy-4 justify-content-center">
            <div className="col-xl-6" style={{ position: "relative" }}>
              <div
                className="shape-mockup d-none d-xxl-block jump-reverse"
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  zIndex: 5,
                }}
              >
                <img
                  src="/assets/img/shape/location-left.png"
                  alt="img"
                  style={{ width: "120px" }}
                  onError={onImgErrorFallback("/assets/img/shape/location-left.png")}
                />
              </div>
              <div className="title-area location-content">
                <span className="sub-title style-2 text-anime-style-1">
                  Restaurant Location
                </span>
                <h2 className="sec-title text-anime-style-2">
                  Visit Our restaurant
                </h2>
                <p className="box-text pe-xxl-5 ps-xxl-5 text-anime-style-3">
                  {current.address}
                </p>
                <div className="line"></div>
                <div className="opening ow fadeinup" data-wow-delay=".3s">
                  <p>{current.openingLine1}</p>
                  {current.openingLine2 && <p>{current.openingLine2}</p>}
                </div>
                <div className="th-social ow fadeinup" data-wow-delay=".5s">
                  {current.socialLinks?.facebook && (
                    <a
                      href={current.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                  {current.socialLinks?.twitter && (
                    <a
                      href={current.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {current.socialLinks?.linkedin && (
                    <a
                      href={current.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {current.socialLinks?.whatsapp && (
                    <a
                      href={current.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="map-location">
                <iframe
                  src={current.mapEmbedUrl}
                  allowFullScreen
                  loading="lazy"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Location;
