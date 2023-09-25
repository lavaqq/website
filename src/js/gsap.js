import { gsap } from "gsap";

const aboutTimeline = gsap.timeline();

aboutTimeline.to(".about__title", {
  y: 0,
  delay: 0,
  duration: 0.1,
})
.to("#about-text-1, #about-text-2, #about-text-3, #about-text-4", {
  y: 0,
  duration: 0.1,
  stagger: 0.2,
});

function triggerGSAPAnimation() {
  const screenWidth = window.innerWidth;
  const commonAnimations = [
    gsap.to(".hero__title-name", {
      y: 0,
      delay: 0.1,
      duration: 0.1,
    }),
    gsap.to(".hero__title-work", {
      y: 0,
      delay: 0.2,
      duration: 0.1,
    }),
    gsap.from(".hero__descriptions .hero__description", 1.8, {
      y: 400,
      ease: "power4.out",
      delay: 0.2,
      skewY: 10,
      duration: 0.1,
    }),
    gsap.to(".hero__contact-btn, .hero__contact-socials", {
      y: 0,
      delay: 0.6,
      duration: 0.1,
    }),
  ];
  if (screenWidth <= 1380) {
    commonAnimations.push(
      gsap.to(".featured,.featured__title", {
        y: 0,
        delay: 0.6,
        duration: 0.4,
      })
    );
  } else {
    commonAnimations.push(
      gsap.to(".featured", {
        x: 0,
        delay: 0.8,
        duration: 0.4,
      })
    );
  }
  gsap.timeline().add(commonAnimations);
}

triggerGSAPAnimation();
window.addEventListener("resize", triggerGSAPAnimation);



const projectTimeline = gsap.timeline();

projectTimeline.to(".projects__title", {
  y: 0,
  delay: 0,
  duration: 0.1,
  onComplete: () => {
    console.log('Animation .projects__title completed');
  },
})
.to(".projects__text", {
  y: 0,
  delay: 0.1,
  duration: 0.1,
})
.to(".projects__list-item", {
  y: 0,
  delay: 0.2,
  duration: 0.1,
});
