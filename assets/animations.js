// Genskins Animations
// This script handles all animations for the Genskins website
// Including floating images, product hover effects, and future animations

(function () {
	"use strict";

	// ========================================
	// FLOATING IMAGE ANIMATIONS
	// ========================================
	function initFloatingAnimations() {
		if (typeof gsap !== "undefined") {
			gsap.registerPlugin(ScrollTrigger);
			const images = document.querySelectorAll(".float-image");

			// Floating + scaling animation
			images.forEach(img => {
				gsap.to(img, {
					rotationX: gsap.utils.random(-15, 15),
					rotationY: gsap.utils.random(-15, 15),
					x: gsap.utils.random(-20, 20),
					y: gsap.utils.random(-20, 20),
					scale: gsap.utils.random(0.9, 1.1),
					duration: gsap.utils.random(2, 4),
					ease: "sine.inOut",
					yoyo: true,
					repeat: -1,
				});
			});

			// Leave the page on scroll
			images.forEach(img => {
				const rect = img.getBoundingClientRect();
				const directionX = rect.left < window.innerWidth / 2 ? -window.innerWidth : window.innerWidth;
				const directionY = rect.top < window.innerHeight / 2 ? -window.innerHeight : window.innerHeight;
				gsap.to(img, {
					scrollTrigger: {
						trigger: ".floating-section",
						start: "top top",
						end: "bottom top",
						scrub: true,
					},
					x: directionX,
					y: directionY,
					rotationZ: gsap.utils.random(-90, 90),
					opacity: 0,
					scale: gsap.utils.random(0.5, 1.5),
					ease: "power2.out",
				});
			});
		} else {
			// If GSAP isn't loaded yet, try again in a moment
			setTimeout(initFloatingAnimations, 100);
		}
	}

	// ========================================
	// PRODUCT HOVER EFFECTS
	// ========================================
	function initProductHoverEffects() {
		const wrappers = document.querySelectorAll(".product8_image-wrapper");
		wrappers.forEach(wrapper => {
			const defaultImage = wrapper.querySelector(".product8_image:not(.hover)");
			const hoverImage = wrapper.querySelector(".product8_image.hover");

			if (defaultImage && hoverImage) {
				wrapper.addEventListener("mouseenter", function () {
					defaultImage.style.opacity = 0;
					hoverImage.style.opacity = 1;
				});
				wrapper.addEventListener("mouseleave", function () {
					defaultImage.style.opacity = 1;
					hoverImage.style.opacity = 0;
				});
			}
		});
	}

	// ========================================
	// SCROLL-TRIGGERED ANIMATIONS
	// ========================================
	function initScrollAnimations() {
		if (typeof gsap !== "undefined") {
			gsap.registerPlugin(ScrollTrigger);

			// Fade in animations for sections
			const fadeElements = document.querySelectorAll(".fade-in, .section_about, .section_shop");
			fadeElements.forEach(element => {
				gsap.fromTo(
					element,
					{ opacity: 0, y: 50 },
					{
						opacity: 1,
						y: 0,
						duration: 1,
						ease: "power2.out",
						scrollTrigger: {
							trigger: element,
							start: "top 80%",
							end: "bottom 20%",
							toggleActions: "play none none reverse",
						},
					}
				);
			});
		} else {
			setTimeout(initScrollAnimations, 100);
		}
	}

	// ========================================
	// BUTTON HOVER ANIMATIONS
	// ========================================
	function initButtonAnimations() {
		const buttons = document.querySelectorAll(".button");
		buttons.forEach(button => {
			button.addEventListener("mouseenter", function () {
				gsap.to(this, {
					scale: 1.05,
					duration: 0.2,
					ease: "power2.out",
				});
			});

			button.addEventListener("mouseleave", function () {
				gsap.to(this, {
					scale: 1,
					duration: 0.2,
					ease: "power2.out",
				});
			});
		});
	}

	// ========================================
	// NAVIGATION ANIMATIONS
	// ========================================
	function initNavigationAnimations() {
		// Add smooth scroll behavior for navigation links
		const navLinks = document.querySelectorAll('a[href^="#"]');
		navLinks.forEach(link => {
			link.addEventListener("click", function (e) {
				e.preventDefault();
				const targetId = this.getAttribute("href");
				const targetElement = document.querySelector(targetId);

				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}
			});
		});
	}

	// ========================================
	// LOADING ANIMATIONS
	// ========================================
	function initLoadingAnimations() {
		// Page load animations
		window.addEventListener("load", function () {
			gsap.to(".page-wrapper", {
				opacity: 1,
				duration: 0.5,
				ease: "power2.out",
			});
		});
	}

	// ========================================
	// UTILITY FUNCTIONS
	// ========================================

	// Debounce function for performance
	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	// Check if element is in viewport
	function isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
	}

	// ========================================
	// MAIN INITIALIZATION
	// ========================================
	function init() {
		// Initialize all animations
		initFloatingAnimations();
		initProductHoverEffects();
		initScrollAnimations();
		initButtonAnimations();
		initNavigationAnimations();
		initLoadingAnimations();

		// Handle window resize events
		window.addEventListener(
			"resize",
			debounce(function () {
				// Refresh ScrollTrigger on resize
				if (typeof ScrollTrigger !== "undefined") {
					ScrollTrigger.refresh();
				}
			}, 250)
		);
	}

	// Start initialization when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}

	// Export functions for potential external use
	window.GenskinsAnimations = {
		initFloatingAnimations,
		initProductHoverEffects,
		initScrollAnimations,
		initButtonAnimations,
		initNavigationAnimations,
		initLoadingAnimations,
		isInViewport,
		debounce,
	};
})();
