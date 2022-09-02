class Product {
	// title;
	// imageUrl;
	// price;
	// description;

	constructor(title, img, price, desc) {
		this.title = title;
		this.imageUrl = img;
		this.price = price;
		this.description = desc;
	}
}

class ElementAttribute {
	constructor(attrName, attrValue) {
		this.name = attrName;
		this.value = attrValue;
	}
}

class Component {
	constructor(renderHookId, shouldRender = true) {
		console.log('get called');
		this.hookId = renderHookId;
		if (shouldRender) {
			this.render();
		}
	}
	render() {}

	createRouteElement(tag, cssClasses, attributes) {
		const rootElement = document.createElement(tag);
		if (cssClasses) {
			rootElement.className = cssClasses;
		}
		if (attributes && attributes.length > 0) {
			for (const attr of attributes) {
				rootElement.setAttribute(attr.name, attr.value);
			}
		}
		document.getElementById(this.hookId).append(rootElement);
		return rootElement;
	}
}

class ShoppingCart extends Component {
	constructor(renderHookId) {
		super(renderHookId);
	}
	items = [];

	set cartItems(value) {
		this.items = value;
		this.totalOutput.innerHTML = `<h2>Total:\$${this.totalAmount.toFixed(
			2
		)}</h2>`;
	}
	get totalAmount() {
		const sum = this.items.reduce(
			(prevValue, curItem) => prevValue + curItem.price,
			0
		);
		return sum;
	}

	addProduct(product) {
		const updatedItems = [...this.items];
		updatedItems.push(product);
		this.cartItems = updatedItems;
	}

	orderProducts() {
		console.log('ordering...');
		console.log(this.items);
	}
	render() {
		const cartEl = this.createRouteElement('section', 'cart');
		cartEl.innerHTML = `
		<h2>Total:\$${0}</h2>
		<button>Order Now</button>
		`;

		const orderButton = cartEl.querySelector('button');
		// orderButton.addEventListener('click', this.orderProducts.bind(this)); //?or
		orderButton.addEventListener('click', () => this.orderProducts());
		this.totalOutput = cartEl.querySelector('h2');
		return cartEl;
	}
}

class ProductItem extends Component {
	constructor(product, renderHookId) {
		super(renderHookId, false);
		this.product = product;
		this.render();
	}
	addToCart() {
		console.log('Adding Prod to cart');
		App.addProductToCart(this.product);
	}
	render() {
		const prodEl = this.createRouteElement('li', 'product-item');

		prodEl.innerHTML = `
			<div>
			<img src='${this.product.imageUrl}' alt='${this.product.title}'>
			<div class="product-item__content">
			<h2>${this.product.title}</h2>
			<h3>\$${this.product.price}</h3>
			<p>${this.product.description}</p>
			<button> Add to cart</button>
			</div>
			</div>
			`;

		const addCartBtn = prodEl.querySelector('button');
		addCartBtn.addEventListener('click', this.addToCart.bind(this));
	}
}

class ProductList extends Component {
	constructor(renderHookId) {
		super(renderHookId);
		this.fetchProducts();
	}

	fetchProducts() {
		this.products = [
			new Product(
				'a pillow',
				'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXwBFRcXHhoeOyEhO3xTRlN8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fP/AABEIAIIApwMBIgACEQEDEQH/xAAZAAEBAQEBAQAAAAAAAAAAAAAAAQIEAwX/xAA1EAEAAQMBBAULAwUAAAAAAAAAAQIDERIEEyFRMUFxkZIiIzJCRFJhY4Gx0RQzoQVDcqLw/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+kqKgqooKACqACgAqKAACgqiQoIACqAIOVRRBR227Vqu3EaI9GOIONXvXs0xPkzmPixuK/h3gwN7mv3f5hdzc90GBqLVyfUldxc9ye+AYVZtXI6aKu5YtXJ9SruBkb3F33JXcXOUR2zAMD1/T186e9Y2ernCjyHRTs3vTnsesW6KY9GlBxD12iqma4xjo6nkqgCDmVFEV0WbkxEduHO3ROPuD6FMxVC4eVqeD2iVE0xyNMKoM6Y5GloBnSumFAZ0wuI5NAJhQAeN6OGYnGHrl4X6sUyDmmqZnMmWRFaGQHg0zlRGmqeMsZat8asc4n7A67UYj4veHjb4w9oUVUUBWcqCiAKIAogBM4c20RmjPKXRMvC/Pm6v+6wcoCKogDnyuXnlcoj0y3anztPa8ctUVeXT2wo77E+TDoc1jodEKNQIAomVyAIAplAGic88IoJMcOfa59o/bl0y5tp/bkHKrKoqiZEHDldTyyuRHrqWKnlqbs0TeuRRH1nlAr6mzVaqKZ5w6Yc9mmmidNHo4zxe7SNIZMgCGQUymTIKJkyDS5ZyA19Yhz7XPm/q6ODl2ycUA5cmWciK1kZAcOmY6jEu3QbuOQjhxL6ux2Yt7Pn17nGZ+HJ4bmmepuLWIxTXVTHKKgdkeTOWtcOHdV9V65/H4Sdnuz7Tdj6U/gHfrTeRzfOp2O7T7Zentin8NTsl2farv+v4B37yOaTdiOt8+dhrnp2u93x+HnV/SormJq2raeHRi7MfYH0t7E9ZFyObgp/puno2i/42/wBD8+94wdu8jmuuJccbH8694mo2SI/vXvGDq3jUVw5P03zbviajZ/mXPEDtiqJedy1TdmJq6Ic8WPmXPE1u4681f5TkHlct0RVi1XrhmKHRhMCvHSPXADy0rpe2k0qjy0rEPTSukGMK1pMAg1gwggoCKAAoCCiiCgMphvBgGMDeAAQQAAAAAAAAAAEABQUAEABVQAH/2Q==',
				19.99,
				'soft pillow'
			),
			new Product(
				'a carpet',
				'data:image/jpeg;base64,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',
				25,
				'nice carpet'
			),
		];
		this.renderProducts();
	}

	renderProducts() {
		for (const prod of this.products) {
			new ProductItem(prod, 'prod-list');
		}
	}
	render() {
		this.createRouteElement('ul', 'product-list', [
			new ElementAttribute('id', 'prod-list'),
		]);
		if (this.products && this.products.length > 0) {
			this.renderProducts();
		}
	}
}

class Shop {
	constructor() {
		this.render();
	}
	render() {
		this.cart = new ShoppingCart('app');
		new ProductList('app');
	}
}

class App {
	static cart;

	static init() {
		const shop = new Shop();

		this.cart = shop.cart;
	}

	static addProductToCart(product) {
		this.cart.addProduct(product);
	}
}

App.init();
