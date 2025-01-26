

document.addEventListener("DOMContentLoaded", () => {
      // API'den veri çekme
      fetch('/api/team-rating')
            .then(response => response.json())
            .then(data => {
                  const positions = data.map(item => item.position);
                  const avgRatings = data.map(item => item.avgRating);

                  // Grafik verilerini oluştur
                  const ctx = document.getElementById('teamRatingChart').getContext('2d');
                  new Chart(ctx, {
                        type: 'bar',
                        data: {
                              labels: positions, // Pozisyonlar (Forvet, Orta Saha, Defans, Kaleci)
                              datasets: [{
                                    label: 'Ortalama Reyting',
                                    data: avgRatings, // Ortalama reytingler
                                    backgroundColor: '#FF5722', // Bar rengini ayarlayabilirsiniz
                                    borderColor: '#FF5722',
                                    borderWidth: 1
                              }]
                        },
                        options: {
                              responsive: true,
                              scales: {
                                    y: {
                                          beginAtZero: true
                                    }
                              }
                        }
                  });
            })
            .catch(error => {
                  console.error("Veri çekme hatası:", error);
            });
});







document.addEventListener("DOMContentLoaded", () => {
      // API'den futbolcu verilerini çek
      fetch('/api/players')
            .then(response => response.json())
            .then(players => {
                  // Transfer ihtiyaçlarını hesapla
                  const playersWithNeeds = players.map(player => {
                        const transferNeed = parseFloat(player.average_rating) < 7 ? "Evet" : "Hayır";
                        return {
                              ...player,
                              transferNeed: transferNeed
                        };
                  });

                  // Dashboard'taki tabloyu güncelle
                  updatePlayerTable(playersWithNeeds);
                  // Takım grafiklerini oluştur
                  createTeamRatingChart(playersWithNeeds);
            })
            .catch(error => {
                  console.error("Veri çekme hatası:", error);
            });
});

function updatePlayerTable(players) {
      const tableBody = document.getElementById("playersTable").querySelector("tbody");
      tableBody.innerHTML = ''; // Tablodaki eski verileri temizle

      players.forEach(player => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${player.name}</td>
              <td>${player.position}</td>
              <td>${player.average_rating}</td>
              <td>${player.transferNeed}</td>
          `;
            tableBody.appendChild(row);
      });
}


document.addEventListener("DOMContentLoaded", () => {
      const playerDropdown = document.getElementById("playerDropdown");

      // Verileri API'den çek
      fetch('/api/players')
            .then(response => response.json())
            .then(players => {
                  // İlk başta dropdown'u boş bırak
                  playerDropdown.innerHTML = '<option value="" disabled selected>Oyuncu Seçin</option>';

                  // Oyuncu listesini dropdown'a ekle
                  populateDropdown(players, playerDropdown);

                  // Sayfa yüklendiğinde ilk oyuncuyu seçip göster
                  if (players.length > 0) {
                        playerDropdown.value = players[0].id;  // İlk oyuncuyu seç
                        displayPlayerStats([players[0]]);
                        createPerformanceChart([players[0]]);
                  }

                  playerDropdown.addEventListener("change", (event) => {
                        const selectedPlayerId = event.target.value;
                        const selectedPlayer = players.find(player => player.id === parseInt(selectedPlayerId));

                        if (selectedPlayer) {
                              displayPlayerStats([selectedPlayer]);
                              createPerformanceChart([selectedPlayer]);
                        }
                  });
            })
            .catch(error => {
                  console.error("Veri çekme hatası:", error);
            });
});

function populateDropdown(players, dropdown) {
      players.forEach(player => {
            const option = document.createElement("option");
            option.value = player.id;
            option.textContent = player.name;
            dropdown.appendChild(option);
      });
}

function displayPlayerStats(players) {
      const statsList = document.getElementById("playerStatsList");
      const statsHtml = players.map(player => {
            return `
              <div class="player">
                  <h3>${player.name} - ${player.position}</h3>
                  <ul>
                      <li><strong>Oynanan Maçlar:</strong> ${player.matches_played}</li>
                      <li><strong>Goller:</strong> ${player.goals}</li>
                      <li><strong>Asistler:</strong> ${player.assists}</li>
                      <li><strong>Ortalama Reyting:</strong> ${player.average_rating}</li>
                  </ul>
              </div>
          `;
      }).join('');
      statsList.innerHTML = statsHtml;
}

let chartInstance = null; 

function createPerformanceChart(players) {
      const ctx = document.getElementById('performanceChart');

      if (!ctx) {
            console.error("Grafik için 'performanceChart' canvas bulunamadı.");
            return;
      }

      const player = players[0];
      const dataset = {
            label: player.name,
            data: player.ratings || Array(10).fill(player.average_rating || 0),
            borderColor: getRandomColor(),
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true,
      };

      // Eğer daha önce bir grafik varsa, yok et
      if (chartInstance) {
            chartInstance.destroy();
      }

      try {
            chartInstance = new Chart(ctx.getContext('2d'), {
                  type: 'line',
                  data: {
                        labels: Array.from({ length: 12 }, (_, i) => ` ${i + 1}. Ay`),
                        datasets: [dataset],
                  },
                  options: {
                        responsive: true,
                        plugins: { legend: { display: true } },
                        scales: {
                              x: { title: { display: true, text: 'Maç Sayısı' } },
                              y: { beginAtZero: true, max: 10, title: { display: true, text: 'Reyting' } },
                        },
                  },
            });
      } catch (error) {
            console.error("Grafik oluşturulurken bir hata oluştu:", error);
      }
}

function getRandomColor() {
      return `hsl(${Math.random() * 360}, 100%, 50%)`;
}




document.addEventListener('DOMContentLoaded', function () {
      fetch('/get-kullanici-adi', {
          method: 'GET',
          credentials: 'same-origin' 
      })
          .then(response => {
              if (response.status === 401 && !window.location.href.includes('login')) {
                  window.location.href = '/login';
                  return; 
              }
              return response.json(); 
          })
          .then(data => {
              document.getElementById('welcome-message').textContent = `Hoşgeldiniz, ${data.username}`;
          })
          .catch(error => {
              console.error('Hata:', error);
          });
  });
  



document.addEventListener("DOMContentLoaded", () => {
      // Veriyi API'den çek
      fetch('/api/transfer-suggestions')
            .then(response => response.json())
            .then(transferSuggestions => {
                  // Yaşı 20'den küçük ve en düşük reytinge sahip 2 oyuncuyu seç
                  const filteredPlayers = getPlayersUnder20(transferSuggestions);
                  const sortedPlayers = sortPlayersByRating(filteredPlayers);
                  const selectedPlayers = sortedPlayers.slice(0, 2); // En düşük reytinge sahip iki oyuncuyu seç

                  // Transfer önerilerini tabloya ekle
                  updateTransferSuggestionsTable(selectedPlayers);
            })
            .catch(error => {
                  console.error("Veri çekme hatası:", error);
            });
});

function getPlayersUnder20(players) {
      return players.filter(player => player.age < 20 && parseFloat(player.average_rating) < 7.0);
}

function sortPlayersByRating(players) {
      return players.sort((a, b) => parseFloat(a.average_rating) - parseFloat(b.average_rating));
}

function updateTransferSuggestionsTable(transferSuggestions) {
      const tableBody = document.querySelector("#transfer-suggestions .transfer-table tbody");
      tableBody.innerHTML = ''; // Tablodaki eski verileri temizle

      transferSuggestions.forEach(suggestion => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${suggestion.name}</td>
              <td>${suggestion.average_rating}</td>
              <td>${suggestion.age}</td>
              <td>${suggestion.cost} €</td>
              
          `;
            tableBody.appendChild(row);
      });
}


document.addEventListener("DOMContentLoaded", () => {
      // API'den verileri çek
      fetch('/api/loan-suggestions')
            .then(response => response.json())
            .then(players => {
                  // Yaşı 20'den küçük ve en düşük reytinge sahip 8 oyuncuyu seç
                  const filteredPlayers = getPlayersUnder20(players);
                  const sortedPlayers = sortPlayersByRating(filteredPlayers);
                  const selectedPlayers = sortedPlayers.slice(0, 8); // İlk 8 oyuncuyu seç

                  // Transfer önerilerini kartlar olarak göster
                  updatePlayersCards(selectedPlayers);
            })
            .catch(error => {
                  console.error("Veri çekme hatası:", error);
            });
});

function getPlayersUnder20(players) {
      return players.filter(player => player.age < 20 && parseFloat(player.average_rating) < 7.0);
}

function sortPlayersByRating(players) {
      return players.sort((a, b) => parseFloat(a.average_rating) - parseFloat(b.average_rating));
}

function updatePlayersCards(players) {
      const container = document.querySelector("#players-cards");
      container.innerHTML = ''; // Eski kartları temizle

      players.forEach(player => {
            const card = document.createElement("div");
            card.classList.add("card");



            card.innerHTML = `
              <div class="player-info">
                 
                  <h3 class="player-name">${player.name}</h3>
              </div>
              <p><strong>Reyting:</strong> ${player.average_rating}</p>
              <p><strong>Yaş:</strong> ${player.age}</p>
              <p><strong>Maliyet:</strong> ${player.cost}</p>
          `;
            container.appendChild(card);
      });
}


document.addEventListener("DOMContentLoaded", () => {
      fetch('/api/permanent-suggestions')
            .then(response => response.json())
            .then(transferSuggestions => {
                  const filteredPlayers = getPlayersOver30WithLowRating(transferSuggestions);
                  const sortedPlayers = sortPlayersByAgeDescending(filteredPlayers); 
                  const selectedPlayers = sortedPlayers.slice(0, 8); 

                  updatePermanentSuggestionsCards(selectedPlayers);
            })
            .catch(error => {
                  console.error("Veri çekme hatası:", error);
            });
});

function getPlayersOver30WithLowRating(players) {
      return players.filter(player => player.age > 20 && parseFloat(player.average_rating) < 7.5);
}

function sortPlayersByAgeDescending(players) {
      return players.sort((a, b) => b.age - a.age); 
}

function updatePermanentSuggestionsCards(players) {
      const container = document.querySelector("#permanent-suggestions-cards");
      container.innerHTML = ''; // Eski kartları temizle

      players.forEach(player => {
            const card = document.createElement("div");
            card.classList.add("card");



            card.innerHTML = `
              <div class="player-info">
                 
                  <h3 class="player-name">${player.name}</h3>
              </div>
              <p><strong>Reyting:</strong> ${player.average_rating}</p>
              <p><strong>Yaş:</strong> ${player.age}</p>
              <p><strong>Maliyet:</strong> ${player.cost}</p>
          `;
            container.appendChild(card);
      });
}

