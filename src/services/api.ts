// URL de la Aplicación Web de Google Apps Script. 
// Reemplaza esto con la URL que obtengas al implementar tu script.
const GAS_URL = import.meta.env.VITE_GAS_URL;

export interface User {
  id?: string;
  email: string;
  password?: string;
  nombre: string;
}

export interface Activity {
  id?: string;
  fecha: string;
  descripcion: string;
}

export interface Attendance {
  id?: string;
  actividad_id: string;
  nacionalidad: string;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
}

async function gasRequest(action: string, payload: any = {}) {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
      // Dependiendo de tu GAS puedes necesitar o no no-cors, pero para obtener 
      // JSON de vuelta con un ContentService.createTextOutput, necesitas POST simple (CORS).
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS a veces requiere text/plain para evitar preflight OPTIONS
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error in GAS request [${action}]:`, error);
    return { success: false, error: 'Error de conexión' };
  }
}

// Authentication
export const loginUser = (email: string, password: string) => gasRequest('login', { email, password });

// Users
export const getUsers = () => gasRequest('getUsers');
export const createUser = (user: User) => gasRequest('createUser', user);
export const updateUser = (user: User) => gasRequest('updateUser', user);
export const deleteUser = (id: string) => gasRequest('deleteUser', { id });

// Activities
export const getActivities = () => gasRequest('getActivities');
export const createActivity = (activity: Activity) => gasRequest('createActivity', activity);
export const updateActivity = (activity: Activity) => gasRequest('updateActivity', activity);
export const deleteActivity = (id: string) => gasRequest('deleteActivity', { id });

// Attendance
export const getAttendance = (actividad_id: string) => gasRequest('getAttendance', { actividad_id });
export const createAttendance = (attendance: Attendance) => gasRequest('createAttendance', attendance);
export const updateAttendance = (attendance: Attendance) => gasRequest('updateAttendance', attendance);
export const deleteAttendance = (id: string) => gasRequest('deleteAttendance', { id });
