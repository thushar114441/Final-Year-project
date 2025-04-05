const canvas = document.getElementById("particleCanvas")
const ctx = canvas.getContext("2d")
const particles = []
const particleCount = 1000

let treeShape

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 2 + 1
    this.baseX = x
    this.baseY = y
    this.density = Math.random() * 30 + 1
    this.distance
    this.color = "#00a86b"
    this.opacity = 0
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = `rgba(0, 168, 107, ${this.opacity})`
    ctx.fill()
  }

  update() {
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const forceDirectionX = dx / distance
    const forceDirectionY = dy / distance
    const maxDistance = mouse.radius
    const force = (maxDistance - distance) / maxDistance
    const directionX = forceDirectionX * force * this.density
    const directionY = forceDirectionY * force * this.density

    if (distance < mouse.radius) {
      this.x -= directionX
      this.y -= directionY
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX
        this.x -= dx / 10
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY
        this.y -= dy / 10
      }
    }

    // Fade in effect
    if (this.opacity < 1) {
      this.opacity += 0.02
    }
  }
}

function createTreeShape() {
  const treeWidth = canvas.width * 0.3
  const treeHeight = canvas.height * 0.7
  const trunkWidth = treeWidth * 0.2
  const x = canvas.width / 2
  const y = canvas.height

  ctx.beginPath()
  ctx.moveTo(x - trunkWidth / 2, y)
  ctx.lineTo(x - treeWidth / 2, y - treeHeight * 0.6)
  ctx.lineTo(x, y - treeHeight)
  ctx.lineTo(x + treeWidth / 2, y - treeHeight * 0.6)
  ctx.lineTo(x + trunkWidth / 2, y)
  ctx.closePath()
  ctx.fillStyle = "rgba(0, 168, 107, 0.2)"
  ctx.fill()

  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function init() {
  treeShape = createTreeShape()
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let y = 0, y2 = treeShape.height; y < y2; y++) {
    for (let x = 0, x2 = treeShape.width; x < x2; x++) {
      if (treeShape.data[y * 4 * treeShape.width + x * 4 + 3] > 128) {
        const posX = x + (Math.random() * 20 - 10)
        const posY = y + (Math.random() * 20 - 10)
        particles.push(new Particle(posX, posY))
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw()
    particles[i].update()
  }
  requestAnimationFrame(animate)
}

const mouse = {
  x: null,
  y: null,
  radius: 100,
}

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x
  mouse.y = event.y
})

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  init()
})

init()
animate()

// Show the CTA button after animation
setTimeout(() => {
  const cta = document.getElementById("cta")
  cta.classList.remove("hidden")
  cta.style.animation = "fadeInUp 0.8s ease forwards"
}, 3000)

