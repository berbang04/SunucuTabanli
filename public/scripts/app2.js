const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const kullaniciAdi = document.getElementById("kullaniciAdi").value;
    const sifre = document.getElementById("sifre").value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kullanici_adi: kullaniciAdi, sifre }),
      });

      const result = await response.json();

      if (response.status === 200) {
        window.location.href = "/";
        
      } else {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = result.message;
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Giriş işlemi sırasında bir hata oluştu:", error);
    }
  });
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        window.location.href = "/login.html";
      }
    } catch (error) {
      console.error("Çıkış işlemi sırasında bir hata oluştu:", error);
    }
  });
}
