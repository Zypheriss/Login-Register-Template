const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const registerPassword = document.getElementById("registerPassword");
const strengthMeter = document.querySelector(".password-strength");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const strengthRequirements = document.getElementById("strengthRequirements");
loginBtn.addEventListener("click", () => {
  showLogin();
  createRippleEffect(loginBtn);
});

registerBtn.addEventListener("click", () => {
  showRegister();
  createRippleEffect(registerBtn);
});
function showLogin() {
  loginBtn.classList.add("active");
  registerBtn.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
}
function showRegister() {
  registerBtn.classList.add("active");
  loginBtn.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
}
function createRippleEffect(button) {
  const ripple = button.querySelector(".btn-ripple");
  ripple.style.width = "200px";
  ripple.style.height = "200px";

  setTimeout(() => {
    ripple.style.width = "0";
    ripple.style.height = "0";
  }, 600);
}
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon =
    passwordInput.nextElementSibling.nextElementSibling.querySelector(
      ".eye-icon"
    );

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.style.opacity = "1";
    eyeIcon.style.filter =
      "brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(340deg)";
  } else {
    passwordInput.type = "password";
    eyeIcon.style.opacity = "0.7";
    eyeIcon.style.filter = "brightness(0) invert(1)";
  }
}
function showForgotPassword(e) {
  e.preventDefault();
  const modal = document.getElementById("forgotPasswordModal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    const modalContent = modal.querySelector(".modal-content");
    modalContent.style.transform = "translateY(0) scale(1)";
  }, 10);
}
function closeForgotPassword() {
  const modal = document.getElementById("forgotPasswordModal");
  const modalContent = modal.querySelector(".modal-content");

  modalContent.style.transform = "translateY(-80px) scale(0.9)";
  setTimeout(() => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    document.getElementById("resetEmail").value = "";
    clearError(document.getElementById("resetEmail"));
  }, 300);
}
function sendResetEmail() {
  const emailInput = document.getElementById("resetEmail");
  const email = emailInput.value.trim();

  if (!email) {
    showError(emailInput, "Lütfen e-posta adresinizi girin");
    return;
  }

  if (!validateEmail(email)) {
    showError(emailInput, "Lütfen geçerli bir e-posta adresi girin");
    return;
  }
  const submitBtn = document.querySelector("#forgotPasswordModal .submit-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="btn-text">Gönderiliyor...</span>';
  submitBtn.disabled = true;

  setTimeout(() => {
    closeForgotPassword();
    showNotification();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
}
function showNotification() {
  const notification = document.getElementById("notification");
  notification.classList.add("show");
  setTimeout(() => {
    hideNotification();
  }, 4000);
}

function hideNotification() {
  const notification = document.getElementById("notification");
  notification.classList.remove("show");
}
function checkPasswordStrength(password) {
  const requirements = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const metCount = Object.values(requirements).filter(Boolean).length;
  let strength = "weak";
  let strengthText = "Zayıf";

  if (metCount >= 5) {
    strength = "very-strong";
    strengthText = "Çok Güçlü";
  } else if (metCount >= 4) {
    strength = "strong";
    strengthText = "Güçlü";
  } else if (metCount >= 3) {
    strength = "good";
    strengthText = "İyi";
  } else if (metCount >= 2) {
    strength = "fair";
    strengthText = "Orta";
  }

  return { strength, strengthText, requirements };
}

function updatePasswordStrength() {
  const password = registerPassword.value;

  if (password.length === 0) {
    strengthMeter.classList.remove("active");
    return;
  }

  strengthMeter.classList.add("active");

  const {
    strength,
    strengthText: text,
    requirements,
  } = checkPasswordStrength(password);
  strengthFill.className = `strength-fill ${strength}`;
  strengthText.textContent = text;
  strengthText.className = `strength-level ${strength}`;
  updateRequirement("lengthReq", requirements.length);
  updateRequirement("upperReq", requirements.upper);
  updateRequirement("lowerReq", requirements.lower);
  updateRequirement("numberReq", requirements.number);
  updateRequirement("specialReq", requirements.special);
}

function updateRequirement(id, met) {
  const element = document.getElementById(id);
  const icon = element.querySelector(".req-icon");

  if (met) {
    element.classList.add("met");
    icon.textContent = "✓";
  } else {
    element.classList.remove("met");
    icon.textContent = "✗";
  }
}
registerPassword.addEventListener("input", updatePasswordStrength);
registerPassword.addEventListener("focus", () => {
  if (registerPassword.value.length > 0) {
    strengthMeter.classList.add("active");
  }
});
document
  .getElementById("forgotPasswordModal")
  .addEventListener("click", (e) => {
    if (
      e.target.id === "forgotPasswordModal" ||
      e.target.classList.contains("modal-backdrop")
    ) {
      closeForgotPassword();
    }
  });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeForgotPassword();
  }
});
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function showError(input, message) {
  clearError(input);
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  errorElement.style.color = "#ff4444";
  errorElement.style.fontSize = "0.8rem";
  errorElement.style.marginTop = "8px";
  errorElement.style.animation = "errorSlide 0.3s ease";
  input.parentNode.appendChild(errorElement);
  input.style.borderBottomColor = "#ff4444";
  input.style.animation = "inputShake 0.5s ease";
  setTimeout(() => {
    input.style.animation = "";
  }, 500);
}

function clearError(input) {
  const errorElement = input.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }
  input.style.borderBottomColor = "rgba(255, 255, 255, 0.2)";
}

function showSuccess(input) {
  clearError(input);
  input.style.borderBottomColor = "#4ade80";
  input.style.animation = "inputSuccess 0.5s ease";
  setTimeout(() => {
    input.style.animation = "";
  }, 500);
}
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");

  let isValid = true;
  if (!email.value.trim()) {
    showError(email, "E-posta gerekli");
    isValid = false;
  } else if (!validateEmail(email.value)) {
    showError(email, "Lütfen geçerli bir e-posta girin");
    isValid = false;
  } else {
    showSuccess(email);
  }
  if (!password.value.trim()) {
    showError(password, "Şifre gerekli");
    isValid = false;
  } else if (!validatePassword(password.value)) {
    showError(password, "Şifre en az 8 karakter olmalı");
    isValid = false;
  } else {
    showSuccess(password);
  }

  if (isValid) {
    const submitBtn = loginForm.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="btn-text">Karanlık Aleme Giriliyor...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert("Giriş başarılı! Karanlık dünyaya hoş geldiniz.");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      loginForm.reset();
    }, 2000);
  }
});
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("registerName");
  const email = document.getElementById("registerEmail");
  const password = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const agreeTerms = document.getElementById("agreeTerms");
  let isValid = true;
  if (!name.value.trim()) {
    showError(name, "İsim gerekli");
    isValid = false;
  } else if (name.value.trim().length < 2) {
    showError(name, "İsim en az 2 karakter olmalı");
    isValid = false;
  } else {
    showSuccess(name);
  }
  if (!email.value.trim()) {
    showError(email, "E-posta gerekli");
    isValid = false;
  } else if (!validateEmail(email.value)) {
    showError(email, "Lütfen geçerli bir e-posta girin");
    isValid = false;
  } else {
    showSuccess(email);
  }
  if (!password.value.trim()) {
    showError(password, "Şifre gerekli");
    isValid = false;
  } else if (!validatePassword(password.value)) {
    showError(password, "Şifre en az 8 karakter olmalı");
    isValid = false;
  } else {
    showSuccess(password);
  }
  if (!confirmPassword.value.trim()) {
    showError(confirmPassword, "Lütfen şifrenizi tekrar girin");
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "Şifreler eşleşmiyor");
    isValid = false;
  } else {
    showSuccess(confirmPassword);
  }
  if (!agreeTerms.checked) {
    alert("Lütfen Kullanım Şartları'nı kabul edin");
    isValid = false;
  }

  if (isValid) {
    const submitBtn = registerForm.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="btn-text">kedilere Katılıyorsun...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert("Kayıt başarılı! Kediler dünyasına hoşgeldin.");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showLogin();
      registerForm.reset();
      strengthMeter.classList.remove("active");
    }, 2000);
  }
});
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const provider = btn.querySelector("span").textContent;
    const originalContent = btn.innerHTML;
    btn.innerHTML = "<span>Bağlanıyor...</span>";
    btn.disabled = true;

    setTimeout(() => {
      alert(`${provider} amk demo sitesi nereye bağlanıcan`);
      btn.innerHTML = originalContent;
      btn.disabled = false;
    }, 1500);
  });
});
function createParticleExplosion(x, y) {
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.width = "6px";
    particle.style.height = "6px";
    particle.style.background = `hsl(${Math.random() * 60}, 100%, 60%)`;
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "1000";
    particle.style.boxShadow = "0 0 10px currentColor";
    const angle = (i / 12) * Math.PI * 2;
    const velocity = 50 + Math.random() * 50;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    particle.style.animation = `particleExplode 1.2s ease-out forwards`;
    particle.style.setProperty("--vx", vx + "px");
    particle.style.setProperty("--vy", vy + "px");
    document.body.appendChild(particle);
    setTimeout(() => {
      particle.remove();
    }, 1200);
  }
}
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createParticleExplosion(x, y);
  });
});
const style = document.createElement("style");
style.textContent = `
    @keyframes particleExplode {
        0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
        }
        100% {
            opacity: 0;
            transform: scale(0) translate(var(--vx), var(--vy));
        }
    }
    
    @keyframes errorSlide {
        0% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes inputShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes inputSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
document.addEventListener("DOMContentLoaded", () => {
  showLogin();
  setInterval(() => {
    const particles = document.querySelector(".particles");
    particles.style.animationDuration = 20 + Math.random() * 10 + "s";
  }, 5000);
  setInterval(() => {
    const logo = document.querySelector(".logo");
    logo.style.animationDuration = 2 + Math.random() * 2 + "s";
  }, 3000);
});
