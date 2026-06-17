let products = [];
window.allProducts = [];

// ---------------- LOAD PRODUCTS ----------------
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:9090/products");
    const data = await res.json();

    products = data;
    window.allProducts = data;

    displayProducts(data);
  } catch (err) {
    console.log("Error loading products:", err);
  }
}

// ---------------- DISPLAY PRODUCTS ----------------
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

// ---------------- OPEN PRODUCT DETAILS ----------------
function openDetails(id) {
  window.location.href = "product-details.html?id=" + id;
}

// ---------------- SEARCH ----------------
function searchProducts() {
  const box = document.querySelector(".search-box");
  if (!box) {
    console.error("Search box not found");
    return;
  }

  const query = box.value.trim().toLowerCase();

  // if empty -> show all products again
  if (query === "") {
    displayProducts(products);
    return;
  }

  // filter products array
  const filtered = products.filter(p =>
    p.name && p.name.toLowerCase().includes(query)
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


// ---------------- CART HELPERS ----------------
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

// ---------------- CART PAGE RENDER ----------------
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

// ---------------- REMOVE FROM CART ----------------
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

// ---------------- LOAN ----------------
function goToLoan(amount) {
  localStorage.setItem("loanAmount", amount);
  window.location.href = "loan.html";
}

// ---------------- PAGE LOAD ----------------
window.addEventListener("load", () => {
  updateCartCount();

  if (document.getElementById("productList")) loadProducts();
  if (document.getElementById("cartItemsArea")) renderCartPage();
});

// ---------------- BACK BUTTON ----------------
function goBack() {
  window.location.href = "index.html";
}

// ---------------- CHECKOUT ----------------
function goToAddress() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  window.location.href = "address.html";
}

function showUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  const logged = localStorage.getItem("loggedIn");

  if (user && logged === "yes") {
    document.getElementById("usernameArea").innerText = "Hi, " + user.name;
  }
}

window.onload = showUser;
