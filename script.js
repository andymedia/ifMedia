function zobrazAlert() {
    alert('Všetko funguje!');
}

// ---- Nastavenie ----
const POINTS = 45;         // Počet bodov v sieti
const CONNECT_DIST = 140;  // Maximálna vzdialenosť na prepojenie bodov
const SPEED = 0.9;         // Rýchlosť pohybu bodov

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width, height;
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
resize();
window.addEventListener("resize", resize);

// Sieť bodov
let points = [];
for(let i=0;i<POINTS;i++) {
    points.push({
        x: Math.random()*width,
        y: Math.random()*height,
        vx: (Math.random()-0.5)*SPEED,
        vy: (Math.random()-0.5)*SPEED
    });
}

// Pozícia myši pre interaktivitu
let mouse = {x: width/2, y: height/2};
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Animácia meniaceho sa modrého gradientu
let hue = 210;
function drawGradient() {
    hue += 0.3; // plynulá zmena odtieňa
    let grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, `hsl(${(hue)%360}, 60%, 17%)`);
    grad.addColorStop(1, `hsl(${(hue+60)%360}, 50%, 27%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
}

// Hlavná animácia
function animate() {
    drawGradient();

    // Bod interaktívne "priťahovaný" k myši
    points[0].x += (mouse.x - points[0].x)*0.03;
    points[0].y += (mouse.y - points[0].y)*0.03;

    // Pohyb bodov
    for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;
        // Odrážanie od okraja
        if(p.x<0 || p.x>width) p.vx *= -1;
        if(p.y<0 || p.y>height) p.vy *= -1;
    }

    // Kreslenie spojov
    ctx.lineWidth = 1.1;
    for(let i=0;i<POINTS;i++) {
        for(let j=i+1;j<POINTS;j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < CONNECT_DIST) {
                ctx.strokeStyle = `rgba(49,120,198,${1 - dist/CONNECT_DIST})`;
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }
    // Kreslenie bodov
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, 2*Math.PI);
        ctx.fillStyle = "#ffffffaa";
        ctx.fill();
    }
    requestAnimationFrame(animate);
}
animate();
