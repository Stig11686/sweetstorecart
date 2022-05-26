if(!window.cart){
    window.cart = [];
}

const productPageBody = document.getElementById('product-page');

function getProductById(data, id) {

	let products = data.filter(item => item.id == id);

	return products[0];
}

if (productPageBody !== null) {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    const productData = getProductById(window.products, id);

    let productTitle = document.querySelector('.product-title');
    let productPrice = document.querySelector('.product-price');

    productTitle.innerHTML = productData.name;
    productPrice.innerHTML = productData.price;

}

const productCards = Array.from(document.querySelectorAll('.product-card'));

productCards.forEach(product => {
    product.addEventListener('click', addProductToCart)
})

function addProductToCart(event) {
    // don't follow the link href
    const productTitle = document.querySelector('.product-title');
    if(event.target !== productTitle){
        event.preventDefault();
    }

    const targetId = event.target.closest('[data-id]').dataset.id;

    let product = getProductById(window.products, targetId);

    let productAlreadyInCart = false;

    for (let i = 0; i < window.cart.length; i++) {
        if (window.cart[i].id === product.id) {
            productAlreadyInCart = true;
            window.cart[i].weight += window.cart[i].weightInGrams
        }
    }

    if (!productAlreadyInCart) {
        product['weight'] = product.weightInGrams;
        window.cart.push(product);
    }

    saveCart();

}

function removeWeightFromProduct(event){

    event.preventDefault();
    const targetId = event.target.closest('[data-id]').dataset.id;


    for (let i = 0; i < window.cart.length; i++) {
        if (window.cart[i].id == targetId && window.cart[i].weight > 0) {
            window.cart[i].weight -= window.cart[i].weightInGrams
            window.cart = window.cart.filter(item => item.weight > 0);
            console.log(window.cart);
            saveCart();
        }
    }

    saveCart();
}

function loadCart() {
    // if we don't have a record in localstorage already
    // then it'll use the default value of []
    if (localStorage.getItem('cart')) {
        // JSON.parse because it's an array of objects
        window.cart = JSON.parse(localStorage.getItem('cart'));
    }
}

function saveCart() {
    // JSON.stringify because it's an array of objects
    localStorage.setItem('cart', JSON.stringify(window.cart));
}

// load the cart in immediately
loadCart();