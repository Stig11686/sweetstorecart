// I've entered the products as an array in an inline file. In production this would be done server side
//with a database - but I haven't done this to avoid using frameworks

window.products = [
    {
        id: 1,
        name: 'Rhubarb & Custard',
        price: 0.01,
        weightInGrams: 2.5,
        imagePath: './assets/custom-cupcakes.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, amet atque possimus quia quae eum vitae quasi facilis, fugit eveniet impedit ipsam voluptas perferendis ad iure deleniti corporis harum et!',
        featured: false
    },
    {
        id: 2,
        name: 'Kola Kubes',
        price: 0.02,
        weightInGrams: 2,
        imagePath: './assets/fizzy-bombs.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, amet atque possimus quia quae eum vitae quasi facilis, fugit eveniet impedit ipsam voluptas perferendis ad iure deleniti corporis harum et!',
        featured: true
    },
    {
        id: 3,
        name: 'Pear Drops',
        price: 0.01,
        weightInGrams: 1,
        imagePath: './assets/fruit-pastilles-product.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, amet atque possimus quia quae eum vitae quasi facilis, fugit eveniet impedit ipsam voluptas perferendis ad iure deleniti corporis harum et!',
        featured: false
    },
    {
        id: 4,
        name: 'Chocolate Limes',
        price: 0.03,
        weightInGrams: 3,
        imagePath: './assets/gummy-bears.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, amet atque possimus quia quae eum vitae quasi facilis, fugit eveniet impedit ipsam voluptas perferendis ad iure deleniti corporis harum et!',
        featured: true
    },
    {
        id: 5,
        name: 'Aniseed Twists',
        price: 0.03,
        weightInGrams: 2.7,
        imagePath: './assets/hearts.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, amet atque possimus quia quae eum vitae quasi facilis, fugit eveniet impedit ipsam voluptas perferendis ad iure deleniti corporis harum et!',
        featured: false
    },
    {
        id: 6,
        name: 'Everton Mints',
        price: 0.04,
        weightInGrams: 3,
        imagePath: './assets/jellies.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, amet atque possimus quia quae eum vitae quasi facilis, fugit eveniet impedit ipsam voluptas perferendis ad iure deleniti corporis harum et!',
        featured: false
    },
    {
        id: 7,
        name: 'Fruit Bon Bons',
        price: 0.02,
        weightInGrams: 2,
        imagePath: './assets/jelly-snakes.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, amet atque possimus quia quae eum vitae quasi facilis, fugit eveniet impedit ipsam voluptas perferendis ad iure deleniti corporis harum et!',
        featured: true
    }
];

// INJECT PRODUCTS INTO FEATURED AREA ON HOMEPAGE

function renderFeaturedProducts(data){
    const featured = document.querySelector('.featured');
    if(!featured) return;

    const products = getFeaturedProducts(data);
    const list = createUl();
    featured.insertAdjacentElement('afterbegin', list);

    renderProducts(list, products);
}

//This next function renders all the products on the products page

function renderProductsPage(products){
    const productsSection = document.querySelector('.product-display');
    if(!productsSection) return;
    const listElement = createUl();

    productsSection.insertAdjacentElement('afterbegin', listElement);

    renderProducts(listElement, products)

}

function renderProducts(location, products){
    products.forEach(product => {
        const markup = `<li class="px-4 w-full lg:w-4/12 text-center product-card flex flex-col mb-12" data-id=${product.id}>
        <div class="product-card-img mb-4 rounded" style="background-image: url(${product.imagePath});">
        </div>
        <div class="product-card-details flex flex-col justify-between">
            <p class="product-title text-lg font-bold"><a class="product-title-link" href="product.html?id=${product.id}">${product.name}</a></p>
            <p class="product-price mb-4">£${product.price} per ${product.weightInGrams}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart mt-6 bg-cta text-white px-4 py-2 rounded w-6/12 mx-auto">Add to Cart</button>
        </div>
        </li>`

        location.insertAdjacentHTML('afterbegin', markup)
    })
}

//I CREATED A FEATURED LIST - WITH A BOOLEAN VALUE OF WHETHER THE PRODUCT WAS FEATURED OR NOT. MY VISION WAS THAT IF THERE WAS AN ADMIN PAGE A FORM WITH A CHECKBOX COULD CONTROL WHETHER THE PRODUCT WAS FEATURED OR NOT
function getFeaturedProducts(data){
    return data.filter(item => item.featured)
}

//I NEEDED TO CREATE A LIST ELEMENT TO INSERT INTO THE DOM
function createUl(){
    const listElement = document.createElement('ul');
    listElement.classList.add('flex', 'flex-wrap', 'w-full');
    return listElement;
}


renderProductsPage(products);
renderFeaturedProducts(products);
