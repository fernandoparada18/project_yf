<template>
  <div class="relative" ref="dropdownRef">
    <!-- User Button -->
    <button
      class="flex items-center text-gray-700 dark:text-gray-400 cursor-pointer"
      @click.prevent="toggleDropdown"
      type="button"
    >
      <span class="h-11 w-11 shrink-0 overflow-hidden rounded-full ltr:mr-3 rtl:ml-3">
        <img src="/images/user/owner.png" alt="User" class="h-full w-full object-cover" />
      </span>

      <span class="block font-medium text-theme-sm ltr:mr-1 rtl:ml-1">{{ userName }}</span>

      <!-- Chevron Icon -->
      <ChevronDownIcon
        class="size-5 transition-transform duration-200 text-gray-500 dark:text-gray-400"
        :class="{ 'rotate-180': dropdownOpen }"
      />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute ltr:right-0 rtl:left-0 z-50 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark animate-fadeIn"
    >
      <!-- User Info -->
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userName }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userEmail }}
        </span>
      </div>

      <!-- Menu Items -->
      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li>
          <router-link
            to="/profile"
            @click="closeDropdown"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <UserCircleIcon
              class="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
            />
            Editar perfil
          </router-link>
        </li>
      </ul>

      <!-- Sign Out -->
      <router-link
        to="/signin"
        @click="signOut"
        class="group mt-3 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        Cerrar Sesión
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userName = ref('Usuario')
const userEmail = ref('')

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  localStorage.removeItem('user')
  closeDropdown()
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      // Ajusta esto dependiendo de los campos que vengan en tu base de datos
      userName.value = user.name || user.nombre || user.email?.split('@')[0] || 'Usuario'
      userEmail.value = user.email || user.correo || ''
    } catch (e) {
      console.error('Error al cargar datos del usuario', e)
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
