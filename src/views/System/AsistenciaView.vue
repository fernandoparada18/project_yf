<template>
  <AdminLayout>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Registro de Asistencia
        </h2>
        <button @click="openModal" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-1">
          + Registrar Asistencia
        </button>
      </div>

      <!-- Activity Selector -->
      <div class="mb-6 rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <label class="mb-2.5 block font-medium text-black dark:text-white">1. Seleccione una Actividad en la lista desplegable</label>
        <select v-model="selectedActivityId" @change="fetchAttendance" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
          <option value="" disabled>Seleccione una actividad...</option>
          <option v-for="act in activities" :key="act.id" :value="act.id">
            {{ act.fecha }} - {{ act.descripcion }}
          </option>
        </select>
        
        <div class="mt-4 flex justify-end">
          <button @click="openModal" class="flex justify-center rounded bg-primary py-3 px-8 font-medium text-white hover:bg-opacity-90 shadow-1 text-lg">
            2. Registrar Nueva Asistencia
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div v-if="selectedActivityId" class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-xl font-bold text-black dark:text-white">Listado de Asistentes</h4>
          <button @click="openModal" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">
            Registrar Asistente
          </button>
        </div>

        <div class="max-w-full overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="py-4 px-4 font-medium text-black dark:text-white">Nac.</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Cédula</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Nombre</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Apellido</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Teléfono</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Correo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="6" class="text-center py-4">Cargando...</td>
              </tr>
              <tr v-else-if="attendanceList.length === 0">
                <td colspan="6" class="text-center py-4">No hay asistentes registrados para esta actividad. Haga clic en el botón de Registrar Asistencia.</td>
              </tr>
              <tr v-for="att in attendanceList" :key="att.id" class="border-b border-stroke dark:border-strokedark">
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ att.nacionalidad }}</p></td>
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ att.cedula }}</p></td>
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ att.nombre }}</p></td>
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ att.apellido }}</p></td>
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ att.telefono }}</p></td>
                <td class="py-5 px-4"><p class="text-black dark:text-white">{{ att.correo }}</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Form -->
      <div v-if="isModalOpen" class="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-default dark:bg-boxdark max-h-[90vh] overflow-y-auto">
          <h3 class="mb-4 text-xl font-bold text-black dark:text-white">
            Registrar Asistente
          </h3>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Nacionalidad</label>
              <select v-model="form.nacionalidad" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                <option value="V">Venezolano (V)</option>
                <option value="E">Extranjero (E)</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Cédula</label>
              <input v-model="form.cedula" type="text" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Nombre</label>
              <input v-model="form.nombre" type="text" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Apellido</label>
              <input v-model="form.apellido" type="text" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Teléfono</label>
              <input v-model="form.telefono" type="text" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="mb-6">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Correo Electrónico</label>
              <input v-model="form.correo" type="email" required class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
            </div>
            <div class="flex justify-end gap-4">
              <button type="button" @click="closeModal" class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">Cancelar</button>
              <button type="submit" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">Guardar</button>
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
import { useRoute } from 'vue-router'
import { getActivities, getAttendance, createAttendance, type Activity, type Attendance } from '@/services/api'

const route = useRoute()
const selectedActivityId = ref<string>((route.params.id as string) || '')
const activities = ref<Activity[]>([])
const attendanceList = ref<Attendance[]>([])
const isLoading = ref(false)
const isModalOpen = ref(false)

const form = ref<Attendance>({
  actividad_id: '',
  nacionalidad: 'V',
  cedula: '',
  nombre: '',
  apellido: '',
  telefono: '',
  correo: ''
})

onMounted(async () => {
  // Fetch activities for dropdown
  const res = await getActivities()
  if (res.success) {
    activities.value = res.data
  }
  
  // If navigated with ID, fetch its attendance
  if (selectedActivityId.value) {
    fetchAttendance()
  }
})

const fetchAttendance = async () => {
  if (!selectedActivityId.value) return
  isLoading.value = true
  const res = await getAttendance(selectedActivityId.value)
  if (res.success) attendanceList.value = res.data
  isLoading.value = false
}

const openModal = () => {
  if (!selectedActivityId.value) {
    alert('Por favor, seleccione una actividad primero en la lista desplegable antes de registrar asistencia.');
    return;
  }
  form.value = {
    actividad_id: selectedActivityId.value,
    nacionalidad: 'V',
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  await createAttendance(form.value)
  closeModal()
  fetchAttendance()
}
</script>
