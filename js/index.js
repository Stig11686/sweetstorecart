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

    const productTitle = Array.from(document.querySelectorAll('.product-title'));
    const productPrice = document.querySelector('.product-price');
    const productImage = document.getElementById('product-image');
    const productDescription = document.querySelector('.product-description');
    const productCard = document.querySelector('.product-card');

    productTitle.forEach(title => title.innerHTML = productData.name);
    productPrice.innerHTML = `£${productData.price} per gram`;
    productImage.src = productData.imagePath;
    productImage.alt = productData.name;
    productDescription.innerHTML = productData.description;
    productCard.dataset.id = productData.id;

}

const productCards = Array.from(document.querySelectorAll('.product-card'));

productCards.forEach(product => {
    product.addEventListener('click', addProductToCart)
})

function addProductToCart(event) {
    // don't follow the link href
    const productTitles =
    Array.from(document.querySelectorAll('.product-title-link'));

    productTitles.forEach(title => {
        if(event.target !== title){
            event.preventDefault();
        }
    })


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
    updateCartWidget();

}

function removeWeightFromProduct(event){

    event.preventDefault();
    const targetId = event.target.closest('[data-id]').dataset.id;

    for (let i = 0; i < window.cart.length; i++) {
        if (window.cart[i].id == targetId) {
            //remove product from cart if the next click will take the weight down to zero
            if(window.cart[i].weight - window.cart[i].weightInGrams <= 0){
                window.cart[i].weight -= window.cart[i].weightInGrams
                window.cart = window.cart.filter(item => item.weight > 0);
                saveCart();
                window.location.reload();
                saveCart();
            } else {
                window.cart[i].weight -= window.cart[i].weightInGrams
                saveCart();
            }
        }
    }

    saveCart();
    updateCartWidget();
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

function updateCartWidget(){
    const widget = document.getElementById('cart-widget');
    const cartItemsNumber = document.querySelector('.cart-items-number');

    if(window.cart.length){
        cartItemsNumber.classList.remove('hidden');
        cartItemsNumber.classList.add('block');
        cartItemsNumber.innerText = window.cart.length;
    } else {
        cartItemsNumber.classList.add('hidden');
        cartItemsNumber.classList.remove('block');
        cartItemsNumber.innerText = '';
    }


}

updateCartWidget();