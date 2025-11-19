import { useEffect, useState } from "react";
import { apiGet, endpoints } from "../lib/api";
import type { HeaderBanner } from "../lib/api";

interface HeaderProps {
  address?: string;
  email?: string;
  openingHours?: string;
  phone?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  address = "Cable Bridge Rd, Masthan Nagar, CBI Colony, Jubilee Hills, Hyderabad, Telangana 500033",
  email = "info@Itlu.com",
  openingHours = "Mon to Sat - 9am to 5pm",
  phone = "+263 6547 9875",
  socialLinks = {
    facebook: "https://www.facebook.com/",
    twitter: "https://www.twitter.com/",
    linkedin: "https://www.linkedin.com/",
    whatsapp: "https://www.whatsapp.com/",
  },
}) => {
  const [remote, setRemote] = useState<HeaderBanner | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<HeaderBanner>(endpoints.headerBanner);
        setRemote(data);
      } catch {
        // keep defaults if backend not available
      }
    })();
  }, []);

  const finalAddress = remote?.address || address;
  const finalEmail = remote?.email || email;
  const finalOpeningHours = remote?.openingHours || openingHours;
  const finalPhone = remote?.mobileNumber || phone;

  return (
    <div className="header-top d-sm-block d-none">
      <div className="container">
        <div className="row justify-content-center justify-content-lg-between align-items-center gy-2">
          <div className="col-auto">
            <div className="header-links">
              <ul>
                <li className="d-none d-xl-inline-block">
                  <i className="far fa-location-dot"></i>
                  {finalAddress}
                </li>
                <li className="d-none d-md-inline-block">
                  <i className="far fa-envelope-open"></i>
                  <a href={`mailto:${finalEmail}`}>{finalEmail}</a>
                </li>
                <li className="d-none d-sm-inline-block">
                  <i className="far fa-clock"></i>Opening Hour: {finalOpeningHours}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-auto d-none d-lg-block">
            <div className="header-links">
              <ul>
                <li className="d-none d-xxl-inline-block header-contact">
                  <i className="far fa-phone"></i>
                  <a href={`tel:${finalPhone.replace(/\s/g, "")}`}>{finalPhone}</a>
                </li>
                <li>
                  <div className="th-social">
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook}>
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    )} {" "}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter}>
                        <i className="fab fa-twitter"></i>
                      </a>
                    )} {" "}
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin}>
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    )} {" "}
                    {socialLinks.whatsapp && (
                      <a href={socialLinks.whatsapp}>
                        <i className="fab fa-whatsapp"></i>
                      </a>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
