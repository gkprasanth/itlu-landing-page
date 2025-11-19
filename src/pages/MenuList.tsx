import { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../MenuList.css";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";

interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
  categories: string[];
}

function MenuList() {
  const [activeFilter, setActiveFilter] = useState("*");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    type RawMenuItem = {
      _id?: string;
      id?: string;
      title?: string;
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      image?: string;
      categories?: string[];
    };

    const fetchMenu = async () => {
      try {
        const data = await apiGet<RawMenuItem[]>(endpoints.menu);
        setMenuItems(
          data.map((it) => ({
            id: it._id || it.id || Math.random(),
            name: it.title || it.name || "",
            description: it.description || "",
            price: it.price || 0,
            image: it.imageUrl || it.image || "/assets/img/menu/menu-1-item-1-1.jpg",
            categories: it.categories || [],
          }))
        );
      } catch (err) {
        console.warn("Failed to load menu for MenuList:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Define cuisine filters and normalize categories coming from API
  const CUISINE_TAGS = ["south-indian", "north-indian", "snacks", "sweets"] as const;
  const filterButtons = [
    { filter: "*", label: "All Dishes" },
    { filter: "south-indian", label: "South Indian" },
    { filter: "north-indian", label: "North Indian" },
    { filter: "snacks", label: "Snacks" },
    { filter: "sweets", label: "Sweets" },
  ];

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[_\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // Heuristic fallback to infer cuisine when API doesn't tag with desired cuisine categories
  const inferCuisineFromName = (name: string): string | null => {
    const n = name.toLowerCase();
    if (/(gulab|kheer|halwa|laddu|ladoo|jalebi|rasgulla|barfi|rabri|malai)/.test(n))
      return "sweets";
    if (/(dosa|idli|uttapam|sambar|rasam|pongal|upma|vada)/.test(n))
      return "south-indian";
    if (/(samosa|pakora|chaat|soup|cutlet|tikki|bonda|roll|fries|sandwich)/.test(n))
      return "snacks";
    if (/(paneer|paratha|chole|bhature|dal|pulao|rajma|kadhi|kofta|korma|naan|roti)/.test(n))
      return "north-indian";
    return null;
  };

  const getCuisineTags = (item: MenuItem): string[] => {
    const normalized = (item.categories || []).map(slugify);
    const tags = new Set<string>(normalized);
    // Add inferred cuisine if none of the cuisine tags are present
    if (!CUISINE_TAGS.some((t) => tags.has(t))) {
      const inferred = inferCuisineFromName(item.name);
      if (inferred) tags.add(inferred);
    }
    return Array.from(tags);
  };

  const filteredItems =
    activeFilter === "*"
      ? menuItems
      : menuItems.filter((item) => getCuisineTags(item).includes(activeFilter));

  useEffect(() => {
    const applyMasks = () => {
      document
        .querySelectorAll(".food-card-1[data-mask-src]")
        .forEach((card) => {
          const maskSrc = card.getAttribute("data-mask-src");
          if (maskSrc) {
            (card as HTMLElement).style.maskImage = `url(${maskSrc})`;
            (card as HTMLElement).style.webkitMaskImage = `url(${maskSrc})`;
          }
        });

      document.querySelectorAll(".food-mask[data-mask-src]").forEach((mask) => {
        const maskSrc = mask.getAttribute("data-mask-src");
        if (maskSrc) {
          (mask as HTMLElement).style.maskImage = `url(${maskSrc})`;
          (mask as HTMLElement).style.webkitMaskImage = `url(${maskSrc})`;
        }
      });
    };

    const timer = setTimeout(applyMasks, 100);
    return () => clearTimeout(timer);
  }, [filteredItems]);

  return (
    <div>
      <Header />
      <Navbar value={false} />
      <div
        className="breadcumb-wrapper overflow-hidden"
        style={{ backgroundImage: "url(/assets/img/bg/bg-thalli.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-1">
              <div className="breadcumb-content">
                <h1 className="breadcumb-title">Menu List View</h1>
                <ul className="breadcumb-menu">
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>Menu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <section className="food-sec-1 space overflow-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7">
              <div className="title-area text-center mb-2">
                <span className="sub-title text-anime-style-1">
                  Our Veg Dishes
                </span>
                <h2 className="sec-title text-anime-style-2">
                  Our Delicious <span className="text-theme">Veg Foods</span>
                </h2>
                <div className="filter-menu indicator-active filter-menu-active mt-2 justify-content-center fadeinup wow">
                  {filterButtons.map((btn) => (
                    <button
                      key={btn.filter}
                      onClick={() => setActiveFilter(btn.filter)}
                      className={`th-btn tab-btn btn-mask ${
                        activeFilter === btn.filter ? "active" : ""
                      }`}
                      type="button"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row gy-3 justify-content-center filter-active">
            {loading ? (
              <div className="col-12 text-center py-6">
                <p>Loading menu...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      layout: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
                      opacity: { duration: 0.25 },
                      scale: { duration: 0.25 },
                    }}
                    className="col-xl-5 col-lg-6 col-md-8 filter-item"
                  >
                    <div
                      className="food-card-1 style-2 style-3 bg-mask"
                      data-mask-src="/assets/img/bg/menu-list-mask-bg.png"
                    >
                      <div className="thumb">
                        <div
                          className="food-mask"
                          data-mask-src="/assets/img/bg/menu-1-msk-bg.png"
                        ></div>
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={onImgErrorFallback("/assets/img/menu/menu-1-item-1-1.jpg")}
                        />
                        <div className="actions">
                          <a href="#" className="icon-btn">
                            <ShoppingCart size={18} />
                          </a>
                          <a href="#" className="icon-btn">
                            <Heart size={18} />
                          </a>
                        </div>
                      </div>
                      <div className="content">
                        <h4 className="box-title">
                          <a href="#">{item.name}</a>
                        </h4>
                        <p className="box-text">{item.description}</p>
                        <h4 className="price">${item.price.toFixed(2)}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="th-pagination d-flex justify-content-center pt-50 mb-0">
            <ul>
              <li>
                <a href="#">
                  <i className="fas fa-arrow-left"></i>
                </a>
              </li>
              <li>
                <a href="#">1</a>
              </li>
              <li>
                <a href="#">2</a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-arrow-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MenuList;
