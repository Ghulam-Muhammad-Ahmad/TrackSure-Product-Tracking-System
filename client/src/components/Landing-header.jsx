import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

// To install these components using shadcn CLI, run:
// npx shadcn-ui@latest add accordion button navigation-menu sheet

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/tracksurelogo.svg",
    alt: "logo",
    title: "",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Features", url: "#features" },
    { title: "Benefits", url: "#benefits" },
    { title: "Contact", url: "#contact" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
}) => {
  const navigate = useNavigate();

  const handleNavClick = (url) => {
    if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(url);
    }
  };

  return (
    <section className="py-8">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-12" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item, navigate, handleNavClick))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a onClick={() => navigate(auth.login.url)} className="cursor-pointer">{auth.login.title}</a>
            </Button>
            <Button asChild size="sm">
              <a onClick={() => navigate(auth.signup.url)} className="cursor-pointer">{auth.signup.title}</a>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8" alt={logo.alt} />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex w-full flex-col gap-4">
                    {menu.map((item) => renderMobileMenuItem(item, navigate, handleNavClick))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <a onClick={() => navigate(auth.login.url)} className="cursor-pointer">{auth.login.title}</a>
                    </Button>
                    <Button asChild>
                      <a onClick={() => navigate(auth.signup.url)} className="cursor-pointer">{auth.signup.title}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item, navigate, handleNavClick) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} navigate={navigate} handleNavClick={handleNavClick} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <button
        onClick={() => handleNavClick(item.url)}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground cursor-pointer"
      >
        {item.title}
      </button>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item, navigate, handleNavClick) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} navigate={navigate} handleNavClick={handleNavClick} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <button 
      key={item.title} 
      onClick={() => handleNavClick(item.url)} 
      className="text-md font-semibold text-left w-full cursor-pointer hover:text-primary transition-colors"
    >
      {item.title}
    </button>
  );
};

const SubMenuLink = ({ item, navigate, handleNavClick }) => {
  return (
    <button
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground cursor-pointer w-full text-left"
      onClick={() => handleNavClick(item.url)}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
};

export { Navbar1 };
