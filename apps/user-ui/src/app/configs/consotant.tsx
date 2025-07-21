// Define the type
export type NavItemsTypes = {
  title: string;
  href: string;
};

// Use it for the array
export const navItems: NavItemsTypes[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Shops",
    href: "/shops",
  },
  {
    title: "Offers",
    href: "/offers",
  },
  {
    title: "Become a Seller",
    href: "/bcome-seller", // typo: should be "/become-seller" maybe?
  },
];



