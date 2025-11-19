import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../MenuCard.css";
import { onImgErrorFallback, apiGet, endpoints } from "../lib/api";

interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categories: string[];
  fallbackImagePath?: string;
}

interface MenuCardProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  titleHighlight?: string;
  titleDecorationImage?: string;
  tabs?: string[];
  menuImages?: {
    left?: string;
    right?: string;
  };
  viewAllButtonText?: string;
  viewAllButtonLink?: string;
  defaultTab?: string;
  pricePrefix?: string;
  apiUrl?: string;
  loadingText?: string;
  noItemsText?: string;
  itemsPerPage?: number;
}

// Dummy data for fallback
const dummyMenuData: MenuItem[] = [
  {
    _id: "1",
    title: "Paneer Butter Masala",
    description: "Creamy tomato curry with soft paneer cubes",
    price: 40,
    imageUrl: "/assets/img/menu/menu-1-item-1-1.jpg",
    categories: ["breakfast", "lunch", "dinner"],
  },
  {
    _id: "2",
    title: "Veggie Delight with Vegetable",
    description: "Mixed vegetables in aromatic spices",
    price: 60,
    imageUrl: "/assets/img/menu/menu-1-item-1-2.jpg",
    categories: ["lunch", "dinner"],
  },
  {
    _id: "3",
    title: "Marrakesh Vegetarian Curry",
    description: "Exotic Moroccan-style vegetable curry",
    price: 30,
    imageUrl: "/assets/img/menu/menu-1-item-1-3.jpg",
    categories: ["lunch", "dinner"],
  },
  {
    _id: "4",
    title: "Spicy Vegan Potato Curry",
    description: "Bold and spicy potato curry",
    price: 50,
    imageUrl: "/assets/img/menu/menu-1-item-1-4.jpg",
    categories: ["breakfast", "lunch", "dinner"],
  },
  {
    _id: "5",
    title: "Masala Dosa",
    description: "Crispy rice crepe with spiced potato filling",
    price: 35,
    imageUrl: "/assets/img/menu/menu-1-item-1-5.jpg",
    categories: ["breakfast", "snacks"],
  },
  {
    _id: "6",
    title: "Apple Pie with Cream",
    description: "Sweet and tangy apple pie with cream",
    price: 80,
    imageUrl: "/assets/img/menu/menu-1-item-1-6.jpg",
    categories: ["snacks"],
  },
  {
    _id: "7",
    title: "French Onion Soup",
    description: "Classic French soup with caramelized onions",
    price: 28,
    imageUrl: "/assets/img/menu/menu-1-item-1-1.jpg",
    categories: ["lunch", "dinner"],
  },
  {
    _id: "8",
    title: "Dal Tadka",
    description: "Yellow lentils tempered with aromatic spices",
    price: 25,
    imageUrl: "/assets/img/menu/menu-1-item-1-2.jpg",
    categories: ["breakfast", "lunch", "dinner"],
  },
  {
    _id: "9",
    title: "Samosa Chaat",
    description: "Crispy samosas with tangy chutneys",
    price: 20,
    imageUrl: "/assets/img/menu/menu-1-item-1-3.jpg",
    categories: ["breakfast", "snacks"],
  },
  {
    _id: "10",
    title: "Chole Bhature",
    description: "Spicy chickpea curry with fluffy fried bread",
    price: 45,
    imageUrl: "/assets/img/menu/menu-1-item-1-4.jpg",
    categories: ["breakfast", "lunch"],
  },
];

const MenuCard: React.FC<MenuCardProps> = ({
  sectionSubtitle = "Menu Card",
  sectionTitle = "Our Traditional",
  titleHighlight = "Veg Menu",
  titleDecorationImage = "/assets/img/icon/title-shape.png",
  tabs = ["breakfast", "lunch", "dinner", "snacks"],
  menuImages = {
    left: "/assets/img/menu/menu-1-1.jpg",
    right: "/assets/img/menu/menu-1-2.jpg",
  },
  viewAllButtonText = "View All Menu",
  viewAllButtonLink = "/menu",
  defaultTab = "breakfast",
  pricePrefix = "$",
  // apiUrl prop removed - we rely on centralized endpoints and VITE_BASE_URL
  loadingText = "Loading menu...",
  noItemsText = "No items available for",
  itemsPerPage = 5,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(dummyMenuData);
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
      fallbackImagePath?: string;
    };

    const fetchMenu = async () => {
      try {
        const data = await apiGet<RawMenuItem[]>(endpoints.menu);
        // backend returns array of menu items; map to our UI shape if needed
        setMenuItems(
          data.map((it) => ({
            _id: it._id || it.id || "",
            title: it.title || it.name || "",
            description: it.description || "",
            price: it.price || 0,
            imageUrl: it.imageUrl || it.image || "",
            categories: it.categories || [],
            fallbackImagePath: it.fallbackImagePath,
          }))
        );
      } catch (error) {
        console.error("Error fetching menu:", error);
        console.log("Falling back to dummy menu data");
        setMenuItems(dummyMenuData);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter items by category and limit to specified number
  const filteredItems = menuItems
    .filter((item) => item.categories.includes(activeTab))
    .slice(0, itemsPerPage);

  return (
    <div>
      <div className="menu-sec1 space-top overflow-hidden" id="menu-sec">
        <div className="container">
          {/* Title */}
          <div className="title-area text-center mb-40">
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
                alt="decor"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="row gy-4 justify-content-center">
            <div className="col-lg-3">
              <div className="menu-img-1-1 gsap-scroll-float-down2">
                <img src={menuImages.left} alt="img" />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="menu-1-content-wrap ps-xl-3 pe-xl-5">
                {/* Tabs */}
                <ul
                  className="nav nav-tabs wow fadeinup"
                  id="myTab"
                  role="tablist"
                >
                  {tabs.map((tab) => (
                    <li className="nav-item" key={tab} role="presentation">
                      <button
                        className={`nav-link ${activeTab === tab ? "active" : ""}`}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Menu Items */}
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="event-creating"
                    role="tabpanel"
                  >
                    {loading ? (
                      <p className="text-center mt-4">{loadingText}</p>
                    ) : filteredItems.length === 0 ? (
                      <p className="text-center mt-4">
                        {noItemsText} {activeTab}
                      </p>
                    ) : (
                      filteredItems.map((item) => (
                        <div
                          className="menu-item-1 wow fadeinup"
                          key={item._id}
                        >
                          <div className="thumb global-img">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              onError={onImgErrorFallback(item.fallbackImagePath || "/assets/img/menu/menu-1-item-1-1.jpg")}
                            />
                          </div>
                          <div className="content">
                            <div className="left">
                              <h3 className="box-title">
                                <a href="/">{item.title}</a>
                              </h3>
                              <p className="box-text">{item.description}</p>
                            </div>
                            <div className="right">
                              <h4 className="price">
                                <span>{pricePrefix}</span> {item.price}
                              </h4>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="menu-img-1-2 gsap-scroll-float-up">
                <img src={menuImages.right} alt="img" />
              </div>
            </div>
          </div>
        </div>

        {/* View All Menu Button */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "32px",
          }}
        >
          <Link
            to={viewAllButtonLink}
            className="order-now-btn-menu mb-4"
            style={{
              background: "#22c55e",
              color: "#fff",
              padding: "16px 40px",
              borderRadius: "999px",
              fontSize: "1.25rem",
              fontWeight: "bold",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              textDecoration: "none",
              transition: "background 0.2s",
              display: "inline-block",
            }}
          >
            {viewAllButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
