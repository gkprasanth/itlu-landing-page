import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { ContactSection } from "../lib/api";

interface ContactFeature {
  icon: string;
  label: string;
  value: ReactNode;
}

interface ServiceOption {
  value: string;
  label: string;
}

interface ContactProps {
  sectionTitle?: string;
  titleHighlight?: string;
  description?: string;
  contactFeatures?: ContactFeature[];
  decorationImage?: string;
  formTitle?: string;
  formPlaceholders?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  serviceOptions?: ServiceOption[];
  submitButtonText?: string;
}

// contact features are built dynamically from backend contact section

const defaultServiceOptions: ServiceOption[] = [
  { value: "Reservation", label: "Reservation" },
  { value: "Catering Service", label: "Catering Service" },
  { value: "Party Orders", label: "Party Orders" },
  { value: "General Inquiry", label: "General Inquiry" },
];

const Contact: React.FC<ContactProps> = ({
  sectionTitle = "Contact",
  titleHighlight = "Our Veg Restaurant",
  description = "We'd love to hear from you! Reach out to us for reservations, feedback, or to learn more about our authentic vegetarian menu and homely dining experience.",
  decorationImage = "/assets/img/icon/contact-info-icon.png",
  formTitle = "Get In Touch!",
  formPlaceholders = {
    name: "Your Name",
    email: "Your Email",
    subject: "Select Subject",
    message: "Write Message....",
  },
  serviceOptions = defaultServiceOptions,
  submitButtonText = "SEND MESSAGE NOW",
}) => {
  const [contactRemote, setContactRemote] = useState<ContactSection | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const c = await apiGet<ContactSection>(endpoints.contactSection);
        setContactRemote(c);
      } catch (err) {
        console.warn("Failed to load contact section:", err);
      }
    })();
  }, []);

  const finalAddress = contactRemote?.address || "Cable Bridge Rd, Masthan Nagar, CBI Colony, Jubilee Hills 98380";
  const finalEmail = contactRemote?.email || "info@Itlu.com";
  const finalMobile = contactRemote?.mobileNumber || "+256-6547-98749";
  const finalOpening = contactRemote?.openingHours || "Monday - Saturday: 9:00am - 18:00pm";
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div>
      <div className="space contact-area-3" id="contact-sec">
        <div className="container">
          <div className="row gy-40 gx-80 align-items-center">
            <div className="col-xl-6">
              <div className="contact-info-wrap">
                <div
                  className="shape-mockup d-xxl-block d-none"
                  data-top="20%"
                  data-left="78%"
                >
                  <img src={decorationImage} alt="img" onError={onImgErrorFallback(decorationImage)} />
                </div>
                <div className="mb-30">
                  <h2 className="sec-title text-anime-style-2 mb-2">
                    {sectionTitle}{" "}
                    <span className="text-theme">{titleHighlight}</span>
                  </h2>
                  <p className="box-text">{description}</p>
                </div>
                <div className="contact-feature-wrap">
                  <div className="contact-feature2">
                    <div className="box-icon">
                      <img src="/assets/img/icon/contact-map.svg" alt="" onError={onImgErrorFallback("/assets/img/icon/contact-map.svg")} />
                    </div>
                    <div className="media-body">
                      <p className="contact-feature_label">Address</p>
                      <a href="https://www.google.com/maps" className="contact-feature_link">{finalAddress}</a>
                    </div>
                  </div>
                  <div className="contact-feature2">
                    <div className="box-icon">
                      <img src="/assets/img/icon/team_call.svg" alt="" onError={onImgErrorFallback("/assets/img/icon/team_call.svg")} />
                    </div>
                    <div className="media-body">
                      <p className="contact-feature_label">Contact Info</p>
                      <a href={`tel:${finalMobile.replace(/\s/g, "")}`} className="contact-feature_link">Mobile: {finalMobile}</a>
                      <br/>
                      <a href={`mailto:${finalEmail}`} className="contact-feature_link">Email: {finalEmail}</a>
                    </div>
                  </div>
                  <div className="contact-feature2">
                    <div className="box-icon">
                      <img src="/assets/img/icon/contact-map.svg" alt="" onError={onImgErrorFallback("/assets/img/icon/contact-map.svg")} />
                    </div>
                    <div className="media-body">
                      <p className="contact-feature_label">Opening Hours</p>
                      <span className="contact-feature_link">{finalOpening}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="main-contact-form   col-xl-6">
              <div className="contact-form-v2 contact-page-form">
                <h2 className="title mt-n3 fw-semibold mb-30">{formTitle}</h2>
                <form
                  className="contact-form ajax-contact"
                  onSubmit={handleSubmit}
                >
                  <div className="row">
                    <div className="form-group col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="name"
                        placeholder={formPlaceholders.name}
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder={formPlaceholders.email}
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-12 style-border">
                      <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        value={form.subject}
                        onChange={handleChange}
                      >
                        <option value="" disabled hidden>
                          {formPlaceholders.subject}
                        </option>
                        {serviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 form-group">
                      <textarea
                        placeholder={formPlaceholders.message}
                        className="form-control"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-btn col-12">
                      <button
                        className="th-btn style2 style-radius"
                        type="submit"
                      >
                        {submitButtonText}
                      </button>
                    </div>
                  </div>
                  <p className="form-messages mb-0 mt-3"></p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
