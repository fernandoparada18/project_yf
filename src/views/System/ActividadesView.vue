<template>
  <AdminLayout>
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Actividades
        </h2>
        <button @click="openModal()" class="flex justify-center rounded bg-brand-500 py-2 px-6 font-medium text-white hover:bg-brand-600 shadow-1">
          + Nueva Actividad
        </button>
      </div>

      <!-- Table Section -->
      <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-xl font-bold text-black dark:text-white">Listado de Actividades</h4>
        </div>

        <div class="max-w-full overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="py-4 px-4 font-medium text-black dark:text-white">Fecha</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Descripción</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="3" class="text-center py-4">Cargando...</td>
              </tr>
              <tr v-else-if="activities.length === 0">
                <td colspan="3" class="text-center py-4">No hay actividades registradas.</td>
              </tr>
              <tr v-for="activity in activities" :key="activity.id" class="border-b border-stroke dark:border-strokedark">
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ activity.fecha }}</p></td>
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ activity.descripcion }}</p></td>
                <td class="py-5 px-4">
                  <div class="flex items-center space-x-3.5">
                    <router-link :to="`/asistencia/${activity.id}`" class="text-blue-500 hover:text-blue-700 font-medium">Gestionar Asistencia</router-link>
                    <button @click="openModal(activity)" class="hover:text-primary">Editar</button>
                    <button @click="handleDelete(activity.id!)" class="hover:text-red-500">Eliminar</button>
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
            {{ editingId ? 'Editar Actividad' : 'Nueva Actividad' }}
          </h3>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Fecha</label>
              <input v-model="form.fecha" type="date" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="mb-6">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Descripción</label>
              <textarea v-model="form.descripcion" rows="3" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"></textarea>
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
import { getActivities, createActivity, updateActivity, deleteActivity, type Activity } from '@/services/api'

const activities = ref<Activity[]>([])
const isLoading = ref(false)
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingId = ref<string | null>(null)

const form = ref<Activity>({
  fecha: '',
  descripcion: ''
})

const fetchActivities = async () => {
  isLoading.value = true
  const res = await getActivities()
  if (res.success) activities.value = res.data
  isLoading.value = false
}

onMounted(() => {
  fetchActivities()
})

const openModal = (activity?: Activity) => {
  if (activity) {
    editingId.value = activity.id || null
    form.value = { ...activity }
  } else {
    editingId.value = null
    form.value = { fecha: '', descripcion: '' }
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
      await updateActivity({ ...form.value, id: editingId.value })
    } else {
      await createActivity(form.value)
    }
    closeModal()
    fetchActivities()
  } finally {
    isSubmitting.value = false;
  }
}

const handleDelete = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta actividad?')) {
    await deleteActivity(id)
    fetchActivities()
  }
}
</script>
