const map = L.map('map').setView([-38, -63], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

fetch('/assets/data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(s => {
      const incremento = s.promedio_incremento_pct;
      let color = 'blue';
      if (incremento > 20) color = 'red';
      else if (incremento > 10) color = 'orange';
      else if (incremento > 5) color = 'yellow';
      else if (incremento >= 0) color = 'green';

      // Crea un marcador con un popup detallado
      L.circle([s.sucursales_latitud, s.sucursales_longitud], {
        color,
        fillColor: color,
        fillOpacity: 1,
        radius: 50
      }).addTo(map)
        .bindPopup(`
          <strong>Comercio:</strong> ${s.comercio_razon_social} <br>
          <strong>Sucursal:</strong> ${s.sucursales_nombre} <br>
          <strong>Localidad:</strong> ${s.sucursales_localidad} <br>
          <strong>Incremento mayor a precios minimos encontrados:</strong> ${s.promedio_incremento_pct>100?"+100":s.promedio_incremento_pct}% <br>
        `);
    });
  });
  
  const audio = document.getElementById('mileiAudio');
  const btn = document.getElementById('muteBtn');
  const updateDate = document.getElementById('updateDate');
  
  updateDate.textContent = new Date().toLocaleDateString();
  
  function toggleAudio() {
      audio.muted = !audio.muted;
      btn.textContent = audio.muted ? '🔇' : '🔊';
      audio.play();
  }
  
  window.addEventListener('DOMContentLoaded', () => {
      audio.play().catch(e => console.log("Autoplay bloqueado", e));
  });
  