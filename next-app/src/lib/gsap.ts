import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
  
  // Disable all ScrollTrigger markers globally
  ScrollTrigger.defaults({
    markers: false
  });
}

export { gsap, ScrollTrigger, Flip };
