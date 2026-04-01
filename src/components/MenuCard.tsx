import React, { useState, useEffect } from "react";
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

// ─── Category mapping ─────────────────────────────────────────────────────────
// Maps the API's top-level category `id` to our 4 tab keys.
// Any category id not listed here is skipped (not shown on this card).
const API_CATEGORY_TO_TAB: Record<string, string> = {
  mocktails: "mocktails",
  desserts: "bakery",
  thalis: "thalis",
  "veg-curries": "alacarte",
  dosa: "alacarte",
  tiffin: "alacarte",
  breads: "alacarte",
  chaat: "alacarte",
  biryani: "alacarte",
  starters: "alacarte",
  "street-bites": "alacarte",
  tandoor: "alacarte",
  noodles: "alacarte",
  beverages: "alacarte",
  paan: "alacarte",
  JainFood: "alacarte",
};

// ─── Types for the nested API shape ──────────────────────────────────────────
type RawApiItem = {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  imageUrl?: string;
  status?: string;
};

type RawApiSubCategory = {
  items?: RawApiItem[];
};

type RawApiCategory = {
  id?: string;
  _id?: string;
  subCategories?: RawApiSubCategory[];
};

// ─── Flatten nested API response into MenuItem[] ──────────────────────────────
// The API returns: Array<{ id, subCategories: [{ items: [...] }] }>
// We flatten this, mapping each top-level category id to a tab key.
function flattenApiResponse(data: unknown): MenuItem[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  const first = data[0] as Record<string, unknown>;

  // Nested format detected
  if ("subCategories" in first) {
    const result: MenuItem[] = [];

    (data as RawApiCategory[]).forEach((category) => {
      const categoryId = category.id || category._id || "";
      const tabKey = API_CATEGORY_TO_TAB[categoryId];
      if (!tabKey) return; // category not mapped to any tab — skip

      (category.subCategories || []).forEach((sub) => {
        (sub.items || []).forEach((item) => {
          // Only show available items
          if (item.status && item.status !== "available") return;

          result.push({
            _id: item._id || item.id || Math.random().toString(),
            title: item.name || "",
            description: item.description || "",
            price: item.price || 0,
            imageUrl: item.image || item.imageUrl || "",
            categories: [tabKey],
          });
        });
      });
    });

    return result;
  }

  // Flat format: [{ _id, title/name, categories: [...] }]
  type RawFlatItem = {
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

  return (data as RawFlatItem[]).map((it) => ({
    _id: it._id || it.id || Math.random().toString(),
    title: it.title || it.name || "",
    description: it.description || "",
    price: it.price || 0,
    imageUrl: it.imageUrl || it.image || "",
    categories: Array.isArray(it.categories)
      ? it.categories.map((c) => c.toLowerCase())
      : [],
    fallbackImagePath: it.fallbackImagePath,
  }));
}

// ─── Dummy fallback data ──────────────────────────────────────────────────────
const dummyMenuData: MenuItem[] = [
  // Mocktails
  {
    _id: "m1",
    title: "Lavender Haze",
    description: "Floral & refreshing mocktail",
    price: 349,
    imageUrl:
      "https://itlu-menu.s3.eu-north-1.amazonaws.com/menu-items/1766333612661-429318247.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "m2",
    title: "Mango Habanero",
    description: "Sweet & spicy mango mocktail",
    price: 329,
    imageUrl:
      "https://itlu-menu.s3.eu-north-1.amazonaws.com/menu-items/1766333696750-107950456.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "m3",
    title: "Cucumber Mint Mojito",
    description: "Cooling cucumber & mint mocktail",
    price: 299,
    imageUrl:
      "https://oliviaskitchen.com/wp-content/uploads/2025/01/cucumber-mojito-mocktail-featured.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "m4",
    title: "Kiwi Lemonade",
    description: "Tangy kiwi & lemon mocktail",
    price: 279,
    imageUrl: "https://i.ytimg.com/vi/-YuqwXOtnY8/hq720.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "m5",
    title: "Guava Glow",
    description: "Pink guava mocktail",
    price: 299,
    imageUrl:
      "https://itlu-menu.s3.eu-north-1.amazonaws.com/menu-items/1766333774366-832204015.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "m6",
    title: "Lychee Sunrise",
    description: "Lychee & orange layered mocktail",
    price: 349,
    imageUrl:
      "https://itlu-menu.s3.eu-north-1.amazonaws.com/menu-items/1766333349533-73511829.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "m7",
    title: "Sweet Sunrise",
    description: "Orange & grenadine mocktail",
    price: 299,
    imageUrl:
      "https://i0.wp.com/sweetsandthankyou.com/wp-content/uploads/2022/01/Sweet-Sunrise-Mocktail23-2.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "m8",
    title: "Blue Lagoon",
    description: "Blue curaçao lemonade mocktail",
    price: 279,
    imageUrl:
      "https://itlu-menu.s3.eu-north-1.amazonaws.com/menu-items/1766332783822-442719255.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "ms1",
    title: "Mango Milk Shake",
    description: "Creamy mango shake",
    price: 249,
    imageUrl:
      "https://www.funfoodfrolic.com/wp-content/uploads/2021/05/Mango-Shake-Thumbnail.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "ms2",
    title: "Strawberry Milk Shake",
    description: "Fresh strawberry shake",
    price: 249,
    imageUrl:
      "https://assets.epicurious.com/photos/647df8cad9749492c4d5d407/1:1/w_4506,h_4506,c_limit/StrawberryMilkshake_RECIPE_053123_3599.jpg",
    categories: ["mocktails"],
  },
  {
    _id: "ms3",
    title: "Chocolate Milk Shake",
    description: "Rich chocolate shake",
    price: 249,
    imageUrl:
      "https://www.organicvalley.coop/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F5dqbssss%2Fproduction-v3%2F3ba3f137c02a6f320c156bb7c39e362bdbd87bb8-1356x1576.jpg&w=3840&q=75",
    categories: ["mocktails"],
  },
  // Thalis
  {
    _id: "th1",
    title: "ITLU Weekend Special Thalli",
    description: "Special weekend feast with premium dishes & extras",
    price: 899,
    imageUrl:
      "https://itlu-menu.s3.eu-north-1.amazonaws.com/menu-items/1767164413150-728942580.jpg",
    categories: ["thalis"],
  },
  {
    _id: "th2",
    title: "Weekday Thalli",
    description: "Wholesome everyday thali with rotating curries",
    price: 599,
    imageUrl: "",
    categories: ["thalis"],
  },
  // Ala Carte
  {
    _id: "c1",
    title: "Dal Tadka",
    description: "Yellow lentils tempered with ghee & spices",
    price: 349,
    imageUrl:
      "https://vegecravings.com/wp-content/uploads/2018/01/Dal-Tadka-Recipe-Step-By-Step-Instructions-1024x822.jpg",
    categories: ["alacarte"],
  },
  {
    _id: "c2",
    title: "Channa Masala",
    description: "Punjabi style chickpea curry",
    price: 379,
    imageUrl:
      "https://sixhungryfeet.com/wp-content/uploads/2023/06/Easy-Chana-Masala-Recipe-8.jpg",
    categories: ["alacarte"],
  },
  {
    _id: "c3",
    title: "Kajju Paneer",
    description: "Paneer in rich cashew nut gravy",
    price: 449,
    imageUrl: "https://i.ytimg.com/vi/Cu9P1hUelRs/maxresdefault.jpg",
    categories: ["alacarte"],
  },
  {
    _id: "c4",
    title: "Phool Makhana Curry",
    description: "Fox nuts in creamy gravy",
    price: 449,
    imageUrl:
      "https://www.madhuseverydayindian.com/wp-content/uploads/2025/09/dhaba-style-makhana-curry.jpg",
    categories: ["alacarte"],
  },
  {
    _id: "c5",
    title: "Malai Kofta",
    description: "Cheese & veggie dumplings in creamy gravy",
    price: 449,
    imageUrl:
      "https://carameltintedlife.com/wp-content/uploads/2020/11/Malai-Kofta-1-of-1-9.jpg",
    categories: ["alacarte"],
  },
  {
    _id: "c6",
    title: "Saag Paneer",
    description: "Paneer cubes in creamy spinach gravy",
    price: 429,
    imageUrl:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/saag-paneer-4893170.jpg",
    categories: ["alacarte"],
  },
  {
    _id: "c7",
    title: "Paneer Butter Masala",
    description: "Classic paneer in buttery tomato gravy",
    price: 429,
    imageUrl: "",
    categories: ["alacarte"],
  },
  {
    _id: "c8",
    title: "Paneer Tikka Masala",
    description: "Grilled paneer in spiced masala",
    price: 449,
    imageUrl: "",
    categories: ["alacarte"],
  },
  {
    _id: "c9",
    title: "Kadai Paneer",
    description: "Paneer tossed in kadai spices",
    price: 429,
    imageUrl: "",
    categories: ["alacarte"],
  },
  {
    _id: "c10",
    title: "Dal Makhani",
    description: "Slow-cooked black lentils in butter",
    price: 399,
    imageUrl: "",
    categories: ["alacarte"],
  },
  // Bakery
  {
    _id: "des1",
    title: "Pineapple Pastry",
    description: "Eggless pineapple cream pastry",
    price: 149,
    imageUrl: "https://i.ytimg.com/vi/-ktkATXlRiU/maxresdefault.jpg",
    categories: ["bakery"],
  },
  {
    _id: "des2",
    title: "Butterscotch Pastry",
    description: "Eggless butterscotch cream pastry",
    price: 149,
    imageUrl:
      "https://thumbs.dreamstime.com/b/butterscotch-pastry-various-kinds-baked-products-made-mainly-flour-sugar-milk-butter-42550303.jpg",
    categories: ["bakery"],
  },
  {
    _id: "des3",
    title: "Black Forest Pastry",
    description: "Eggless chocolate & cherry pastry",
    price: 149,
    imageUrl:
      "https://kreamz.in/wp-content/uploads/2023/12/black-forest-pastry.webp",
    categories: ["bakery"],
  },
  {
    _id: "des4",
    title: "Honey Cake",
    description: "Honey soaked cake slice",
    price: 129,
    imageUrl: "https://www.onceuponachef.com/images/2024/09/honey-cake-2.jpg",
    categories: ["bakery"],
  },
  {
    _id: "des18",
    title: "Rasmalai Pastry",
    description: "Eggless rasmalai flavored cream pastry",
    price: 199,
    imageUrl: "",
    categories: ["bakery"],
  },
  {
    _id: "des19",
    title: "Tiramisu Pastry",
    description: "Eggless tiramisu flavored cream pastry",
    price: 249,
    imageUrl: "",
    categories: ["bakery"],
  },
  {
    _id: "des20",
    title: "Badam Milk Pastry",
    description: "Eggless almond milk flavored cream pastry",
    price: 249,
    imageUrl: "",
    categories: ["bakery"],
  },
  {
    _id: "des10",
    title: "Dilpasand (Slice)",
    description: "Coconut & tutti-frutti filled sweet bread",
    price: 99,
    imageUrl:
      "https://m.media-amazon.com/images/I/61Cf6YKfipL._AC_UF894,1000_QL80_.jpg",
    categories: ["bakery"],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const MenuCard: React.FC<MenuCardProps> = ({
  sectionSubtitle = "Menu Card",
  sectionTitle = "Our Traditional",
  titleHighlight = "Veg Menu",
  titleDecorationImage = "/assets/img/icon/title-shape.png",
  tabs = ["mocktails", "thalis", "alacarte", "bakery"],
  menuImages = {
    left: "/menu-left.jpeg",
    right: "/menu-right.jpeg",
  },
  viewAllButtonText = "View All Menu",
  viewAllButtonLink = "https://menu.itlu.us",
  defaultTab = "mocktails",
  pricePrefix = "₹",
  loadingText = "Loading menu...",
  noItemsText = "No items available for",
  itemsPerPage = 5,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(dummyMenuData);
  const [loading, setLoading] = useState(true);

  const tabLabels: Record<string, string> = {
    mocktails: "Mocktails",
    thalis: "Thalis",
    alacarte: "Ala Carte",
    bakery: "Bakery",
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiGet<unknown>(endpoints.menu);
        console.log("Menu data received:", data);

        const flattened = flattenApiResponse(data);

        if (flattened.length > 0) {
          setMenuItems(flattened);
        } else {
          console.warn("No usable items from API — falling back to dummy data");
          setMenuItems(dummyMenuData);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMenuItems(dummyMenuData);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

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
                        {tabLabels[tab] ??
                          tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                        {noItemsText} {tabLabels[activeTab] ?? activeTab}
                      </p>
                    ) : (
                      filteredItems.map((item) => (
                        <div
                          className="menu-item-1 wow fadeinup"
                          key={item._id}
                        >
                          <div className="thumb global-img">
                            <img
                              src={
                                item.imageUrl ||
                                item.fallbackImagePath ||
                                "/assets/img/menu/menu-1-item-1-1.jpg"
                              }
                              alt={item.title}
                              onError={onImgErrorFallback(
                                item.fallbackImagePath ||
                                  "/assets/img/menu/menu-1-item-1-1.jpg",
                              )}
                            />
                          </div>
                          <div className="content">
                            <div className="left">
                              <h3 className="box-title">
                                <a
                                  href={viewAllButtonLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item.title}
                                </a>
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
          <a
            href={viewAllButtonLink}
            target="_blank"
            rel="noopener noreferrer"
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
          </a>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
