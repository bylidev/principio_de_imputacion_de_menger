const map = L.map('map').setView([-38, -63], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  Promise.all([
    fetch('/assets/data.json').then(res => res.json()), 
    fetch('/assets/dataMin1d.json').then(res => res.json())
    .then(data => {
      const mapa = data.reduce((acc, s) => {
        const key = s.sucursales_latitud + s.sucursales_longitud;
        acc[key] = s.incremento_pct;
        return acc;
      }, {});
      return mapa;
    })
  ])  
  .then(([data, dataMin1])  => {
    data.forEach(s => {
      const incremento = s.incremento_pct;
      let color = 'blue';
      if (incremento > 100) color = 'gray';
      else if (incremento > 30) color = 'red';
      else if (incremento > 11) color = 'orange';
      else if (incremento >= 0) color = 'green';
      let varMin1 = dataMin1[s.sucursales_latitud + s.sucursales_longitud];
      let pvarMin1 = (incremento - varMin1).toFixed(2);
      L.circle([s.sucursales_latitud, s.sucursales_longitud], {
        color,
        fillColor: color,
        fillOpacity: 1,
        radius: 50
      }).addTo(map)
        .bindPopup(`
          <strong>${s.sucursales_tipo} ${s.sucursales_nombre}</strong><br>
          <strong>Razon social:</strong> ${s.comercio_razon_social} <br>
          <strong>Los precios promedio se desvian ${s.incremento_pct>100?"N/A":s.incremento_pct}% de los mejores precios del mercado.</strong><br>
          <strong>Variación respecto a ayer: </strong><span style="color:${pvarMin1<0?'red':'green'}">${pvarMin1}% ${pvarMin1 < 0 ? '📉' : '📈'}</span><br>
        `);
    });
  });

  const audio = document.getElementById('mileiAudio');
  const btn = document.getElementById('muteBtn');
  const updateDate = document.getElementById('updateDate');
  
  updateDate.textContent = "23/04/2025";
  
  function toggleAudio() {
      audio.muted = !audio.muted;
      btn.textContent = audio.muted ? '🔇' : '🔊';
      audio.play();
  }
  
  window.addEventListener('DOMContentLoaded', () => {
      audio.play().catch(e => console.log("Autoplay bloqueado", e));
  });
  