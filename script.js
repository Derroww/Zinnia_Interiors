/**
 * Zinnia Interiors — Consolidated Global Driver
 * Features: Multi-Page Navigation Tracking, Global Auth Modals,
 * Reusable Card Previews, Top-Center Toast Alerts, and Unified Cart Engine.
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initContactForm();
  initGlobalAuthentication();
  initPortfolioModals(); // Runs safely on projects.html
  initGlobalModalsAndQuickView(); // Runs safely on shop.html
  initECommerceCartSystem(); // Runs safely on shop.html
});

/**
 * ==========================================================================
 * 1. FIXED TOP-CENTER TOAST NOTIFICATION ENGINE
 * ==========================================================================
 */
function showNotification(message, type = "info") {
  const existingNotification = document.getElementById("zinniaNotification");
  if (existingNotification) existingNotification.remove();

  const banner = document.createElement("div");
  banner.id = "zinniaNotification";
  banner.className = "zinnia-top-toast";

  if (type === "success") {
    banner.style.background = "var(--blueprint, #14304d)";
    banner.style.color = "var(--paper, #f3eee1)";
    banner.style.borderBottom = "3px solid var(--cyanline, #8fb8d9)";
  } else if (type === "alert") {
    banner.style.background = "var(--redline, #b8431b)";
    banner.style.color = "var(--paper, #f3eee1)";
    banner.style.borderBottom = "3px solid var(--paper, #f3eee1)";
  } else {
    banner.style.background = "var(--paper-dim, #e9e1cd)";
    banner.style.color = "var(--ink, #1c1b17)";
    banner.style.borderBottom = "3px solid var(--brass, #a9863f)";
  }

  banner.textContent = message;
  document.body.appendChild(banner);

  setTimeout(() => {
    banner.classList.add("show");
  }, 50);

  setTimeout(() => {
    banner.classList.remove("show");
    setTimeout(() => banner.remove(), 300);
  }, 3500);
}

/**
 * ==========================================================================
 * 2. GLOBAL AUTHENTICATION MACHINE (MODAL POPUP AUTOMATION)
 * ==========================================================================
 */
function initGlobalAuthentication() {
  const AUTH_SESSION_KEY = "zinnia_user_session";
  const REGISTERED_USER_KEY = "zinnia_user_registry";

  const navInner = document.querySelector(".nav__inner");
  if (!navInner) return;

  let authZoneWrapper = document.getElementById("navAuthZone");
  if (!authZoneWrapper) {
    authZoneWrapper = document.createElement("div");
    authZoneWrapper.id = "navAuthZone";
    authZoneWrapper.className = "nav__auth-zone";
    authZoneWrapper.style.display = "flex";
    authZoneWrapper.style.alignItems = "center";
    authZoneWrapper.style.gap = "16px";

    const toggleCheckbox = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    navInner.insertBefore(authZoneWrapper, toggleCheckbox || navLinks);
  }

  let authOverlay = document.getElementById("authModal");
  if (!authOverlay) {
    authOverlay = document.createElement("div");
    authOverlay.id = "authModal";
    authOverlay.className = "modal-overlay";
    authOverlay.style.display = "none";
    authOverlay.innerHTML = `
      <div class="auth-modal-card">
        <button id="closeAuthBtn" class="auth-modal-close">&times;</button>
        <div id="loginView">
          <h3 style="font-family: var(--font-display); font-size: 1.6rem; margin-bottom: 8px;">Log In</h3>
          <p style="font-size:0.88rem; color:var(--ink-soft); margin-bottom:24px;">Access your studio briefs.</p>
          <form id="loginForm">
            <div class="form__group" style="margin-bottom:16px;">
              <label>Email Address</label>
              <input type="email" id="loginEmail" required placeholder="name@domain.com" />
            </div>
            <div class="form__group" style="margin-bottom:24px;">
              <label>Password</label>
              <input type="password" id="loginPassword" required placeholder="••••••••" />
            </div>
            <button type="submit" class="btn btn--fill" style="width:100%;">Enter Studio</button>
          </form>
          <p style="font-size:0.85rem; margin-top:20px; text-align:center; color:var(--ink-soft);">
            New to Zinnia? <a href="#" id="switchToSignUp" style="color:var(--redline); font-weight:500;">Create an account</a>
          </p>
        </div>
        <div id="signUpView" style="display: none;">
          <h3 style="font-family: var(--font-display); font-size: 1.6rem; margin-bottom: 8px;">Create Account</h3>
          <p style="font-size:0.88rem; color:var(--ink-soft); margin-bottom:24px;">Register to compile your personalized tracked metrics.</p>
          <form id="signUpForm">
            <div class="form__group" style="margin-bottom:16px;">
              <label>Full Name</label>
              <input type="text" id="signUpName" required placeholder="Wanjiku Kamau" />
            </div>
            <div class="form__group" style="margin-bottom:16px;">
              <label>Email Address</label>
              <input type="email" id="signUpEmail" required placeholder="name@domain.com" />
            </div>
            <div class="form__group" style="margin-bottom:24px;">
              <label>Password</label>
              <input type="password" id="signUpPassword" required placeholder="Minimum 8 characters" />
            </div>
            <button type="submit" class="btn btn--fill" style="width:100%;">Register Profile</button>
          </form>
          <p style="font-size:0.85rem; margin-top:20px; text-align:center; color:var(--ink-soft);">
            Already registered? <a href="#" id="switchToLogin" style="color:var(--redline); font-weight:500;">Log in instead</a>
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(authOverlay);
  }

  const loginView = document.getElementById("loginView");
  const signUpView = document.getElementById("signUpView");
  const toSignUpLink = document.getElementById("switchToSignUp");
  const toLoginLink = document.getElementById("switchToLogin");
  const closeAuthBtn = document.getElementById("closeAuthBtn");

  function getActiveUser() {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
  }

  function renderAuthHeaderUI() {
    const user = getActiveUser();
    authZoneWrapper.innerHTML = "";

    const triggerBtn = document.createElement("button");
    triggerBtn.className = "btn";
    triggerBtn.style.padding = "8px 16px";
    triggerBtn.style.fontSize = "0.72rem";
    triggerBtn.style.background = "none";
    triggerBtn.style.cursor = "pointer";

    if (user) {
      triggerBtn.textContent = `Log Out (${user.name.split(" ")[0]})`;
      triggerBtn.style.color = "var(--redline, #b8431b)";
      triggerBtn.style.borderColor = "var(--redline, #b8431b)";
      triggerBtn.addEventListener("click", () => {
        localStorage.removeItem(AUTH_SESSION_KEY);
        renderAuthHeaderUI();
        showNotification("Securely Logged Out.", "info");
      });
    } else {
      triggerBtn.textContent = "Log In";
      triggerBtn.style.color = "var(--ink, #1c1b17)";
      triggerBtn.style.borderColor = "var(--ink, #1c1b17)";
      triggerBtn.addEventListener("click", () => {
        loginView.style.display = "block";
        signUpView.style.display = "none";
        authOverlay.style.display = "flex";
      });
    }
    authZoneWrapper.appendChild(triggerBtn);
  }

  if (toSignUpLink)
    toSignUpLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginView.style.display = "none";
      signUpView.style.display = "block";
    });
  if (toLoginLink)
    toLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      signUpView.style.display = "none";
      loginView.style.display = "block";
    });
  if (closeAuthBtn)
    closeAuthBtn.addEventListener(
      "click",
      () => (authOverlay.style.display = "none"),
    );

  const signUpForm = document.getElementById("signUpForm");
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newUser = {
        name: document.getElementById("signUpName").value,
        email: document
          .getElementById("signUpEmail")
          .value.toLowerCase()
          .trim(),
        password: document.getElementById("signUpPassword").value,
      };
      localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ name: newUser.name, email: newUser.email }),
      );
      authOverlay.style.display = "none";
      renderAuthHeaderUI();
      showNotification(`Welcome, ${newUser.name}.`, "success");
      signUpForm.reset();
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document
        .getElementById("loginEmail")
        .value.toLowerCase()
        .trim();
      const passwordInput = document.getElementById("loginPassword").value;
      const registry = JSON.parse(localStorage.getItem(REGISTERED_USER_KEY));

      if (
        registry &&
        registry.email === emailInput &&
        registry.password === passwordInput
      ) {
        localStorage.setItem(
          AUTH_SESSION_KEY,
          JSON.stringify({ name: registry.name, email: registry.email }),
        );
        authOverlay.style.display = "none";
        renderAuthHeaderUI();
        showNotification(`Welcome Back, ${registry.name}.`, "success");
        loginForm.reset();
      } else {
        showNotification("Invalid user credentials.", "alert");
      }
    });
  }

  renderAuthHeaderUI();
}

/**
 * ==========================================================================
 * 3. REUSABLE DETAILED GLOBAL PREVIEW MODALS (FOR SHOP.HTML)
 * ==========================================================================
 */
function initGlobalModalsAndQuickView() {
  const modal = document.getElementById("projectModal");
  const closeBtn = document.querySelector(".modal__close");
  if (!modal || !closeBtn) return;

  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");

  const detailedRepository = {
    sh1: {
      title: "The Kilimani Low-Slung Sofa",
      desc: "Premium solid ash chassis housing multi-density seating wrapped in organic Belgian linen.",
      src: "./Images/custom-sofa.jpg",
    },
    sh2: {
      title: "Linear Brass Pendant",
      desc: "Precision task chandelier machined from solid raw brass tubing with custom chemical anti-tarnish coatings.",
      src: "./Images/pendant-light.jpg",
    },
    sh3: {
      title: "Delicate Texture Tile",
      desc: "Premium natural travertine stone pieces featuring hand-routed linear channels.",
      src: "./Images/texture-tile.jpg",
    },
  };

  document.querySelectorAll(".product-card__quick-view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentCard = e.target.closest(".product-card");
      if (parentCard) {
        const id = parentCard.getAttribute("data-id");
        const data = detailedRepository[id];
        if (data && modalImg && modalTitle && modalDesc) {
          modalImg.src = data.src;
          modalImg.alt = data.title;
          modalTitle.textContent = data.title;
          modalDesc.textContent = data.desc;
          modal.classList.add("is-active");
          document.body.style.overflow = "hidden";
        }
      }
    });
  });
}

/**
 * ==========================================================================
 * SCOPED PORTFOLIO PROJECT MODALS (SPECIFIC TO PROJECTS.HTML)
 * ==========================================================================
 */
function initPortfolioModals() {
  const showroom = document.getElementById("portfolio-showroom");
  const modal = document.getElementById("projectModal");
  if (!showroom || !modal) return;

  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");

  const portfolioRepository = {
    hurlingham: {
      title: "Hurlingham Loft Renovation",
      desc: "A gut renovation of a pre-war loft, rebuilt around one long window.",
      src: "./Images/loft.jpg",
    },
    embakasi: {
      title: "Embakasi Farmhouse",
      desc: "Whole-house design layout engineered to maintain high aesthetic durability.",
      src: "./Images/farmhouse.jpg",
    },
    lavington: {
      title: "Lavington Pied-à-terre",
      desc: "A precision spatial layout focusing on custom loose-furniture layouts.",
      src: "./Images/Tribeca Pied-à-terre.jpg",
    },
  };

  const projectCards = showroom.querySelectorAll(".project");

  projectCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-project");
      const data = portfolioRepository[id];

      if (data && modalImg && modalTitle && modalDesc) {
        modalImg.src = data.src;
        modalImg.alt = data.title;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modal.classList.add("is-active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeBtn = modal.querySelector(".modal__close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("is-active");
      document.body.style.overflow = "";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("is-active");
      document.body.style.overflow = "";
    }
  });
}

/**
 * ==========================================================================
 * DYNAMIC HAVENLY CART OPERATIONAL MATRIX (FOR SHOP.HTML)
 * ==========================================================================
 */
function initECommerceCartSystem() {
  const CART_STORAGE_KEY = "zinnia_showroom_cart";

  // CRITICAL INDEPENDENT SAFETY GUARD: Exit immediately if the cart element is missing from the page
  const countBadge = document.getElementById("cartCount");
  if (!countBadge) return;

  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

  const cartDrawer = document.getElementById("cartDrawer");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotalText = document.getElementById("cartSubtotal");
  const cartTotalText = document.getElementById("cartTotal");
  const checkoutActionBtn = document.getElementById("checkoutActionBtn");

  function updateCartCounter() {
    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countBadge) {
      countBadge.textContent = totalItemsCount;
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  function updateCartUI() {
    updateCartCounter();
    if (!cartItemsList) return;

    cartItemsList.innerHTML = "";
    let calculatedSubtotal = 0;

    cart.forEach((item, index) => {
      calculatedSubtotal += item.price * item.quantity;
      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML = `
        <div> 
          <h4 style="margin:0 0 4px; font-size:0.95rem;">${item.title}</h4> 
          <p style="margin:0; font-size:0.8rem; color:var(--redline); font-family:var(--font-mono);">KES ${(item.price * item.quantity).toLocaleString()}</p> 
        </div> 
        <div class="cart-item-controls"> 
          <button class="decrease-qty" data-index="${index}">-</button> 
          <span style="margin: 0 8px; font-family:var(--font-mono); font-size:0.9rem;">${item.quantity}</span> 
          <button class="increase-qty" data-index="${index}">+</button> 
        </div>
      `;
      cartItemsList.appendChild(row);
    });

    if (cartSubtotalText)
      cartSubtotalText.textContent = `KES ${calculatedSubtotal.toLocaleString()}`;
    if (cartTotalText)
      cartTotalText.textContent = `KES ${calculatedSubtotal.toLocaleString()}`;

    document
      .querySelectorAll(".decrease-qty")
      .forEach((btn) =>
        btn.addEventListener("click", (e) =>
          adjustQuantity(parseInt(e.target.dataset.index), -1),
        ),
      );
    document
      .querySelectorAll(".increase-qty")
      .forEach((btn) =>
        btn.addEventListener("click", (e) =>
          adjustQuantity(parseInt(e.target.dataset.index), 1),
        ),
      );
  }

  function adjustQuantity(index, shift) {
    cart[index].quantity += shift;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
  }

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".project");
      const id = card.dataset.id;
      const price = parseInt(card.dataset.price);
      const title = card.dataset.title;
      const existingItem = cart.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id, title, price, quantity: 1 });
      }
      updateCartUI();
      showNotification(`Added to Cart: ${title}`, "success");
    });
  });

  if (openCartBtn && cartDrawer) {
    openCartBtn.addEventListener("click", () => {
      updateCartUI();
      cartDrawer.style.display = "flex";
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartDrawer.style.display = "none";
    });
  }

  if (checkoutActionBtn) {
    checkoutActionBtn.addEventListener("click", () => {
      if (cart.length === 0)
        return showNotification("Your cart is empty.", "alert");
      const activeSession = localStorage.getItem("zinnia_user_session");
      if (!activeSession)
        return showNotification("Please log in before checking out.", "alert");

      checkoutActionBtn.disabled = true;
      checkoutActionBtn.textContent = "Transmitting Specifications...";

      setTimeout(() => {
        showNotification(
          "Confirmed Purchase! Project specification ledger submitted successfully.",
          "success",
        );
        cart = [];
        updateCartUI();
        if (cartDrawer) cartDrawer.style.display = "none";
        checkoutActionBtn.disabled = false;
        checkoutActionBtn.textContent = "Checkout";
      }, 1500);
    });
  }

  updateCartCounter();
}

/**
 * ==========================================================================
 * CORE NAVIGATION COUPLING HANDLERS
 * ==========================================================================
 */
function initNavigation() {
  const checkbox = document.getElementById("navToggle");
  const navLinks = document.querySelectorAll(".nav__links a");
  if (!checkbox) return;

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) link.classList.add("active");
    else link.classList.remove("active");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820 && checkbox.checked) checkbox.checked = false;
  });
}

function initContactForm() {
  const form = document.querySelector(".contact__form");
  if (!form) return;

  const nameField = document.getElementById("clientName");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification(
      `Contact brief persistent summary compiled for ${nameField.value}.`,
      "success",
    );
    form.reset();
  });
}
