const SHEET_USERS = 'Usuarios';
const SHEET_ACTIVITIES = 'Actividades';
const SHEET_ATTENDANCE = 'Asistencia';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss.getSheetByName(SHEET_USERS)) {
    const sheet = ss.insertSheet(SHEET_USERS);
    sheet.appendRow(['id', 'email', 'password', 'nombre']);
  }
  if (!ss.getSheetByName(SHEET_ACTIVITIES)) {
    const sheet = ss.insertSheet(SHEET_ACTIVITIES);
    sheet.appendRow(['id', 'fecha', 'descripcion']);
  }
  if (!ss.getSheetByName(SHEET_ATTENDANCE)) {
    const sheet = ss.insertSheet(SHEET_ATTENDANCE);
    sheet.appendRow(['id', 'actividad_id', 'nacionalidad', 'cedula', 'nombre', 'apellido', 'telefono', 'correo']);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result = {};
    
    switch (action) {
      case 'login':
        result = login(data.payload);
        break;
      case 'getUsers':
        result = getRecords(SHEET_USERS);
        break;
      case 'createUser':
        result = createRecord(SHEET_USERS, data.payload);
        break;
      case 'updateUser':
        result = updateRecord(SHEET_USERS, data.payload);
        break;
      case 'deleteUser':
        result = deleteRecord(SHEET_USERS, data.payload.id);
        break;
      case 'getActivities':
        result = getRecords(SHEET_ACTIVITIES);
        break;
      case 'createActivity':
        result = createRecord(SHEET_ACTIVITIES, data.payload);
        break;
      case 'updateActivity':
        result = updateRecord(SHEET_ACTIVITIES, data.payload);
        break;
      case 'deleteActivity':
        result = deleteRecord(SHEET_ACTIVITIES, data.payload.id);
        break;
      case 'getAttendance':
        result = getAttendanceByActivity(data.payload.actividad_id);
        break;
      case 'createAttendance':
        result = createRecord(SHEET_ATTENDANCE, data.payload);
        break;
      default:
        return jsonResponse({ success: false, error: 'Acción no válida' }, 400);
    }
    
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

function doGet(e) {
  return jsonResponse({ success: true, message: "API está funcionando" });
}

function jsonResponse(data, status = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================= UTILS =================

function generateId() {
  return Utilities.getUuid();
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(`Hoja ${sheetName} no encontrada`);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Solo encabezados o vacía
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

// ================= CRUD GENERICO =================

function getRecords(sheetName) {
  const records = getSheetData(sheetName);
  // Ocultar contraseñas si es la tabla de usuarios
  if (sheetName === SHEET_USERS) {
    return { success: true, data: records.map(r => { delete r.password; return r; }) };
  }
  return { success: true, data: records };
}

function createRecord(sheetName, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const headers = sheet.getDataRange().getValues()[0];
  
  payload.id = generateId();
  
  const rowData = headers.map(header => payload[header] || '');
  sheet.appendRow(rowData);
  SpreadsheetApp.flush(); // Ensure data is written immediately
  
  // Limpiar contraseña antes de devolver si es usuario
  if (sheetName === SHEET_USERS) delete payload.password;
  
  return { success: true, data: payload };
}

function updateRecord(sheetName, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == payload.id) { // Asume ID en primera columna
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) throw new Error("Registro no encontrado");
  
  const updatedRow = headers.map((header, index) => {
    if (header === 'password' && !payload[header]) {
       return data[rowIndex-1][index];
    }
    return payload[header] !== undefined ? payload[header] : data[rowIndex-1][index];
  });
  
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([updatedRow]);
  SpreadsheetApp.flush();
  
  if (sheetName === SHEET_USERS) delete payload.password;
  return { success: true, data: payload };
}

function deleteRecord(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) throw new Error("Registro no encontrado");
  
  sheet.deleteRow(rowIndex);
  SpreadsheetApp.flush();
  return { success: true };
}

// ================= CUSTOM LOGIC =================

function login(payload) {
  const users = getSheetData(SHEET_USERS);
  const user = users.find(u => u.email === payload.email && u.password === payload.password);
  
  if (user) {
    delete user.password;
    return { success: true, data: user };
  } else {
    return { success: false, error: 'Credenciales inválidas' };
  }
}

function getAttendanceByActivity(actividadId) {
  const allAttendance = getSheetData(SHEET_ATTENDANCE);
  const filtered = allAttendance.filter(a => a.actividad_id == actividadId);
  return { success: true, data: filtered };
}
