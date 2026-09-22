document.addEventListener("DOMContentLoaded", () => {
  // 1. CONFIGURACIÓN DEL CONTADOR DE TIEMPO
  // Cambia esta fecha a la fecha real en que comenzó tu relación (Año, Mes - 1, Día, Hora, Minuto)
  // Ejemplo: 21 de Septiembre de 2023 -> new Date(2023, 8, 21, 0, 0, 0)
  const fechaInicio = new Date(2023, 8, 21, 0, 0, 0);

  function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;

    const segundosTotales = Math.floor(diferencia / 1000);
    const dias = Math.floor(segundosTotales / (3600 * 24));
    const horas = Math.floor((segundosTotales % (3600 * 24)) / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = Math.floor(segundosTotales % 60);

    document.getElementById("days").innerText = dias;
    document.getElementById("hours").innerText = String(horas).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutos).padStart(2, "0");
    document.getElementById("seconds").innerText = String(segundos).padStart(2, "0");
  }

  setInterval(actualizarContador, 1000);
  actualizarContador();

  // 2. EFECTO MÁQUINA DE ESCRIBIR PARA LA DEDICATORIA
  const lineasTexto = [
    "Flores Amarillas para el amor de mi vida",
    "",
    "Lamento no poder dartelas en persona,",
    "sin embargo gamas seras espectadora.",
    "",
    "Asi que te doy estas flores amarrilas virtuales ",
    "Te amo tres millones!! <3.",
    "",
    "— ¡I Love You! 💛🦦"
  ];

  const letterContainer = document.getElementById("typewriter-text");
  let lineaIndex = 0;
  let charIndex = 0;

  function escribirTexto() {
    if (lineaIndex < lineasTexto.length) {
      const lineaActual = lineasTexto[lineaIndex];
      
      if (charIndex === 0) {
        const p = document.createElement("p");
        if (lineaActual.startsWith("—")) p.className = "signature";
        p.id = `linea-${lineaIndex}`;
        letterContainer.appendChild(p);
      }

      const pActual = document.getElementById(`linea-${lineaIndex}`);
      pActual.textContent = lineaActual.substring(0, charIndex + 1);

      charIndex++;

      if (charIndex < lineaActual.length) {
        setTimeout(escribirTexto, 45);
      } else {
        charIndex = 0;
        lineaIndex++;
        setTimeout(escribirTexto, 300);
      }
    }
  }

  escribirTexto();

  // 3. CANVAS: DIBUJO DEL ÁRBOL EN FORMA DE CORAZÓN CON FLORES AMARILLAS
  const canvas = document.getElementById("treeCanvas");
  const ctx = canvas.getContext("2d");

  function redimensionarCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight || 450;
  }
  redimensionarCanvas();
  window.addEventListener("resize", redimensionarCanvas);

  const flores = [];
  const petalosCaidos = [];

  // Función para obtener coordenadas dentro de una forma matemática de corazón
  function obtenerPuntoCorazon(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
  }

  // Generar flores dentro de la copa en forma de corazón
  function generarFloresCorazon() {
    flores.length = 0;
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2 - 20;
    const escala = Math.min(canvas.width, canvas.height) / 38;

    for (let i = 0; i < 450; i++) {
      const t = Math.PI * 2 * Math.random();
      const punto = obtenerPuntoCorazon(t);
      
      // Añadir dispersión dentro de la forma del corazón
      const factorRelleno = Math.sqrt(Math.random());
      const x = centroX + punto.x * escala * factorRelleno + (Math.random() - 0.5) * 15;
      const y = centroY + punto.y * escala * factorRelleno + (Math.random() - 0.5) * 15;
      const tamaño = Math.random() * 5 + 4;

      flores.push({ x, y, tamaño, colorCentro: "#5c3317", colorPetalo: "#facc15" });
    }
  }

  // Dibujar tronco
  function dibujarTronco() {
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2 - 20;
    const baseY = canvas.height - 30;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centroX - 12, baseY);
    ctx.quadraticCurveTo(centroX - 8, centroY + 40, centroX - 4, centroY + 20);
    ctx.lineTo(centroX + 4, centroY + 20);
    ctx.quadraticCurveTo(centroX + 8, centroY + 40, centroX + 12, baseY);
    ctx.closePath();
    ctx.fillStyle = "#6b4226";
    ctx.fill();
    ctx.restore();
  }

  // Dibujar una flor individual (girasol)
  function dibujarFlor(f) {
    ctx.save();
    ctx.translate(f.x, f.y);

    // Pétalos amarillos
    ctx.fillStyle = f.colorPetalo;
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(0, f.tamaño, f.tamaño / 2.5, f.tamaño, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Centro marrón de la flor
    ctx.beginPath();
    ctx.arc(0, 0, f.tamaño / 1.8, 0, Math.PI * 2);
    ctx.fillStyle = f.colorCentro;
    ctx.fill();

    ctx.restore();
  }

  // Animación de pétalos cayendo
  function crearPetaloCaido() {
    if (flores.length === 0) return;
    const florOrigen = flores[Math.floor(Math.random() * flores.length)];
    petalosCaidos.push({
      x: florOrigen.x,
      y: florOrigen.y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: Math.random() * 1.5 + 0.8,
      tamaño: Math.random() * 4 + 3,
      rotacion: Math.random() * Math.PI,
      vRotacion: (Math.random() - 0.5) * 0.05
    });
  }

  generarFloresCorazon();

  // Bucle de animación continuo
  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarTronco();

    // Dibujar las flores de la copa
    flores.forEach(f => dibujarFlor(f));

    // Generar nuevos pétalos que van cayendo
    if (Math.random() < 0.3) {
      crearPetaloCaido();
    }

    // Actualizar y dibujar pétalos cayendo
    for (let i = petalosCaidos.length - 1; i >= 0; i--) {
      const p = petalosCaidos[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotacion += p.vRotacion;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotacion);
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.tamaño / 2, p.tamaño, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Eliminar pétalos fuera del canvas
      if (p.y > canvas.height) {
        petalosCaidos.splice(i, 1);
      }
    }

    requestAnimationFrame(animar);
  }

  animar();
});