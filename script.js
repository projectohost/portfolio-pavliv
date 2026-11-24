const API_URL = "https://reportsapi-a7tx.onrender.com/portfolio/sendMessage";

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = "form-status " + type;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fields = [...form.querySelectorAll("input, textarea")];
  fields.forEach((f) => f.classList.remove("invalid"));

  const invalid = fields.filter((f) => !f.checkValidity() || !f.value.trim());
  if (invalid.length) {
    invalid.forEach((f) => f.classList.add("invalid"));
    invalid[0].focus();
    setStatus("Будь ласка, заповніть усі поля коректно.", "error");
    return;
  }

  // The API accepts a single "message" parameter, so all details go into one formatted text
  const payload = {
    message:
      "📩 Нове повідомлення з портфоліо\n\n" +
      "👤 Ім'я: " + form.name.value.trim() + "\n" +
      "📞 Номер: " + form.number.value.trim() + "\n\n" +
      "💬 Повідомлення:\n" + form.message.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Надсилання...";
  setStatus("");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);

    form.reset();
    setStatus("Дякую! Повідомлення надіслано.", "success");
  } catch (err) {
    console.error(err);
    setStatus("Не вдалося надіслати. Спробуйте ще раз пізніше.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Надіслати повідомлення";
  }
});