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
	// SOBRE HOME SECTION ANIMATIONS
	// ========================================
	function initSobreHomeAnimations() {
		if (typeof gsap !== "undefined") {
			gsap.registerPlugin(ScrollTrigger);
			const section = document.querySelector(".secton_sobre_home");
			const image = document.querySelector(".sobre-home-image");
			const content = document.querySelector(".sobre-home-content");

			if (!section || !image) return;

			// Set initial state for the image
			gsap.set(image, { scale: 1 });

			// Initial fade in for image (opacity only, no scale)
			gsap.fromTo(
				image,
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 1.2,
					ease: "power2.out",
					scrollTrigger: {
						trigger: section,
						start: "top 85%",
						end: "top 60%",
						toggleActions: "play none none reverse",
					},
				}
			);

			// Image zoom/parallax effect on scroll (smooth zoom within section bounds)
			gsap.fromTo(
				image,
				{ scale: 1 },
				{
					scale: 1.08,
					ease: "power1.out",
					scrollTrigger: {
						trigger: section,
						start: "top 80%",
						end: "bottom 20%",
						scrub: 2,
						invalidateOnRefresh: true,
					},
				}
			);

			// Fade in content from the right
			if (content) {
				gsap.fromTo(
					content,
					{ opacity: 0, x: 50 },
					{
						opacity: 1,
						x: 0,
						duration: 1,
						ease: "power2.out",
						scrollTrigger: {
							trigger: section,
							start: "top 80%",
							end: "top 50%",
							toggleActions: "play none none reverse",
						},
					}
				);
			}
		} else {
			setTimeout(initSobreHomeAnimations, 100);
		}
	}

	// ========================================
	// GSAP MARQUEE ANIMATIONS
	// ========================================
	function initGSAPMarquees() {
		const marqueeTracks = document.querySelectorAll(".gsap-marquee-track");
		const isMobile = window.innerWidth <= 768;

		// If no marquees found, return early
		if (marqueeTracks.length === 0) return;

		// If GSAP isn't loaded yet, try again in a moment
		if (typeof gsap === "undefined") {
			setTimeout(initGSAPMarquees, 100);
			return;
		}

		marqueeTracks.forEach((track, index) => {
			const speed = parseFloat(track.dataset.speed) || 20;
			const direction = track.dataset.direction || "left";
			const items = track.querySelectorAll(".gsap-marquee-item");
			const images = track.querySelectorAll(".gsap-marquee-image");

			if (items.length === 0) {
				console.warn(`Marquee ${index + 1}: No items found`);
				return;
			}

			// Safari-compatible function to get element width
			function getElementWidth(element) {
				// Force a reflow to ensure Safari calculates the width correctly
				element.offsetHeight;
				return element.offsetWidth || element.getBoundingClientRect().width;
			}

			// Wait for images to load before calculating dimensions
			function waitForImages() {
				return new Promise(resolve => {
					const imagePromises = Array.from(images).map(img => {
						return new Promise(imgResolve => {
							if (img.complete) {
								imgResolve();
							} else {
								img.addEventListener("load", imgResolve, { once: true });
								img.addEventListener("error", imgResolve, { once: true });
							}
						});
					});

					Promise.all(imagePromises).then(() => {
						// Add a small delay to ensure Safari has rendered everything
						setTimeout(resolve, 50);
					});
				});
			}

			// Initialize the marquee after images are loaded
			waitForImages()
				.then(() => {
					// Force a reflow to ensure Safari has calculated all dimensions
					track.offsetHeight;

					// Get the width of the first item with Safari compatibility
					const firstItem = items[0];
					const itemWidth = getElementWidth(firstItem);

					// If we still can't get a valid width, try alternative methods
					if (!itemWidth || itemWidth === 0) {
						// Try getting width from computed styles
						const computedStyle = window.getComputedStyle(firstItem);
						const width = parseFloat(computedStyle.width) || 60; // fallback to 60px

						// Calculate half width based on number of items
						const halfWidth = width * (items.length / 2);

						// Create the animation with fallback values
						createMarqueeAnimation(track, halfWidth, speed, direction);
					} else {
						// Calculate the width of half the items (since we duplicated them)
						const halfWidth = itemWidth * (items.length / 2);

						// Create the animation
						createMarqueeAnimation(track, halfWidth, speed, direction);
					}
				})
				.catch(() => {
					// Fallback: Use CSS animation if JavaScript fails
					enableCSSFallback(track, speed, direction);
				});
		});

		// Separate function to create the animation
		function createMarqueeAnimation(track, halfWidth, speed, direction) {
			// Safari optimization: Use transform3d for hardware acceleration
			let animation;

			if (direction === "right") {
				// For right direction: start from negative position and move to 0
				gsap.set(track, { x: -halfWidth });
				animation = gsap.to(track, {
					x: 0,
					duration: halfWidth / speed,
					ease: "none",
					repeat: -1,
					// Safari-specific optimizations
					force3D: true,
					transformOrigin: "0 0",
					onStart: function () {
						// Add animating class for Safari optimizations
						track.classList.add("animating");
					},
					onComplete: function () {
						// Remove animating class when animation completes (though it repeats infinitely)
						track.classList.remove("animating");
					},
				});
			} else {
				// For left direction: start from 0 and move to negative position
				animation = gsap.to(track, {
					x: -halfWidth,
					duration: halfWidth / speed,
					ease: "none",
					repeat: -1,
					// Safari-specific optimizations
					force3D: true,
					transformOrigin: "0 0",
					onStart: function () {
						// Add animating class for Safari optimizations
						track.classList.add("animating");
					},
					onComplete: function () {
						// Remove animating class when animation completes (though it repeats infinitely)
						track.classList.remove("animating");
					},
				});
			}

			// Mobile-optimized intersection observer
			const isMobile = window.innerWidth <= 768;

			if (isMobile) {
				// On mobile, start animation immediately without intersection observer
				setTimeout(() => {
					animation.play();
					track.classList.add("animating");
				}, 100);
			} else if ("IntersectionObserver" in window) {
				const observer = new IntersectionObserver(
					entries => {
						entries.forEach(entry => {
							if (entry.isIntersecting) {
								// Mobile-optimized delay
								const delay = window.innerWidth <= 768 ? 50 : 10;
								setTimeout(() => {
									animation.play();
									track.classList.add("animating");
								}, delay);
							} else {
								animation.pause();
								track.classList.remove("animating");
							}
						});
					},
					{
						threshold: 0.1,
						rootMargin: window.innerWidth <= 768 ? "100px" : "50px", // Larger margin for mobile
					}
				);

				observer.observe(track);
			} else {
				// Fallback for browsers without IntersectionObserver
				animation.play();
				track.classList.add("animating");
			}

			// Mobile and Safari-specific performance optimization
			const isSafari = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");

			if (isMobile || isSafari) {
				// Reduce animation complexity for mobile and Safari
				animation.timeScale(isMobile ? 0.6 : 0.8);
			}
		}

		// CSS fallback for when GSAP fails
		function enableCSSFallback(track, speed, direction) {
			const animationName = direction === "right" ? "marquee-right" : "marquee-left";
			track.style.animation = `${animationName} ${speed}s linear infinite`;
			track.classList.add("css-fallback");
		}
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
		initGSAPMarquees();
		initSobreHomeAnimations();

		// Handle window resize events
		window.addEventListener(
			"resize",
			debounce(function () {
				// Refresh ScrollTrigger on resize
				if (typeof ScrollTrigger !== "undefined") {
					ScrollTrigger.refresh();
				}

				// Reinitialize marquees on orientation change for mobile
				if (window.innerWidth <= 768) {
					setTimeout(() => {
						initGSAPMarquees();
					}, 100);
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
		initGSAPMarquees,
		initSobreHomeAnimations,
		isInViewport,
		debounce,
	};
})();
