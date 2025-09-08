// Selectors
const navButtons = document.querySelectorAll(".btn-category"); // Category filter buttons
const addItemBtn = document.getElementById("btnAddItem"); // "Add New Item" button
const menuContainer = document.getElementById("menuItemsContainer"); // Container for menu cards
const itemsForm = document.getElementById("menuFormPopup"); // Form popup container

let editingCard = null; // Tracks which card is being edited

// ----- Category Filter -----
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Show/hide cards based on category
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

// ----- Open & Close Form -----
function openForm() {
  itemsForm.style.display = "block";
}

function closeForm() {
  itemsForm.style.display = "none";
  editingCard = null; // Reset editing state
}

// ----- Add or Edit Menu Item -----
function addItem() {
  // Get form values
  let name = document.getElementById("menuItemName").value;
  let price = document.getElementById("menuItemPrice").value;
  let category = document.getElementById("menuItemCategory").value.toLowerCase();
  let prepTime = document.getElementById("menuItemPrepTime").value;
  let desc = document.getElementById("menuItemDesc").value;
  let image =
    document.getElementById("menuItemImageUrl").value ||
    "https://via.placeholder.com/150";

  if (editingCard) {
    // ----- Update existing card -----
    editingCard.querySelector("h3").innerText = name;
    editingCard.querySelector(".price").innerText = "₹" + price;
    editingCard.querySelector(".category-badge").innerText = category;
    editingCard.querySelector(".card-desc").innerText = desc;
    editingCard.querySelector(".card-footer").innerHTML = `
      <img src="images/active-orders.svg" alt="clock" width="14" height="14"> ${prepTime} min
    `;
    editingCard.querySelector("img").src = image;
    editingCard.setAttribute("data-category", category);

    editingCard = null; // Reset editing state
  } else {
    // ----- Create new card -----
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-category", category);

    card.innerHTML = `
      <img src="${image}" alt="${name}">
      <div class="card-content">
        <div class="card-title">
          <h3>${name}</h3>
          <span class="price">₹${price}</span>
        </div>
        <span class="category-badge">${category}</span>
        <p class="card-desc">${desc}</p>
        <div class="card-footer">
          <img src="images/icon-clock.svg" alt="clock" width="14" height="14"> ${prepTime} min
        </div>
        <button class="edit-btn">✏️ Edit</button>
      </div>
    `;

    // ----- Attach edit functionality -----
    card.querySelector(".edit-btn").addEventListener("click", function () {
      openForm();

      // Populate form with existing card data
      document.getElementById("menuItemName").value =
        card.querySelector("h3").innerText;
      document.getElementById("menuItemPrice").value =
        card.querySelector(".price").innerText.replace("₹", "");
      document.getElementById("menuItemCategory").value =
        card.querySelector(".category-badge").innerText;
      document.getElementById("menuItemPrepTime").value =
        card.querySelector(".card-footer").innerText.replace("min", "").trim();
      document.getElementById("menuItemDesc").value =
        card.querySelector(".card-desc").innerText;
      document.getElementById("menuItemImageUrl").value =
        card.querySelector("img").src;

      editingCard = card; // Mark card for editing
    });

    menuContainer.appendChild(card);
  }

  closeForm(); // Close popup

  // Reset form fields
  document.getElementById("menuItemName").value = "";
  document.getElementById("menuItemPrice").value = "";
  document.getElementById("menuItemCategory").value = "";
  document.getElementById("menuItemPrepTime").value = "";
  document.getElementById("menuItemDesc").value = "";
  document.getElementById("menuItemImageUrl").value = "";
}

// ----- Event Listeners -----
addItemBtn.addEventListener("click", openForm);
document.getElementById("btnCancelItem").addEventListener("click", closeForm);
document.getElementById("btnSaveItem").addEventListener("click", addItem);
