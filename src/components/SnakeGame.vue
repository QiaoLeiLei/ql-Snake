<template>
  <div class="relative w-full h-full">
    <canvas 
      ref="gameCanvas" 
      class="w-full h-full block"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    ></canvas>
    
    <!-- Game Over Overlay -->
    <div 
      v-if="gameState === 'gameover'"
      class="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30"
    >
      <h2 class="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-6 text-center leading-normal tracking-widest drop-shadow-md">
        任务<br>失败
      </h2>
      <div class="text-sm text-neon-cyan mb-8">最终得分: {{ score }}</div>
      <button 
        @click="restartGame"
        class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm md:text-base rounded border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)]"
      >
        重新开始
      </button>
    </div>

    <!-- Start Screen Overlay -->
    <div 
      v-if="gameState === 'start'"
      class="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-30"
    >
      <div class="text-neon-cyan text-4xl mb-4 animate-bounce">
        <i class="fas fa-gamepad"></i>
      </div>
      <button 
        @click="startGame"
        class="px-8 py-4 bg-neon-cyan text-black font-bold text-sm md:text-base rounded border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,243,255,0.5)]"
      >
        开始任务
      </button>
    </div>

    <!-- Mobile Controls -->
    <div v-if="isMobile" class="md:hidden grid grid-cols-3 gap-2 w-48 absolute -bottom-24 left-1/2 transform -translate-x-1/2">
      <div></div>
      <button 
        @touchstart.prevent="handleMobileControl('up')"
        class="d-pad-btn h-14 rounded-lg flex items-center justify-center text-xl"
      >
        <i class="fas fa-caret-up"></i>
      </button>
      <div></div>
      <button 
        @touchstart.prevent="handleMobileControl('left')"
        class="d-pad-btn h-14 rounded-lg flex items-center justify-center text-xl"
      >
        <i class="fas fa-caret-left"></i>
      </button>
      <button 
        @touchstart.prevent="handleMobileControl('down')"
        class="d-pad-btn h-14 rounded-lg flex items-center justify-center text-xl"
      >
        <i class="fas fa-caret-down"></i>
      </button>
      <button 
        @touchstart.prevent="handleMobileControl('right')"
        class="d-pad-btn h-14 rounded-lg flex items-center justify-center text-xl"
      >
        <i class="fas fa-caret-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Props
interface Props {
  score: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:score': [value: number]
}>()

// Types
interface Position {
  x: number
  y: number
}

interface Velocity {
  x: number
  y: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

type GameState = 'start' | 'playing' | 'gameover'

// Constants
const GRID_SIZE = 30
const TILE_COUNT = 20

const COLORS = {
  bg: '#050011',
  grid: '#1a0b2e',
  snake: ['#003366', '#0055aa', '#0088cc', '#00bbff', '#ffff00'],
  food: '#ffffff',
  foodCore: '#00f3ff'
}

// Reactive state
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const gameState = ref<GameState>('start')
const snake = ref<Position[]>([])
const food = ref<Position>({ x: 0, y: 0 })
const velocity = ref<Velocity>({ x: 0, y: 0 })
const nextVelocity = ref<Velocity>({ x: 0, y: 0 })
const score = ref<number>(0)
const particles = ref<Particle[]>([])
const speed = ref<number>(150)
const gameLoopId = ref<number | null>(null)
const lastTime = ref<number>(0)
const touchStartX = ref<number>(0)
const touchStartY = ref<number>(0)
const isMobile = ref<boolean>(false)

// Methods
const init = () => {
  if (!gameCanvas.value) return
  
  ctx.value = gameCanvas.value.getContext('2d')
  if (!ctx.value) return
  
  // Set canvas internal resolution
  gameCanvas.value.width = GRID_SIZE * TILE_COUNT
  gameCanvas.value.height = GRID_SIZE * TILE_COUNT
  
  // Event listeners
  document.addEventListener('keydown', handleKeyInput)
  
  // Check mobile
  isMobile.value = 'ontouchstart' in window
  
  // Initial render
  draw()
}

const startGame = () => {
  gameState.value = 'playing'
  resetGame()
}

const resetGame = () => {
  snake.value = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]
  velocity.value = { x: 0, y: -1 }
  nextVelocity.value = { x: 0, y: -1 }
  score.value = 0
  speed.value = 150
  particles.value = []
  emit('update:score', 0)
  placeFood()
  
  if (gameLoopId.value) {
    cancelAnimationFrame(gameLoopId.value)
  }
  lastTime.value = performance.now()
  gameLoop()
}

const gameLoop = (currentTime?: number) => {
  if (gameState.value !== 'playing') return

  gameLoopId.value = requestAnimationFrame(gameLoop)

  if (currentTime) {
    const deltaTime = currentTime - lastTime.value

    if (deltaTime >= speed.value) {
      update()
      lastTime.value = currentTime
    }
  }
  
  draw()
}

const update = () => {
  // Apply buffered velocity
  velocity.value = { ...nextVelocity.value }

  const head = { 
    x: snake.value[0].x + velocity.value.x, 
    y: snake.value[0].y + velocity.value.y 
  }

  // Wall collision
  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    gameOver()
    return
  }

  // Self collision
  for (let part of snake.value) {
    if (head.x === part.x && head.y === part.y) {
      gameOver()
      return
    }
  }

  snake.value.unshift(head)

  // Food collision
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value++
    emit('update:score', score.value)
    createExplosion(head.x * GRID_SIZE + GRID_SIZE/2, head.y * GRID_SIZE + GRID_SIZE/2)
    placeFood()
    
    // Speed increase
    if (speed.value > 80) speed.value -= 2
  } else {
    snake.value.pop()
  }
}

const draw = () => {
  if (!ctx.value || !gameCanvas.value) return
  
  // Clear background
  ctx.value.fillStyle = COLORS.bg
  ctx.value.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)

  // Draw grid
  ctx.value.strokeStyle = COLORS.grid
  ctx.value.lineWidth = 1
  ctx.value.beginPath()
  for (let x = 0; x <= gameCanvas.value.width; x += GRID_SIZE) {
    ctx.value.moveTo(x, 0)
    ctx.value.lineTo(x, gameCanvas.value.height)
  }
  for (let y = 0; y <= gameCanvas.value.height; y += GRID_SIZE) {
    ctx.value.moveTo(0, y)
    ctx.value.lineTo(gameCanvas.value.width, y)
  }
  ctx.value.stroke()

  // Draw food
  drawFood()

  // Draw snake
  drawSnake()

  // Draw particles
  updateAndDrawParticles()
}

const drawSnake = () => {
  if (!ctx.value) return
  
  snake.value.forEach((part, index) => {
    const x = part.x * GRID_SIZE
    const y = part.y * GRID_SIZE
    
    const colorIndex = (index + Math.floor(score.value / 5)) % COLORS.snake.length
    const baseColor = COLORS.snake[colorIndex]

    ctx.value.fillStyle = baseColor
    ctx.value.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2)

    // Halftone pattern
    ctx.value.fillStyle = 'rgba(255,255,255,0.2)'
    const dotSize = 2
    const gap = 6
    for(let i = 2; i < GRID_SIZE; i+=gap) {
      for(let j = 2; j < GRID_SIZE; j+=gap) {
        ctx.value.fillRect(x + i, y + j, dotSize, dotSize)
      }
    }

    // Eyes on head
    if (index === 0) {
      ctx.value.fillStyle = '#fff'
      ctx.value.fillRect(x + 8, y + 8, 4, 4)
      ctx.value.fillRect(x + 18, y + 8, 4, 4)
    }
  })
}

const drawFood = () => {
  if (!ctx.value) return
  
  const x = food.value.x * GRID_SIZE + GRID_SIZE / 2
  const y = food.value.y * GRID_SIZE + GRID_SIZE / 2
  const size = GRID_SIZE / 2

  const flicker = Math.random() > 0.8 ? 1 : 0.8
  
  ctx.value.save()
  ctx.value.translate(x, y)
  ctx.value.rotate(Date.now() / 200)
  ctx.value.scale(flicker, flicker)

  // Draw star
  ctx.value.beginPath()
  ctx.value.fillStyle = COLORS.food
  for (let i = 0; i < 5; i++) {
    ctx.value.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * size,
                       -Math.sin((18 + i * 72) * Math.PI / 180) * size)
    ctx.value.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (size / 2),
                       -Math.sin((54 + i * 72) * Math.PI / 180) * (size / 2))
  }
  ctx.value.closePath()
  ctx.value.fill()

  // Inner core
  ctx.value.beginPath()
  ctx.value.fillStyle = COLORS.foodCore
  ctx.value.arc(0, 0, size / 3, 0, Math.PI * 2)
  ctx.value.fill()

  ctx.value.restore()
}

const createExplosion = (x: number, y: number) => {
  for (let i = 0; i < 12; i++) {
    particles.value.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1.0,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`
    })
  }
}

const updateAndDrawParticles = () => {
  if (!ctx.value) return
  
  for (let i = particles.value.length - 1; i >= 0; i--) {
    let p = particles.value[i]
    p.x += p.vx
    p.y += p.vy
    p.life -= 0.05

    if (p.life <= 0) {
      particles.value.splice(i, 1)
    } else {
      ctx.value.globalAlpha = p.life
      ctx.value.fillStyle = p.color
      ctx.value.fillRect(p.x, p.y, 4, 4)
      ctx.value.globalAlpha = 1.0
    }
  }
}

const placeFood = () => {
  let valid = false
  while (!valid) {
    food.value.x = Math.floor(Math.random() * TILE_COUNT)
    food.value.y = Math.floor(Math.random() * TILE_COUNT)
    
    valid = true
    for (let part of snake.value) {
      if (part.x === food.value.x && part.y === food.value.y) {
        valid = false
        break
      }
    }
  }
}

const gameOver = () => {
  gameState.value = 'gameover'
}

const handleKeyInput = (e: KeyboardEvent) => {
  if (gameState.value !== 'playing') return

  switch(e.key) {
    case 'ArrowUp':
      if (velocity.value.y === 0) nextVelocity.value = { x: 0, y: -1 }
      break
    case 'ArrowDown':
      if (velocity.value.y === 0) nextVelocity.value = { x: 0, y: 1 }
      break
    case 'ArrowLeft':
      if (velocity.value.x === 0) nextVelocity.value = { x: -1, y: 0 }
      break
    case 'ArrowRight':
      if (velocity.value.x === 0) nextVelocity.value = { x: 1, y: 0 }
      break
  }
}

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
  touchStartY.value = e.changedTouches[0].screenY
}

const handleTouchEnd = (e: TouchEvent) => {
  if (gameState.value !== 'playing') return
  
  const touchEndX = e.changedTouches[0].screenX
  const touchEndY = e.changedTouches[0].screenY
  
  const dx = touchEndX - touchStartX.value
  const dy = touchEndY - touchStartY.value
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal
    if (Math.abs(dx) > 30) {
      if (dx > 0 && velocity.value.x === 0) nextVelocity.value = { x: 1, y: 0 }
      else if (dx < 0 && velocity.value.x === 0) nextVelocity.value = { x: -1, y: 0 }
    }
  } else {
    // Vertical
    if (Math.abs(dy) > 30) {
      if (dy > 0 && velocity.value.y === 0) nextVelocity.value = { x: 0, y: 1 }
      else if (dy < 0 && velocity.value.y === 0) nextVelocity.value = { x: 0, y: -1 }
    }
  }
}

const handleMobileControl = (direction: string) => {
  if (gameState.value !== 'playing') return
  
  switch(direction) {
    case 'up':
      if (velocity.value.y === 0) nextVelocity.value = { x: 0, y: -1 }
      break
    case 'down':
      if (velocity.value.y === 0) nextVelocity.value = { x: 0, y: 1 }
      break
    case 'left':
      if (velocity.value.x === 0) nextVelocity.value = { x: -1, y: 0 }
      break
    case 'right':
      if (velocity.value.x === 0) nextVelocity.value = { x: 1, y: 0 }
      break
  }
}

const restartGame = () => {
  gameState.value = 'playing'
  resetGame()
}

// Lifecycle
onMounted(() => {
  init()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyInput)
  if (gameLoopId.value) {
    cancelAnimationFrame(gameLoopId.value)
  }
})

// Watch for external score changes
watch(() => props.score, (newScore) => {
  if (newScore !== score.value) {
    score.value = newScore
  }
})
</script>