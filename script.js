const API =
"https://dummyjson.com/products?limit=100";

const productContainer =
document.getElementById("productContainer");

const searchInput =
document.getElementById("searchInput");

const categoryFilter =
document.getElementById("categoryFilter");

const cartCount =
document.getElementById("cartCount");

const modal =
document.getElementById("productModal");

const themeBtn =
document.getElementById("themeBtn");

let products = [];

let cart =
JSON.parse(localStorage.getItem("cart"))
|| [];

updateCart();

async function fetchProducts(){

    productContainer.innerHTML = `
        <h2>Loading Products...</h2>
    `;

    try{

        const response =
        await fetch(API);

        const data =
        await response.json();

        products = data.products;

        populateCategories();

        displayProducts(products);
    }
    catch(error){

        productContainer.innerHTML = `
            <h2>
                Failed to load products
            </h2>
        `;

        console.log(error);
    }
}

function displayProducts(items){

    productContainer.innerHTML = "";

    if(items.length === 0){

        productContainer.innerHTML = `
            <h2>
                No products found
            </h2>
        `;

        return;
    }

    items.forEach(product => {

        const card =
        document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

        <img src="${product.thumbnail}">

        <div class="card-body">

            <h3>
                ${product.title}
            </h3>

            <p class="price">
                $${product.price}
            </p>

            <p>
                ⭐ ${product.rating}
            </p>

            <p>
                ${product.category}
            </p>

            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>

            <button onclick="showModal(${product.id})">
                View
            </button>

        </div>
        `;

        productContainer.appendChild(card);
    });
}

function populateCategories(){

    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;

    const categories =
    [...new Set(
        products.map(
            product => product.category
        )
    )];

    categories.forEach(category => {

        const option =
        document.createElement("option");

        option.value = category;

        option.innerText =
        category.charAt(0).toUpperCase()
        + category.slice(1);

        categoryFilter.appendChild(option);
    });
}

function filterProducts(){

    const searchText =
    searchInput.value
    .toLowerCase()
    .trim();

    const selectedCategory =
    categoryFilter.value;

    const filteredProducts =
    products.filter(product => {

        const title =
        product.title.toLowerCase();

        const matchesSearch =
        title.includes(searchText);

        const matchesCategory =
        selectedCategory === "all"
        || product.category === selectedCategory;

        return matchesSearch &&
               matchesCategory;
    });

    displayProducts(filteredProducts);
}

function addToCart(id){

    cart.push(id);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();
}

function updateCart(){

    cartCount.innerText =
    cart.length;
}

function showModal(id){

    const product =
    products.find(
        p => p.id === id
    );

    document.getElementById("modalImg")
    .src = product.thumbnail;

    document.getElementById("modalTitle")
    .innerText = product.title;

    document.getElementById("modalPrice")
    .innerText =
    `$${product.price}`;

    document.getElementById("modalDesc")
    .innerText =
    product.description;

    modal.style.display = "flex";
}

document.getElementById("closeModal")
.onclick = () => {

    modal.style.display = "none";
};

window.onclick = e => {

    if(e.target === modal){

        modal.style.display = "none";
    }
};

searchInput.addEventListener(
    "input",
    filterProducts
);

categoryFilter.addEventListener(
    "change",
    filterProducts
);

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");

        if(
            document.body.classList.contains("dark")
        ){

            themeBtn.innerText = "☀";
        }
        else{

            themeBtn.innerText = "🌙";
        }
    }
);

fetchProducts();