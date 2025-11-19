import { useEffect, useState } from "react";
import { apiGet, endpoints } from "../lib/api";
import type { FooterContact, ContactSection } from "../lib/api";

function Footer() {
  const [footerContact, setFooterContact] = useState<FooterContact | null>(null);
  const [contactSection, setContactSection] = useState<ContactSection | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const f = await apiGet<FooterContact>(endpoints.footerContact);
        setFooterContact(f);
      } catch {
        // ignore, fallbacks below
      }

      try {
        const c = await apiGet<ContactSection>(endpoints.contactSection);
        setContactSection(c);
      } catch {
        // ignore
      }
    })();
  }, []);

  const finalPhonePrimary =
    footerContact?.phone || contactSection?.mobileNumber || "+256 3698 54789";
  const finalPhoneSecondary = "+16354786985";
  const finalEmail = footerContact?.email || contactSection?.email || "info@Itlu.com";

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
      <footer className="footer-wrapper footer-default overflow-hidden">
        <div className="footer-top" style={{ position: "relative" }}>
          <div
            className="shape-mockup moving d-none d-lg-block"
            style={{
              position: "absolute",
              top: "50%",
              right: "10%",
              transform: "translateY(-50%)",
              zIndex: 5,
            }}
          >
            <img src="/assets/img/shape/footer-top.png" alt="img" />
          </div>
          <div className="container">
            <div className="row gy-40 align-items-center justify-content-center">
              <div className="col-xl-12">
                <div className="subscribe-box">
                  <h2 className="footer-top_title">Let's Talk With Us</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="widget-area">
          <div className="container">
            <div className="row gy-40 gx-80 align-items-center">
              <div className="col-xl-6">
                <div className="widget footer-widget bg-gradient-to-br from-amber-500  to-green-700 text-center">
                  <h3 className="widget_title">Contact Info</h3>
                  <div className="icon flex justify-center mb-3">
                    <img src="/assets/img/icon/f-title-icon.png" alt="icon" />
                  </div>
                  <div className="th-widget-contact">
                    <div className="info-box">
                      <p className="info-box_text">
                        Phone: {" "}
                        <a href={`tel:${finalPhonePrimary.replace(/\s/g, "")}`} className="info-box_link">
                          {finalPhonePrimary}
                        </a>{" "}
                        / {" "}
                        <a href={`tel:${finalPhoneSecondary.replace(/\s/g, "")}`} className="info-box_link">
                          {finalPhoneSecondary}
                        </a>
                      </p>
                    </div>
                    <div className="info-box">
                      <p className="info-box_text">
                        Email: {" "}
                        <a href={`mailto:${finalEmail}`} className="info-box_link">
                          {finalEmail}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6  bg-white rounded-3xl p-4">
                <div className="contact-form-v2 contact-page-form">
                  <h2 className="title mt-n3 fw-semibold mb-30">Get In Touch!</h2>
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
                          id="footer-name"
                          placeholder="Your Name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="footer-email"
                          placeholder="Your Email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-12 style-border">
                        <select
                          name="subject"
                          id="footer-subject"
                          className="form-select"
                          value={form.subject}
                          onChange={handleChange}
                        >
                          <option value="" disabled hidden>
                            Select Subject
                          </option>
                          <option value="Reservation">Reservation</option>
                          <option value="Catering Service">Catering Service</option>
                          <option value="Party Orders">Party Orders</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                      </div>
                      <div className="col-12 form-group">
                        <textarea
                          placeholder="Write Message...."
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
                          SEND MESSAGE NOW
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
        <div className="copyright-wrap">
          <div className="container">
            <div className="copy-right-content">
              <div className="copyright-text-wrap text-center w-full">
                <p className="mx-auto text-center">
                  &copy; Copyright 2025 All rights are reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="scroll-top">
        <svg
          className="progress-circle svg-content"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{
              transition: "stroke-dashoffset 10ms linear 0s",
              strokeDasharray: "307.919, 307.919",
              strokeDashoffset: 307.919,
            }}
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default Footer;