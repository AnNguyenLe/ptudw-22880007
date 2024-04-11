const addCart = async (id, quantity) => {
	const res = await fetch("/products/cart", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ id, quantity }),
	});

	const json = await res.json();
	document.getElementById("cart-quantity").innerText = `(${json.quantity})`;
};

const updateCart = async (id, quantity) => {
	if (quantity > 0) {
		const res = await fetch("/products/cart", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ id, quantity }),
		});

		if (res.status === 200) {
			const json = await res.json();
			document.getElementById("cart-quantity").innerText = `(${json.quantity})`;
			document.getElementById("subtotal").innerText = `$${json.subtotal}`;
			document.getElementById("total").innerText = `$${json.total}`;
			document.getElementById(`total${id}`).innerText = `$${json.item.total}`;
		}
	} else {
		removeItemInCart(id);
	}
};

const removeItemInCart = async (id) => {
	if (confirm("Do you really want to remove this product?")) {
		const res = await fetch("/products/cart", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ id }),
		});

		if (res.status === 200) {
			const json = await res.json();
			document.getElementById("cart-quantity").innerText = `(${json.quantity})`;
			if (json.quantity > 0) {
				document.getElementById("subtotal").innerText = `$${json.subtotal}`;
				document.getElementById("total").innerText = `$${json.total}`;
				document.getElementById(`product${id}`).remove();
			} else {
				document.querySelector(".cart-page .container").innerHTML = `
				<div class="text-center border py-3">
				<h3>Your cart is empty!</h3>
			</div>
				`;
			}
		}
	}
};

const clearCart = async () => {
	if (confirm("Do you really want to clear all cart?")) {
		const res = await fetch("/products/cart/all", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (res.status === 200) {
			document.getElementById("cart-quantity").innerText = `(0)`;

			document.querySelector(".cart-page .container").innerHTML = `
				<div class="text-center border py-3">
				<h3>Your cart is empty!</h3>
			</div>
				`;
		}
	}
};

const placeorders = (e) => {
	e.preventDefault();

	const addressId = document.querySelector("input[name=addressId]:checked");
	if (!addressId || addressId.value == 0) {
		if (!e.target.checkValidity()) {
			return e.target.reportValidity();
		}
	}

	e.target.submit();
};

const checkPasswordConfirm = (formId) => {
	const password = document.querySelector(`#${formId} [name=password]`);
	const confirmPassword = document.querySelector(`#${formId} [name=confirmPassword]`);
	if(password.value !== confirmPassword.value){
		confirmPassword.setCustomValidity('Password does not match!');
		confirmPassword.reportValidity();
	} else {
		confirmPassword.setCustomValidity('');
	}
}
