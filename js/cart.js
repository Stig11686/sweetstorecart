//GLOBAL VARIABLES AT THE TOP OF THE DOCUMENT AS PER JAVASCRIPT CODING STANDARDS
const cartPage = document.querySelector('#cart');
const cartTable = document.querySelector('.cart-items');
const errorMessage = document.querySelector('.error-message');
let currentWeight = document.querySelector('.current-weight');
const clearCartBtn = document.querySelector('.clear-cart-btn');
let markup

//DEFINE WHAT MARKUP WE WANT OUR CART TO USE - IF THE CART DOESN'T EXIST OR HAS A LENGTH OF ZERO WE OUTPUT A MESSAGE - OTHERWISE WE OUTPUT EACH OF OUR ITEMS
if(cartPage){
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
                <td class="h-full"><p class="cursor-pointer remove-item block w-6 h-6 flex items-center justify-center text-lightgrey font-bold text-center p-2 rounded-full border border-1 border-lightgrey" onclick="removeItemFromCart()">X</p></td>
                <td><img class="h-28 w-28" src="${element.imagePath}" alt="${element.name}" /></td>
                <td><p>${element.name}</p></td>
                <td><p class="price">£${element.price}</p></td>
                <td class=""><input class="rounded text-white bg-cta py-2 px-4 minusBtn" type="button" value="-"><label class="sr-only">${element.name} quantity</label><input class="text-center itemQuantity" type="number" step="${element.weightInGrams}" size="4" value="${element.weight}" disabled /><input type="button" class="bg-cta px-4 py-2 rounded plusBtn" value="+" /></td>
                <td class="line-cost"><p class="calculated-price"></p></td>
            </tr>
        `
        cartTable.insertAdjacentHTML('afterbegin', markup);
        saveCart();
        });

    }

    //LOOP OVER EACH OF THE CART ITEMS WE'VE INJECTED INTO THE PAGE AND ADD BUTTON FUNCTIONALITY TO EACH AND CALCULATE THE SUBTOTAL FOR EACH
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
            //IN OUR HTML WE HAVE DEFINED A 'STEP' ATTRIBUTE THAT IS EQUAL TO THE WEIGHT IN GRAMS OF EACH SWEET - HOWEVER IT IS RETURNED TO US HERE AS A STRING - SO WE NEED TO CONVERT IT TO A NUMBER TO USE IT IN MATHS
            let step = Number(quantity.step)

            //ONE OF OUR SWEETS HAS A DECIMAL SO WE HAVE TO HANDLE IT SLIGHTLY DIFFERENTLY - WE WANT TO ENSURE THAT EVERY SUM IT DOES ONLY ROUNDS TO 1 DECIMAL PLACE
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
            handlePostage();
        })
    }

    function decrementQty(item){
        const minusBtn = item.querySelector('.minusBtn');
        const quantity = item.querySelector('.itemQuantity');
        minusBtn.addEventListener('click', function(e){
            e.preventDefault();
            let step = Number(quantity.step)

            //THIS IS THE SAME AS THE INCREMENT FUNCTION - BUT WE CAN'T REUSE THAT CODE AS WE NEED TO SUBTRACT HERE INSTEAD OF ADD
                if(Number.isInteger(step)){
                    quantity.value = parseInt(quantity.value) - parseInt(step);
                } else {
                    quantity.value = Number(parseFloat(quantity.value) - parseFloat(step)).toFixed(1);
                }
                //BY ADDING A MINIMUM VALUE IN THE HTML - THIS SHOULDN'T BE REQUIRED - BUT IN TESTING SOME VALUES DID GO BELOW ZERO - SO IF IT HAPPENS WE SET IT TO ZERO HERE.
                if(quantity.value <= 0) {
                    quantity.value = 0;
                }

                //CHECKS WHEN THE DECREASE BUTTON IS CLICKED
                removeWeightFromProduct(e);
                saveCart();
                calculateSubtotal(item);
                calculateCartTotal();
                handleCartWeight();
                handlePostage();
                updateCartWidget();
        })
    }

    function removeItemFromCart(){
        const removeItemBtns = Array.from(document.querySelectorAll('.remove-item'));

        removeItemBtns.forEach(btn => {
            btn.addEventListener('click', function(){
                const targetId = btn.closest('[data-id]').dataset.id;
                let product = getProductById(window.cart, targetId);

                window.cart.forEach(item => {
                    if(item.id == targetId){
                        window.cart = window.cart.filter(item => item.id != product.id)
                        saveCart();
                        handlePostage();
                        updateCartWidget();
                        //WE REFRESH THE PAGE HERE - WHEN ADDING A SERVER SIDE TO THIS APPLICATION AN AJAX REQUEST WOULD REPLACE THIS
                        window.location.reload();
                    }
                })

            })
        })

    };

    //THIS IS ONE OF A NUMBER OF FUNCTIONS THAT I WRITE AND THEN CALL IMMEDIATELY - THIS IS BECAUSE THEY NEED TO RUN AS SOON AS THE PAGES OPENS IN CASE USERS HAVE ADDED TO THE CART FROM ELSEWHERE
    function calculateSubtotal(item){
        const calculatedPriceEl = item.querySelector('.calculated-price');
        let priceEl = item.querySelector('.price')
        let price = parseFloat(priceEl.innerText.replace(/£/g, ""));
        let quantity = parseFloat(item.querySelector('.itemQuantity').value);
        price = (price * quantity).toFixed(2);
        calculatedPriceEl.innerText = `£${price}`;
    }

    function calculateCartTotal(){
        const subtotalElement = document.querySelector('.subtotal');
        const lineItems = Array.from(document.querySelectorAll('.line-cost'));
        const postalTotal = handlePostage();
        const finalTotalElement = document.querySelector('.final-total');
        let finalTotal = 0;

        if(lineItems.length){
            let prices = lineItems.map(item => {
            return parseFloat(item.innerText.replace(/£/g, ""));
            })

            let subtotal = prices.reduce((a, b) => a + b);
            subtotal = subtotal.toFixed(2);
            console.log(subtotal);
            subtotalElement.innerText = `£${subtotal}`

            if(typeof postalTotal === 'number'){
                finalTotal = (Number(subtotal) + postalTotal).toFixed(2);
                finalTotalElement.innerText = `£${finalTotal}`;
            }
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
        return cartWeight;
    }

    function handlePostage(){
        const postageMessage = document.querySelector('.postage-message');
        const postalTotal = document.querySelector('.postage-total');
        let postalAmount;

        if(window.cart.length){
            const cartWeight = handleCartWeight();

            switch (true) {
                case cartWeight < 40:
                    postageMessage.innerText = 'You need at least 40grams of sweets in your cart to order'
                    break;
                case (cartWeight > 40 && cartWeight <= 250):
                    postageMessage.innerHTML = ''
                    postalAmount = 1.5;
                    postalTotal.innerText = `£${postalAmount.toFixed(2)}`;
                    break;
                case (cartWeight > 250 && cartWeight <= 500):
                    postageMessage.innerHTML = ''
                    postalAmount = 2;
                    postalTotal.innerText = `£${postalAmount.toFixed(2)}`;
                    break;
                case cartWeight > 500:
                    postageMessage.innerHTML = ''
                    postalAmount = 2.5;
                    postalTotal.innerText = `£${postalAmount.toFixed(2)}`;
                    break;
                default:
                    postalAmount = 'Your cart needs to contain 40 grams of sweets to qualify for postage'
                    break;
            }
        }

        return postalAmount;

    }

    handlePostage();

    function clearCart(){
        localStorage.setItem('cart', '');
        window.location.reload();

    }
    if(clearCartBtn){
        clearCartBtn.addEventListener('click', clearCart);
    }

}

