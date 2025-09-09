const API_URL = "http://127.0.0.1:8000/menu/";

const navButtons = document.querySelectorAll(".btn-category");
const addItemBtn = document.getElementById("btnAddItem");
const menuContainer = document.getElementById("menuItemsContainer");
const itemsForm = document.getElementById("menuFormPopup");

let editingCard = null;
let editingId = null; // store DB id when editing

// ----- Open & Close Form -----
function openForm() {
  itemsForm.style.display = "block";
}
function closeForm() {
  itemsForm.style.display = "none";
  editingCard = null;
  editingId = null;
}

// ----- Fetch All Items from Backend -----
async function loadMenuItems() {
  const res = await fetch(API_URL);
  const items = await res.json();
  menuContainer.innerHTML = "";
  items.forEach(createCard);
}

// ----- Create Card -----
function createCard(item) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-category", item.category.toLowerCase());
  card.setAttribute("data-id", item.id);

  card.innerHTML = `
    <img src="${item.image_url || "https://via.placeholder.com/150"}" alt="${item.item_name}">
    <div class="card-content">
      <div class="card-title">
        <h3>${item.item_name}</h3>
        <span class="price">₹${item.price}</span>
      </div>
      <span class="category-badge">${item.category}</span>
      <p class="card-desc">${item.description || ""}</p>
      <div class="card-footer">
        <img src="images/icon-clock.svg" alt="clock" width="14" height="14"> ${item.prep_time} min
      </div>
      <button class="edit-btn">✏️ Edit</button>
    </div>
  `;

  // ----- Edit button functionality -----
  card.querySelector(".edit-btn").addEventListener("click", function () {
    openForm();
    document.getElementById("menuItemName").value = item.item_name;
    document.getElementById("menuItemPrice").value = item.price;
    document.getElementById("menuItemCategory").value = item.category;
    document.getElementById("menuItemPrepTime").value = item.prep_time;
    document.getElementById("menuItemDesc").value = item.description || "";
    document.getElementById("menuItemImageUrl").value = item.image_url || "";

    editingCard = card;
    editingId = item.id; // set DB id
  });

  menuContainer.appendChild(card);
}

// ----- Add or Update Menu Item -----
async function saveItem() {
  let item = {
    item_name: document.getElementById("menuItemName").value,
    price: parseInt(document.getElementById("menuItemPrice").value),
    category: document.getElementById("menuItemCategory").value.toLowerCase(),
    prep_time: parseInt(document.getElementById("menuItemPrepTime").value) || 5,
    description: document.getElementById("menuItemDesc").value,
    image_url: document.getElementById("menuItemImageUrl").value,
  };

  if (editingId) {
    // ----- UPDATE -----
    const res = await fetch(API_URL + editingId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const updated = await res.json();
    if (res.ok) {
      editingCard.remove(); // remove old card
      createCard(updated); // add updated card
    } else {
      alert(updated.detail || "Update failed");
    }
  } else {
    // ----- CREATE -----
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const newItem = await res.json();
    if (res.ok) {
      createCard(newItem);
    } else {
      alert(newItem.detail || "Create failed");
    }
  }

  closeForm();
  resetForm();
}

// ----- Reset Form -----
function resetForm() {
  document.getElementById("menuItemName").value = "";
  document.getElementById("menuItemPrice").value = "";
  document.getElementById("menuItemCategory").value = "";
  document.getElementById("menuItemPrepTime").value = "";
  document.getElementById("menuItemDesc").value = "";
  document.getElementById("menuItemImageUrl").value = "";
}

// ----- Category Filter -----
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove active class
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");
    Array.from(menuContainer.children).forEach((card) => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ✅ Default = All active
document.querySelector('.btn-category[data-category="all"]').click();

// ----- Event Listeners -----
addItemBtn.addEventListener("click", openForm);
document.getElementById("btnCancelItem").addEventListener("click", closeForm);
document.getElementById("btnSaveItem").addEventListener("click", saveItem);

// Load items on page start
loadMenuItems();
