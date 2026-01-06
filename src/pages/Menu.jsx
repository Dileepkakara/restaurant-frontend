import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { OfferBanner } from "@/components/menu/OfferBanner";
import { CategoryChips } from "@/components/menu/CategoryChips";
import { FilterPanel } from "@/components/menu/FilterPanel";
import { MenuItem } from "@/components/menu/MenuItem";
import { CartSheet } from "@/components/menu/CartSheet";
import { LoginModal } from "@/components/menu/LoginModal";
import { useToast } from "@/hooks/use-toast";
import * as customerApi from "@/api/customerApi";

const Menu = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [filters, setFilters] = useState({
    vegOnly: false,
    nonVegOnly: false,
    recommended: false,
    popular: false,
    todaySpecial: false,
    newArrivals: false,
    hasOffer: false,
    availableOnly: false,
    spicyLevel: null,
    priceSort: null,
  });

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('customer_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('customer_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load restaurant data and menu items
  useEffect(() => {
    const loadData = async () => {
      try {
        const restaurantParam = searchParams.get("restaurant");
        const tableParam = searchParams.get("table");

        // Use restaurant from URL params, fallback to demo for backward compatibility
        const currentRestaurantId = restaurantParam || "6748b8f8e4b0a1b2c3d4e5f6";

        setRestaurantId(currentRestaurantId);
        setTableId(tableParam);

        // Save to localStorage for checkout
        localStorage.setItem('current_restaurant_id', currentRestaurantId);
        if (tableParam) {
          localStorage.setItem('current_table_id', tableParam);
        }

        // Load restaurant info
        const restaurantData = await customerApi.getRestaurant(currentRestaurantId);
        setRestaurant(restaurantData);

        // Load categories
        const categoriesData = await customerApi.getCategories(currentRestaurantId);
        setCategories(categoriesData);

        // Load menu items
        const menuData = await customerApi.getMenuItems(currentRestaurantId);
        setMenuItems(menuData);

        // Validate table if provided
        if (tableParam) {
          await customerApi.validateTable(currentRestaurantId, tableParam);
        }

      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load restaurant data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams, toast]);

  // Filter and sort menu items
  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (filters.vegOnly) items = items.filter((item) => item.isVeg);
    if (filters.nonVegOnly) items = items.filter((item) => !item.isVeg);
    if (filters.recommended) items = items.filter((item) => item.isRecommended);
    if (filters.popular) items = items.filter((item) => item.isPopular);
    if (filters.todaySpecial) items = items.filter((item) => item.isTodaySpecial);
    if (filters.newArrivals) items = items.filter((item) => item.isNewArrival);
    if (filters.hasOffer) items = items.filter((item) => item.hasOffer);
    if (filters.availableOnly) items = items.filter((item) => item.isAvailable);
    if (filters.spicyLevel) items = items.filter((item) => item.spicyLevel === filters.spicyLevel);

    if (filters.priceSort === "asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (filters.priceSort === "desc") {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [selectedCategory, filters]);

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    toast({
      title: "Welcome back!",
      description: "You now have access to exclusive offers",
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-8">
      <MenuHeader
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <OfferBanner />

        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items match your filters</p>
          </div>
        )}
      </main>

      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} onFilterChange={setFilters} />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onSkip={() => setIsLoginOpen(false)}
      />
    </div>
  );
};

export default Menu;
