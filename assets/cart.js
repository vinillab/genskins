/*!
 * Cart.js - A JavaScript library for managing Shopify carts
 * https://cartjs.org
 */

(function ($) {
	"use strict";

	var CartJS = {
		init: function (cart) {
			this.cart = cart;
			this.bindEvents();
			this.updateCart();
		},

		bindEvents: function () {
			$(document).on("submit", "[data-cart-submit]", function (e) {
				e.preventDefault();
				var $form = $(this);
				var data = $form.serialize();

				$.ajax({
					type: "POST",
					url: "/cart/add.js",
					data: data,
					dataType: "json",
					success: function (item) {
						CartJS.updateCart();
					},
				});
			});
		},

		updateItem: function (itemId, quantity) {
			console.log("Updating item:", itemId, "to quantity:", quantity);
			$.ajax({
				type: "POST",
				url: "/cart/change.js",
				data: {
					id: itemId,
					quantity: quantity,
				},
				dataType: "json",
				success: function (cart) {
					console.log("Cart updated successfully:", cart);
					CartJS.cart = cart;
					CartJS.updateCartBadge(cart);
					$(document).trigger("cart.afterUpdate", [cart]);
				},
				error: function (xhr, status, error) {
					console.error("Error updating item:", error);
					console.error("Response:", xhr.responseText);
				},
			});
		},

		updateCart: function () {
			$.ajax({
				type: "GET",
				url: "/cart.js",
				dataType: "json",
				success: function (cart) {
					CartJS.cart = cart;
					CartJS.updateCartBadge(cart);
					$(document).trigger("cart.afterUpdate", [cart]);
				},
				error: function (xhr, status, error) {
					console.error("Error updating cart:", error);
				},
			});
		},

		updateCartBadge: function (cart) {
			// Update cart badge if it exists
			const cartBadgeElement = document.querySelector(".cart-badge");
			if (cartBadgeElement) {
				cartBadgeElement.textContent = cart.item_count;
				cartBadgeElement.style.display = cart.item_count > 0 ? "flex" : "none";
			}

			// Update navbar cart quantity text
			const cartQuantityText = document.querySelector(".cart-quantity-text");
			if (cartQuantityText) {
				cartQuantityText.textContent = cart.item_count;
				if (cart.item_count === 0) {
					cartQuantityText.style.display = "none";
				} else {
					cartQuantityText.style.display = "inline";
				}
			}
		},

		on: function (event, callback) {
			$(document).on(event, function (e, cart) {
				callback(cart);
			});
		},
	};

	window.CartJS = CartJS;
})(jQuery);
