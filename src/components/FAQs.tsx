import { useState, useEffect } from "react";
import { apiGet, endpoints } from "../lib/api";
import type { FaqItem } from "../lib/api";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQsProps {
  sectionTitle?: string;
  faqs?: FAQ[];
}

const defaultFAQs: FAQ[] = [
  {
    question: "What warranties do I have for my shipments?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "Do you offer dine-in, takeout, and delivery services?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "Can I place an order online or by phone?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "How do you ensure food safety and hygiene?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "Can I customize my meal (remove ingredients.)?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "What about payment security?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "What are your opening hours?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "Do you offer any combo meals or special deals?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "Are there any gluten-free items on your menu?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "Are your ingredients fresh and locally sourced?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
  {
    question: "Is parking available at your restaurant location?",
    answer:
      "With any financial product that you buy, it is Important that you know you are getting the best advice from a reputable company as often you will have to provide sensitive information online or over the internet.",
  },
];

const FAQs: React.FC<FAQsProps> = ({
  sectionTitle = "Frequently asked questions",
  faqs = defaultFAQs,
}) => {
  const [remoteFaqs, setRemoteFaqs] = useState<FaqItem[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await apiGet<FaqItem[]>(endpoints.faq);
        setRemoteFaqs(items.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.warn("Failed to load faqs:", err);
      }
    })();
  }, []);

  const finalFaqs = remoteFaqs && remoteFaqs.length > 0 ? remoteFaqs.map((f) => ({ question: f.question, answer: f.answer })) : faqs;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Split FAQs into two columns
  const leftColumnFAQs = finalFaqs.filter((_, i) => i % 2 === 0);
  const rightColumnFAQs = finalFaqs.filter((_, i) => i % 2 === 1);

  const renderFAQItem = (faq: FAQ, globalIndex: number) => {
    const isActive = activeIndex === globalIndex;

    return (
      <div
        key={globalIndex}
        style={{
          marginBottom: "20px",
          border: "2px solid #e5e5e5",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <button
          onClick={() => toggleFAQ(globalIndex)}
          style={{
            width: "100%",
            padding: "20px 30px",
            backgroundColor: isActive ? "#C19D60" : "#fff",
            color: isActive ? "#fff" : "#1a1a1a",
            border: "none",
            textAlign: "left",
            fontSize: "18px",
            fontWeight: "600",
            fontFamily: '"Barlow Condensed", sans-serif',
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          <span>{faq.question}</span>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              transition: "transform 0.3s ease",
              transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            +
          </span>
        </button>
        <div
          style={{
            maxHeight: isActive ? "500px" : "0",
            overflow: "hidden",
            transition: "max-height 0.4s ease, padding 0.4s ease",
            padding: isActive ? "0 30px 30px 30px" : "0 30px",
          }}
        >
          <p
            style={{
              margin: 0,
              paddingTop: isActive ? "20px" : "0",
              color: "#666",
              fontSize: "16px",
              lineHeight: "1.6",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {faq.answer}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="space" id="faq-sec">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="title-area text-center pe-xl-5 ps-xl-5">
                <h2 className="sec-title">{sectionTitle}</h2>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: "60px" }}>
            <div className="col-lg-6">
              {leftColumnFAQs.map((faq, idx) => renderFAQItem(faq, idx * 2))}
            </div>
            <div className="col-lg-6">
              {rightColumnFAQs.map((faq, idx) =>
                renderFAQItem(faq, idx * 2 + 1),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
