// validate-login.js
(function () {
  "use strict";

  // === Config: tùy chỉnh rule tại đây nếu cần ===
  const PASSWORD_MIN_LEN = 8;

  // ===== Helper Regex =====
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // đơn giản, đủ dùng phần lớn case

  // SĐT Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx (9-10 số sau tiền tố)
  const vnPhoneRegex = /^(?:\+?84|0)(?:\d){9,10}$/;

  // ID: 4-32 ký tự, chữ/số/_/-
  const idRegex = /^[A-Za-z0-9_-]{4,32}$/;

  // Password: ít nhất 8 ký tự, có chữ và số
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  // ===== DOM =====
  const form = document.getElementById("loginForm");
  const usernameEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");
  const usernameFeedback = document.getElementById("usernameFeedback");
  const passwordFeedback = document.getElementById("passwordFeedback");
  const toggleBtn = document.getElementById("togglePassword");

  if (!form || !usernameEl || !passwordEl) return;

  // ===== Validate functions =====
  function isEmail(v) {
    return emailRegex.test(v);
  }

  function isVNPhone(v) {
    const val = (v || "").replace(/\s+/g, "");
    return vnPhoneRegex.test(val);
  }

  function isUserId(v) {
    return idRegex.test(v);
  }

  function validateUsername() {
    const val = (usernameEl.value || "").trim();

    if (!val) {
      setInvalid(
        usernameEl,
        usernameFeedback,
        "Vui lòng nhập ID, Email hoặc SĐT."
      );
      return false;
    }

    if (isEmail(val) || isVNPhone(val) || isUserId(val)) {
      setValid(usernameEl, usernameFeedback);
      return true;
    }

    setInvalid(
      usernameEl,
      usernameFeedback,
      "Định dạng không hợp lệ. Ví dụ:\n- Email: ten@domain.com\n- SĐT: 0912345678 hoặc +84912345678\n- ID: 4–32 ký tự chữ/số/[_-]"
    );
    return false;
  }

  function validatePassword() {
    const val = passwordEl.value || "";

    if (!val) {
      setInvalid(passwordEl, passwordFeedback, "Vui lòng nhập mật khẩu.");
      return false;
    }

    if (val.length < PASSWORD_MIN_LEN) {
      setInvalid(
        passwordEl,
        passwordFeedback,
        `Mật khẩu tối thiểu ${PASSWORD_MIN_LEN} ký tự.`
      );
      return false;
    }

    if (!passwordRegex.test(val)) {
      setInvalid(
        passwordEl,
        passwordFeedback,
        "Mật khẩu cần có ít nhất 1 chữ cái và 1 chữ số."
      );
      return false;
    }

    setValid(passwordEl, passwordFeedback);
    return true;
  }

  // ===== UI helpers =====
  function setInvalid(inputEl, feedbackEl, message) {
    inputEl.classList.remove("is-valid");
    inputEl.classList.add("is-invalid");
    if (feedbackEl) {
      feedbackEl.textContent = message;
    } else {
      inputEl.setCustomValidity(message || "Invalid");
    }
  }

  function setValid(inputEl, feedbackEl) {
    inputEl.classList.remove("is-invalid");
    inputEl.classList.add("is-valid");
    if (feedbackEl) feedbackEl.textContent = "";
    inputEl.setCustomValidity("");
  }

  // ===== Live validation =====
  usernameEl.addEventListener("input", validateUsername);
  usernameEl.addEventListener("blur", validateUsername);

  passwordEl.addEventListener("input", validatePassword);
  passwordEl.addEventListener("blur", validatePassword);

  // ===== Toggle hiện/ẩn mật khẩu (icon <i> absolute) =====
  if (toggleBtn && passwordEl) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = passwordEl.getAttribute("type") === "password";
      passwordEl.setAttribute("type", isHidden ? "text" : "password");

      // Đổi icon Bootstrap Icons
      toggleBtn.classList.toggle("bi-eye", !isHidden);
      toggleBtn.classList.toggle("bi-eye-slash", isHidden);
    });
  }

  // ===== Submit handler =====
  form.addEventListener("submit", function (e) {
    const okUser = validateUsername();
    const okPass = validatePassword();
    form.classList.add("was-validated");

    if (!okUser || !okPass) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Hợp lệ -> submit bình thường theo action/method của form
    // Muốn dùng fetch/AJAX:
    // e.preventDefault();
    // fetch('/login', { method: 'POST', body: new FormData(form) })
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    //   .catch(err => console.error(err));
  });
})();
