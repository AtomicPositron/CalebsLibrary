<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { libraryStore, courseIcons, type IconSet } from './stores/library'
import { ref, watch, onMounted } from 'vue'
import gsap from 'gsap'

const defaultIcon: IconSet = courseIcons['default'] || {
  path: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z',
  viewBox: '0 0 24 24',
}

const displayFolder = ref('')
const displayDescription = ref('')
const displayIcon = ref<IconSet>(defaultIcon)
const iconRef = ref<SVGPathElement | null>(null)
const iconContainerRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // Keep empty by default - no folder selected
})

watch(
  () => libraryStore.currentFolder,
  (newVal) => {
    if (newVal && iconContainerRef.value) {
      const tl = gsap.timeline()

      tl.to(iconContainerRef.value, {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
          displayFolder.value = libraryStore.currentFolder
          displayDescription.value = libraryStore.currentDescription
          displayIcon.value = libraryStore.currentIcon

          tl.to(iconContainerRef.value, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
          })
        },
      })
    } else if (!newVal) {
      displayFolder.value = ''
      displayDescription.value = ''
      displayIcon.value = defaultIcon

      gsap.to(iconContainerRef.value, {
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(iconContainerRef.value, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
          })
        },
      })
    }
  },
)
</script>

<template>
  <div class="mainBody flex flex-col lg:flex-row bg-[#0E1117] w-full min-h-screen">
    <!-- Left Panel -->
    <div
      class="leftContainer p-4 md:p-6 lg:p-10 flex flex-col gap-2 lg:gap-1 bg-transparent lg:bg-[#151A22] w-full lg:w-1/2 lg:min-h-screen shrink-0"
    >
      <nav class="w-full flex flex-row justify-between items-center">
        <h1
          class="text-white text-5xl md:text-6xl lg:text-7xl font-bold flex-1 whitespace-pre-line"
        >
          Caleb's<br />
          Library
        </h1>
      </nav>

      <!-- Icon - hidden on mobile, visible on lg -->
      <div
        ref="iconContainerRef"
        class="hidden lg:flex icon w-full justify-center items-center flex-1 lg:min-h-[250px]"
      >
        <svg
          width="150"
          height="150"
          class="w-48 h-48 lg:w-[306px] lg:h-[306px] transition-all duration-300"
          :viewBox="displayIcon?.viewBox || '0 0 24 24'"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref="iconRef"
            :d="displayIcon?.path"
            fill="url(#paint0_linear_icon)"
            fill-opacity="0.8"
          />
          <defs>
            <linearGradient
              id="paint0_linear_icon"
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#CF8E80" />
              <stop offset="1" stop-color="#292B57" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Text -->
      <div class="text w-full flex flex-col gap-2 lg:flex-1 justify-center">
        <Transition name="fade" mode="out-in">
          <h1
            :key="displayFolder"
            class="hidden lg:block font-bold folderName text-white text-3xl md:text-4xl lg:text-7xl truncate"
          >
            {{ displayFolder }}
          </h1>
        </Transition>
        <Transition name="fade" mode="out-in">
          <p :key="displayDescription" class="text-white text-lg md:text-xl lg:text-3xl">
            {{ displayDescription }}
          </p>
        </Transition>
      </div>

      <!-- Footer - hidden on mobile -->
      <footer class="hidden lg:block w-full text-white text-right text-sm lg:mt-0">
        © 2026 Caleb's Library
      </footer>
    </div>

    <!-- Right Panel -->
    <div class="flex flex-col min-h-[50vh] lg:min-h-screen">
      <router-view class="flex-1 overflow-hidden" />
      <!-- Footer - only on mobile -->
      <footer class="lg:hidden p-4 text-white text-center text-sm bg-[#0E1117]">
        © 2026 Caleb's Library
      </footer>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1023px) {
  .leftContainer {
    min-height: auto;
  }
}
</style>
