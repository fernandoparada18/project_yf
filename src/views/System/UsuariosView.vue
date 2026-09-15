<template>
  <AdminLayout>
    <div>
      <!-- Breadcrumb -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Usuarios
        </h2>
      </div>

      <!-- Table Section -->
      <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-xl font-bold text-black dark:text-white">Listado de Usuarios</h4>
          <button @click="openModal()" class="flex justify-center rounded bg-brand-500 py-2 px-6 font-medium text-white hover:bg-brand-600">
            Nuevo Usuario
          </button>
        </div>

        <div class="max-w-full overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="py-4 px-4 font-medium text-black dark:text-white">Nombre</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="3" class="text-center py-4">Cargando...</td>
              </tr>
              <tr v-else-if="users.length === 0">
                <td colspan="3" class="text-center py-4">No hay usuarios registrados.</td>
              </tr>
              <tr v-for="user in users" :key="user.id" class="border-b border-stroke dark:border-strokedark">
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ user.nombre }}</p></td>
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ user.email }}</p></td>
                <td class="py-5 px-4">
                  <div class="flex items-center space-x-3.5">
                    <button @click="openModal(user)" class="hover:text-primary">Editar</button>
                    <button @click="handleDelete(user.id!)" class="hover:text-red-500">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Form -->
      <div v-if="isModalOpen" class="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-default dark:bg-boxdark">
          <h3 class="mb-4 text-xl font-bold text-black dark:text-white">
            {{ editingId ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Nombre</label>
              <input v-model="form.nombre" type="text" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Email</label>
              <input v-model="form.email" type="email" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="mb-6">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Password <span v-if="editingId" class="text-sm text-gray-500">(Opcional si no desea cambiarla)</span>
              </label>
              <input v-model="form.password" type="password" :required="!editingId" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="flex justify-end gap-4">
              <button type="button" @click="closeModal" class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">Cancelar</button>
              <button type="submit" :disabled="isSubmitting" class="flex justify-center rounded bg-brand-500 py-2 px-6 font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isSubmitting" class="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted } from 'vue'
import { getUsers, createUser, updateUser, deleteUser, type User } from '@/services/api'

const users = ref<User[]>([])
const isLoading = ref(false)
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingId = ref<string | null>(null)

const form = ref<User>({
  email: '',
  password: '',
  nombre: ''
})

const fetchUsers = async () => {
  isLoading.value = true
  const res = await getUsers()
  if (res.success) users.value = res.data
  isLoading.value = false
}

onMounted(() => {
  fetchUsers()
})

const openModal = (user?: User) => {
  if (user) {
    editingId.value = user.id || null
    form.value = { ...user, password: '' }
  } else {
    editingId.value = null
    form.value = { email: '', password: '', nombre: '' }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingId.value = null
}

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    if (editingId.value) {
      await updateUser({ ...form.value, id: editingId.value })
    } else {
      await createUser(form.value)
    }
    closeModal()
    fetchUsers()
  } finally {
    isSubmitting.value = false;
  }
}

const handleDelete = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    await deleteUser(id)
    fetchUsers()
  }
}
</script>
