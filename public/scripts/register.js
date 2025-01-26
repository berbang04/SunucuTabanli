document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      try {
          const response = await fetch('/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),
          });
  
          const result = await response.json();
          if (response.ok) {
              alert(result.message); // Başarılı mesaj
          } else {
              alert(result.error); // Hata mesajı
          }
      } catch (error) {
          console.error('An error occurred:', error);
          alert('An error occurred. Please try again later.');
      }
  });
  