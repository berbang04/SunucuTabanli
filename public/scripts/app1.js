document.addEventListener("DOMContentLoaded", () => {
      // Veriyi API'den çek
      fetch('/api/players')
          .then(response => response.json())
          .then(players => {
              updateFormation(players); // Verileri formasyona yerleştir
          })
          .catch(error => {
              console.error("Veri çekme hatası:", error);
          });
    });
    
    // Dinamik olarak formasyonu oluştur
    function updateFormation(players) {
      const formationDiv = document.querySelector("#team-formation .formation");
    
      // Pozisyonlar için boş bir yapı oluştur
      const positions = {
          "Forvet": "",
          "Sağ Kanat": "",
          "Merkez Orta Saha": "",
          "Sol Kanat": "",
          "Defansif Orta Saha": "",
          "Box To Box": "",
          "Sağ Bek": "",
          "Sol Stoper": "",
          "Sağ Stoper": "",
          "Sol Bek": "",
          "Kaleci": ""
      };
    
      // Oyuncuları pozisyonlarına yerleştir
      players.forEach(player => {
          if (positions[player.position] === "") {
              positions[player.position] = player.name; // İlk oyuncuyu yerleştir
          }
      });
    
      // HTML'yi oluştur
      formationDiv.innerHTML = `
        <div class="row">
          <div class="position forward"> ${positions["Forvet"] || "Belli Değil"}</div>
        </div>
        <div class="row">
          <div class="position winger"> ${positions["Sağ Kanat"] || "Belli Değil"}</div>
          <div class="position center-mid"> ${positions["Merkez Orta Saha"] || "Belli Değil"}</div>
          <div class="position winger"> ${positions["Sol Kanat"] || "Belli Değil"}</div>
        </div>
        <div class="row">
          <div class="position defensive-mid"> ${positions["Defansif Orta Saha"] || "Belli Değil"}</div>
          <div class="position defensive-mid">${positions["Box To Box"] || "Belli Değil"}</div>
        </div>
        <div class="row">
          <div class="position fullback"> ${positions["Sağ Bek"] || "Belli Değil"}</div>
          <div class="position center-back"> ${positions["Sol Stoper"] || "Belli Değil"}</div>
          <div class="position center-back"> ${positions["Sağ Stoper"] || "Belli Değil"}</div>
          <div class="position fullback">${positions["Sol Bek"] || "Belli Değil"}</div>
        </div>
        <div class="row">
          <div class="position goalkeeper">${positions["Kaleci"] || "Belli Değil"}</div>
        </div>
      `;
    }
