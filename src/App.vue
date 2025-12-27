<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center text-white relative">
    <!-- Background Elements -->
    <div class="absolute inset-0 scanlines z-10"></div>
    <div class="crt-flicker"></div>
    
    <!-- Main Container -->
    <div class="relative z-20 w-full max-w-2xl px-4 flex flex-col items-center gap-4 h-full justify-center pb-8">
      
      <!-- Header -->
      <header class="w-full flex justify-between items-end mb-6">
        <div class="animate-float pb-6 overflow-visible">
          <h1 class="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] text-center leading-none" style="line-height: 1.1; padding-bottom: 8px;">
            太空<br>像素蛇
          </h1>
        </div>
        
        <!-- Score Board -->
        <div class="glass-panel rounded-lg px-4 py-2 flex flex-col items-end">
          <span class="text-xs text-gray-400 mb-1">SCORE</span>
          <span class="text-xl text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">{{ score }}</span>
        </div>
      </header>

      <!-- Game Area Wrapper -->
      <div class="relative group w-full aspect-square max-w-[500px]">
        <!-- Decorative Border -->
        <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition duration-500 blur-[1px]"></div>
        
        <!-- Canvas -->
        <div class="relative bg-black rounded-lg overflow-hidden border-4 border-gray-800 w-full h-full">
          <SnakeGame ref="gameComponent" :score.sync="score" />
        </div>
      </div>

      <!-- Instructions -->
      <div class="w-full max-w-[500px] mt-2">
        <div class="glass-panel rounded-lg p-3 text-center">
          <p class="text-[10px] md:text-xs text-gray-300 leading-relaxed">
            <i class="fas fa-keyboard mr-2 text-neon-cyan"></i>使用方向键控制飞船
            <span class="hidden md:inline mx-2">|</span>
            <i class="fas fa-mobile-alt mr-2 md:hidden text-neon-cyan"></i>
            <span class="md:hidden">滑动屏幕控制</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SnakeGame from './components/SnakeGame.vue'

const score = ref<number>(0)
const gameComponent = ref<InstanceType<typeof SnakeGame>>()
</script>