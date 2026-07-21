// ================= PRODUCTS (FROM BACKEND REMOVED) =================
let products = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 1499,
    image: "images/earbuds.jpg",
    description: "High-quality wireless earbuds with deep bass and long battery life.",
    reviews: [
      { user: "Darsha", rating: 5, comment: "Amazing sound quality!" },
      { user: "prisha", rating: 4, comment: "Good product for this price." }
    ]
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2499,
    image: "images/watch.jpg",
    description: "Smart fitness watch with heart-rate monitoring and 7-day battery life.",
    reviews: [
      { user: "Priya", rating: 3, comment: "Very stylish and smooth!" },
      { user: "anshu", rating: 4, comment: "Good features." }
    ]
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 999,
    image: "images/speaker.jpg",
    description: "Portable Bluetooth speaker with loud sound and deep bass.",
    reviews: [
      { user: "Sneha", rating: 5, comment: "Great for parties!" }
    ]
  },
  {
    id: 4,
    name: "Power Bank",
    price: 1299,
    image: "images/powerbank.jpg",
    description: "10,000mAh fast-charging power bank for all devices.",
    reviews: [
      { user: "nirav", rating: 4, comment: "Charges fast." }
    ]
  },
  {
    id: 5,
    name: "Neckband",
    price: 699,
    image: "images/neckband.jpg",
    description: "Lightweight neckband with powerful bass and noise isolation.",
    reviews: [
      { user: "nanni", rating: 5, comment: "Very comfortable!" }
    ]
  },
  {
    id: 6,
    name: "Smartphone Case",
    price: 599,
    image: "images/case.jpg",
    description: "Strong shockproof smartphone case with modern design.",
    reviews: []
  },
  {
    id: 7,
    name: "Portable Charger",
    price: 1799,
    image: "images/charger.jpg",
    description: "Ultra-fast 22.5W portable charger for all smartphones.",
    reviews: [
      { user: "monika", rating: 5, comment: "Very good for travel." }
    ]
  },
  {
    id: 8,
    name: "Wireless Mouse",
    price: 899,
    image: "images/mouse.jpg",
    description: "Smooth, ergonomic wireless mouse with 2-year battery life.",
    reviews: [
      { user: "Amit", rating: 4, comment: "Works perfectly." }
    ]
  }
];

window.allProducts = products;


// ================= DISPLAY PRODUCTS =================
function displayProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = list
    .map(
      (p) => `
      <div class="card" style="cursor:pointer" onclick="openDetails(${p.id})">
        <img class="product-img" src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <div class="small-text">₹${p.price}</div>
      </div>
    `
    )
    .join("");
}


// ================= OPEN DETAILS PAGE =================
function openDetails(id) {
  window.location.href = "product-details.html?id=" + id;
}


// ================= LOAD PRODUCTS =================
function loadProducts() {
    console.log(products);
    displayProducts(products);
}

// ================= SEARCH PRODUCTS =================
function searchProducts() {
  const box = document.querySelector(".search-box");
  if (!box) return;

  const query = box.value.trim().toLowerCase();

  if (query === "") {
    displayProducts(products);
    return;
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  const productList = document.getElementById("productList");
  if (!productList) return;

  if (filtered.length === 0) {
    productList.innerHTML = `
      <p style="padding:20px;font-size:18px;">
        No products found for <strong>${query}</strong>
      </p>
    `;
  } else {
    displayProducts(filtered);
  }
}


// ================= CART FUNCTIONS =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.innerText = getCart().length;
}

function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  updateCartCount();
  alert("Added to cart!");
}


// ================= CART PAGE =================
function renderCartPage() {
  const cartArea = document.getElementById("cartItemsArea");
  const totalEl = document.getElementById("totalAmount");
  const loanBox = document.getElementById("loanBox");
  if (!cartArea) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartArea.innerHTML = `<div class="card">Your cart is empty <a href="index.html">Shop now</a></div>`;
    totalEl.innerText = 0;
    loanBox.innerHTML = "";
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach((p, i) => {
    total += Number(p.price);

    html += `
      <div class="item card" style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${p.image}" style="width:80px;height:80px;border-radius:10px;" />
          <div>
            <div style="font-size:18px;">${p.name}</div>
            <small>₹${p.price}</small>
          </div>
        </div>

        <button class="btn ghost" onclick="removeFromCart(${i})">
          Remove
        </button>
      </div>
    `;
  });

  cartArea.innerHTML = html;
  totalEl.innerText = total;

  loanBox.innerHTML =
    total >= 5000
      ? `<button class="btn" onclick="goToLoan(${total})">Apply for Loan</button>`
      : `<small>Add ₹${5000 - total} more for loan eligibility.</small>`;
}


// ================= REMOVE CART ITEM =================
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}


// ================= LOAN PAGE =================
function goToLoan(amount) {
  localStorage.setItem("loanAmount", amount);
  window.location.href = "loan.html";
}


// ================= OTHER NAVIGATION =================
function goBack() {
  window.location.href = "index.html";
}

function goToAddress() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  window.location.href = "address.html";
}


// ================= USER DISPLAY =================
function showUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  const logged = localStorage.getItem("loggedIn");

  if (user && logged === "yes") {
    const el = document.getElementById("usernameArea");
    if (el) el.innerText = "Hi, " + user.name;
  }
}


// ================= PAGE LOAD =================
window.addEventListener("load", () => {
  updateCartCount();
  showUser();

  if (document.getElementById("productList")) loadProducts();
  if (document.getElementById("cartItemsArea")) renderCartPage();
});