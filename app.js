/**
 * K.K. MEDICAL STORE & DIGITAL SERVICES HUB
 * Interactive Normal Website Engine
 */

// Store Configuration
const STORE_CONFIG = {
  name: "K.K. Medical Store",
  phone: "+91 95861 18060",
  whatsappNumber: "919586118060",
  openHour: 8,   // 8:00 AM
  closeHour: 23, // 11:00 PM (23:00)
  address: "Shop No. E-9, Vande Mataram Homes, Near Chenpur Bus Stand, New Ranip, Ahmedabad - 382480",
};

// Global Calculator State
const calcState = {
  type: "color-standard",
  ratePerPage: 10,
  pages: 5,
  copies: 1,
  lamination: false,
  laminationRate: 20
};

// Global Order Modal State
let currentModalType = "rx";
let uploadedFileName = "";

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initStoreStatus();
  calculatePrintCost();
});

// ==========================================================================
// 1. MOBILE HAMBURGER MENU
// ==========================================================================
function initMobileMenu() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const dropdown = document.getElementById("mobileDropdownMenu");

  if (!menuBtn || !dropdown) return;

  menuBtn.addEventListener("click", () => {
    dropdown.classList.toggle("active");
  });
}

function closeMobileMenu() {
  const dropdown = document.getElementById("mobileDropdownMenu");
  if (dropdown) dropdown.classList.remove("active");
}

// ==========================================================================
// 2. LIVE STORE STATUS (8 AM - 11 PM)
// ==========================================================================
function initStoreStatus() {
  const statusElem = document.getElementById("liveStoreStatus");
  if (!statusElem) return;

  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= STORE_CONFIG.openHour && currentHour < STORE_CONFIG.closeHour) {
    statusElem.innerHTML = `<strong>Open Today:</strong> 8:00 AM – 11:00 PM (Serving Customers Now)`;
  } else {
    statusElem.innerHTML = `<strong>Store Closed:</strong> Opens Tomorrow at 8:00 AM • Order on WhatsApp Anytime`;
  }
}

// ==========================================================================
// 3. PRINT & XEROX COST ESTIMATOR
// ==========================================================================
function updatePageCount(val) {
  calcState.pages = parseInt(val, 10);
  const display = document.getElementById("pageCountDisplay");
  if (display) display.textContent = `${calcState.pages} Page${calcState.pages > 1 ? "s" : ""}`;
  calculatePrintCost();
}

function adjustCopies(delta) {
  calcState.copies = Math.max(1, Math.min(50, calcState.copies + delta));
  const display = document.getElementById("copiesDisplay");
  if (display) display.textContent = calcState.copies;
  calculatePrintCost();
}

function calculatePrintCost() {
  const select = document.getElementById("printTypeSelect");
  if (select) {
    const selectedOpt = select.options[select.selectedIndex];
    calcState.ratePerPage = parseFloat(selectedOpt.dataset.rate) || 10;
  }

  const lamCheck = document.getElementById("laminationCheck");
  calcState.lamination = lamCheck ? lamCheck.checked : false;

  const baseCost = calcState.ratePerPage * calcState.pages * calcState.copies;
  const laminationCost = calcState.lamination ? (calcState.laminationRate * calcState.pages * calcState.copies) : 0;
  const grandTotal = baseCost + laminationCost;

  const amountDisplay = document.getElementById("totalAmountDisplay");
  if (amountDisplay) {
    amountDisplay.textContent = grandTotal;
    amountDisplay.style.transform = "scale(1.15)";
    setTimeout(() => {
      amountDisplay.style.transform = "scale(1)";
    }, 150);
  }
}

function sendCalculatedJobToWhatsApp() {
  const select = document.getElementById("printTypeSelect");
  const jobTitle = select.options[select.selectedIndex].text;
  const total = document.getElementById("totalAmountDisplay").textContent;
  const laminationText = calcState.lamination ? "Yes (Thermal Lamination)" : "No";

  const message = 
`Hello K.K. Medical Store & Print Hub! 👋
I would like to place a *Print / Xerox Order* from your website calculator:

📄 *Print Type*: ${jobTitle}
📑 *Pages*: ${calcState.pages}
🔢 *Copies / Sets*: ${calcState.copies}
🛡️ *Lamination*: ${laminationText}
💰 *Estimated Total*: ₹${total}

I am attaching my file / PDF here in this chat. Please confirm when it's ready for counter pickup at Vande Mataram Homes. Thank you!`;

  const encodedUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, "_blank");
}

// ==========================================================================
// 4. ORDER & PRESCRIPTION MODAL
// ==========================================================================
function openOrderModal(type = "rx") {
  const backdrop = document.getElementById("orderModalBackdrop");
  if (!backdrop) return;

  selectModalType(type);
  backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  const backdrop = document.getElementById("orderModalBackdrop");
  if (!backdrop) return;

  backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

function selectModalType(type) {
  currentModalType = type;
  const chips = document.querySelectorAll(".picker-chip");
  chips.forEach((c) => {
    if (c.dataset.val === type) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });

  const title = document.getElementById("modalTitle");
  const emoji = document.getElementById("modalEmoji");
  const details = document.getElementById("orderDetails");

  if (type === "rx") {
    emoji.textContent = "💊";
    title.textContent = "Send Doctor's Prescription";
    details.placeholder = "Enter medicine names, strength (e.g. 500mg), quantity or write 'Prescription photo attached'";
  } else if (type === "print") {
    emoji.textContent = "🖨️";
    title.textContent = "Send Print / Xerox Documents";
    details.placeholder = "Specify number of copies, colour or B&W, single or double sided, lamination etc.";
  } else if (type === "ayurveda") {
    emoji.textContent = "🌿";
    title.textContent = "Inquire Ayurvedic Products";
    details.placeholder = "e.g. Dabur Chyawanprash 1kg, Himalaya Ashwagandha, Patanjali Giloy";
  } else if (type === "surgical") {
    emoji.textContent = "🩺";
    title.textContent = "Order Surgical & Health Device";
    details.placeholder = "e.g. Omron Blood Pressure Monitor, Pulse Oximeter, Vaporizer, Walking stick";
  } else {
    emoji.textContent = "💬";
    title.textContent = "Quick Order / WhatsApp Counter";
    details.placeholder = "How can we assist you today?";
  }
}

function handleFileSelected(input) {
  if (input.files && input.files[0]) {
    uploadedFileName = input.files[0].name;
    const statusText = document.getElementById("uploadStatusText");
    if (statusText) {
      statusText.innerHTML = `<strong>Selected: ${uploadedFileName}</strong><span>Ready to attach in WhatsApp chat</span>`;
    }
    showToast(`File selected: ${uploadedFileName}`);
  }
}

function submitModalOrderToWhatsApp() {
  const name = document.getElementById("customerName").value.trim() || "Customer";
  const details = document.getElementById("orderDetails").value.trim();
  const deliveryRadios = document.getElementsByName("deliveryPref");
  let deliveryPref = "Counter Pickup (Ready in 5-10 mins)";
  for (const r of deliveryRadios) {
    if (r.checked) deliveryPref = r.value;
  }

  let typeName = "General Inquiry / Order";
  if (currentModalType === "rx") typeName = "💊 Doctor's Prescription / Medicine";
  if (currentModalType === "print") typeName = "🖨️ Print / Xerox / Lamination Document";
  if (currentModalType === "ayurveda") typeName = "🌿 Ayurvedic Health Medicine";
  if (currentModalType === "surgical") typeName = "🩺 Surgical / Health Monitor Device";

  const message = 
`Hello K.K. Medical Store & Multi-Services! 👋
I would like to place an order from your website:

👤 *Customer Name*: ${name}
📋 *Category*: ${typeName}
🚚 *Fulfillment*: ${deliveryPref}
📝 *Details*: ${details ? details : "(Prescription / Document attached)"}
${uploadedFileName ? `📎 *Attachment*: ${uploadedFileName}` : ""}

Please confirm receipt and availability. Thank you!`;

  closeOrderModal();
  const encodedUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, "_blank");
}

// Direct Bestseller WhatsApp Order
function orderBestsellerWhatsApp(productName) {
  const message = 
`Hello K.K. Medical Store! 👋
I would like to order your bestseller product:

🔥 *Product*: ${productName}
🌿 *Specialty*: Ayurvedic Instant Pain Relief
🏃 *Pickup / Delivery*: Counter Pickup at Shop No. E-9, Vande Mataram Homes, New Ranip

Please let me know the price and when I can collect it. Thank you!`;

  const encodedUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, "_blank");
}

// Close modal when clicking on backdrop
document.addEventListener("click", (e) => {
  const backdrop = document.getElementById("orderModalBackdrop");
  if (e.target === backdrop) {
    closeOrderModal();
  }
});

// ==========================================================================
// 5. TOAST NOTIFICATIONS
// ==========================================================================
function showToast(text) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✓</span><span>${text}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease-out";
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}
