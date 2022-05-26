const cartPage = document.querySelector('#cart');
const cartTable = document.querySelector('.cart-items');
const errorMessage = document.querySelector('.error-message');
let currentWeight = document.querySelector('.current-weight');
const clearCartBtn = document.querySelector('.clear-cart-btn');
let markup

if(!window.cart.length){
    markup = `<div class="flex flex-col items-center justify-center">
    <h1 class="text-xxl text-center mb-8">You Have No Items in the Cart!</h1><br>
    <a class="text-center py-2 px-4 bg-cta text-white font-bold" href="./products.html" title="Go to Shop">Shop Now!</a>

    </div> `

    cartPage.innerHTML = ''
    cartPage.insertAdjacentHTML('afterbegin', markup);
} else {
    window.cart.forEach(element => {
        markup = `
        <tr class="w-full my-4 rounded cart-item text-center" data-id="${element.id}">
            <td class="h-full"><p class="block w-6 h-6 flex items-center justify-center text-lightgrey font-bold text-center p-2 rounded-full border border-1 border-lightgrey">X</p></td>
            <td><img class="h-28 w-28" src="${element.imagePath}" alt="${element.name}" /></td>
            <td><p>${element.name}</p></td>
            <td><p class="price">£${element.price}</p></td>
            <td class=""><input class="rounded text-white bg-cta py-2 px-4 minusBtn" type="button" value="-"><label class="sr-only">${element.name} quantity</label><input class="text-center itemQuantity" type="number" step="${element.weightInGrams}" size="4" value="${element.weight}" inputmode="numeric" /><input type="button" class="bg-cta px-4 py-2 rounded plusBtn" value="+" /></td>
            <td class="line-cost"><p class="calculated-price"></p></td>
        </tr>
    `
    cartTable.insertAdjacentHTML('afterbegin', markup);
    saveCart();
    });

}

const cartItems = document.querySelectorAll('.cart-item');
cartItems.forEach(item => {
    calculateSubtotal(item);
    incrementQty(item);
    decrementQty(item);
})

function incrementQty(item){
    const plusBtn = item.querySelector('.plusBtn');
    const quantity = item.querySelector('.itemQuantity');
    plusBtn.addEventListener('click', function(e){
        e.preventDefault();
        let step = Number(quantity.step)

        if(Number.isInteger(step)){
            quantity.value = parseInt(quantity.value) + parseInt(step);
        } else {
            quantity.value = Number(parseFloat(quantity.value) + parseFloat(step)).toFixed(1);
        }

        addProductToCart(e);
        saveCart();
        calculateSubtotal(item);
        calculateCartTotal();
        handleCartWeight();

    })
}

function decrementQty(item){
    const minusBtn = item.querySelector('.minusBtn');
    const quantity = item.querySelector('.itemQuantity');
    minusBtn.addEventListener('click', function(e){
        e.preventDefault();
        let step = Number(quantity.step)


            if(Number.isInteger(step)){
                quantity.value = parseInt(quantity.value) - parseInt(step);
            } else {
                quantity.value = Number(parseFloat(quantity.value) - parseFloat(step)).toFixed(1);
            }

            if(quantity.value <= 0) {
                quantity.value = 0;
                //removeProductFromCart();
            }

            removeWeightFromProduct(e);
            saveCart();
            calculateSubtotal(item);
            calculateCartTotal();
            handleCartWeight();
    })
}

function calculateSubtotal(item){
    const calculatedPriceEl = item.querySelector('.calculated-price');
    let priceEl = item.querySelector('.price')
    let price = parseFloat(priceEl.innerText.replace(/£/g, ""));
    let quantity = parseFloat(item.querySelector('.itemQuantity').value);
    price = (price * quantity).toFixed(2);
    calculatedPriceEl.innerText = `£${price}`;
}

function calculateCartTotal(){
    let subtotalElement = document.querySelector('.subtotal');
    let lineItems = Array.from(document.querySelectorAll('.line-cost'));

    if(lineItems.length){
        let prices = lineItems.map(item => {
        return parseFloat(item.innerText.replace(/£/g, ""));
        })

        let subtotal = prices.reduce((a, b) => a + b);
        subtotal = subtotal.toFixed(2);
        subtotalElement.innerText = `£${subtotal}`
    }

}

calculateCartTotal();

function handleCartWeight(){
    let cartWeight;

    if(window.cart.length){
        cartWeight = window.cart.map(item => item.weight).reduce((a,b) => a + b)
    } else {
        cartWeight = 0
    }
    currentWeight.innerText = cartWeight.toFixed(1);

    if(cartWeight >= 40){
        errorMessage.classList.add('hidden');
        errorMessage.classList.remove('block')
    } else {
        errorMessage.classList.add('block');
        errorMessage.classList.remove('hidden')
    }
}

handleCartWeight();

function clearCart(){
    localStorage.setItem('cart', '');
    window.location.reload();

}

clearCartBtn.addEventListener('click', clearCart);


