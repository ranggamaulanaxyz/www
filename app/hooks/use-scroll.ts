import { useEffect, useState } from "react";

export function useScroll() {
  const [scrolled, setScrolled] = useState(false);
  const [scrolledUp, setScrolledUp] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const windowOnScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 0);
      setScrolledUp(currentScrollY > lastScrollY);
      setScrolledDown(currentScrollY < lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", windowOnScroll);

    return () => {
      window.removeEventListener("scroll", windowOnScroll);
    };
  }, []);

  return { scrolled, scrolledUp, scrolledDown };
}
