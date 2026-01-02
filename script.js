// --- MOBILE MENU LOGIC ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

// --- 1. VISIBLE BACKGROUND WAVE ANIMATION ---
const waveCanvas = document.getElementById('waveCanvas');
const waveCtx = waveCanvas.getContext('2d');
let waveWidth, waveHeight;
let waveParticles = [];

function initWave() {
    waveWidth = window.innerWidth;
    waveHeight = window.innerHeight;
    waveCanvas.width = waveWidth;
    waveCanvas.height = waveHeight;
    
    waveParticles = [];
    // Increased density (80 cols) for better visibility
    const cols = 80; 
    for(let i = 0; i < cols; i++) {
        waveParticles.push({
            x: (i / cols) * waveWidth,
            y: waveHeight / 1.6, 
            index: i,
            // Increased base size slightly
            size: Math.random() * 2.5 + 1.5 
        });
    }
}

let waveTime = 0;
function animateWave() {
    waveCtx.clearRect(0, 0, waveWidth, waveHeight);
    
    // Draw 3 Distinct, BRIGHT Waves
    // Opacity increased to 0.6 and 0.5 for high visibility
    drawSingleWave(1, 0, 70, 'rgba(124, 58, 237, 0.6)'); // Main Bright Purple
    drawSingleWave(1.5, 2, 50, 'rgba(217, 70, 239, 0.5)'); // Bright Pink
    drawSingleWave(0.8, 4, 30, 'rgba(124, 58, 237, 0.3)'); // Fainter backing wave
    
    waveTime += 0.015;
    requestAnimationFrame(animateWave);
}

function drawSingleWave(freqMult, phaseShift, amp, color) {
    waveCtx.shadowBlur = 10; // Neon Glow Effect
    waveCtx.shadowColor = color;
    waveCtx.fillStyle = color;
    
    for(let i = 0; i < waveParticles.length; i++) {
        let p = waveParticles[i];
        
        // Sine wave logic
        let waveY = Math.sin(p.index * 0.08 * freqMult + waveTime + phaseShift) * amp;
        let currentY = p.y + waveY;

        waveCtx.beginPath();
        waveCtx.arc(p.x, currentY, p.size, 0, Math.PI * 2);
        waveCtx.fill();
    }
    // Reset shadow for performance
    waveCtx.shadowBlur = 0;
}

// --- 2. ROBOT CLUSTER ANIMATION ---
const clusterCanvas = document.getElementById('clusterCanvas');
const clusterCtx = clusterCanvas.getContext('2d');
let cWidth, cHeight;
let sparks = [];

function initCluster() {
    cWidth = clusterCanvas.offsetWidth;
    cHeight = clusterCanvas.offsetHeight;
    clusterCanvas.width = cWidth;
    clusterCanvas.height = cHeight;
}

class Spark {
    constructor() { this.reset(); }
    reset() {
        this.x = (cWidth / 2) + (Math.random() - 0.5) * 60; 
        this.y = cHeight - 20; 
        this.size = Math.random() * 3 + 1;
        this.vy = - (Math.random() * 1.5 + 0.5); 
        this.vx = (Math.random() - 0.5) * 1;
        this.life = 1; 
        this.decay = Math.random() * 0.01 + 0.005;
        this.color = Math.random() > 0.5 ? '#7c3aed' : '#d946ef';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        if(this.life <= 0) this.reset();
    }
    draw() {
        clusterCtx.globalAlpha = this.life;
        clusterCtx.fillStyle = this.color;
        clusterCtx.beginPath();
        clusterCtx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        clusterCtx.fill();
        clusterCtx.globalAlpha = 1;
    }
}

function createSparks() {
    sparks = [];
    for(let i=0; i<60; i++) sparks.push(new Spark());
}

function animateCluster() {
    clusterCtx.clearRect(0, 0, cWidth, cHeight);
    clusterCtx.globalCompositeOperation = 'lighter';
    sparks.forEach(spark => { spark.update(); spark.draw(); });
    requestAnimationFrame(animateCluster);
}

// --- INITIALIZATION ---
window.addEventListener('resize', () => {
    initWave();
    initCluster();
});

initWave();
animateWave();

initCluster();
createSparks();
animateCluster();