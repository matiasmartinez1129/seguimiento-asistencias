// script.js
document.addEventListener("DOMContentLoaded", () => {
    const studentList = document.getElementById("student-list");
    const addStudentButton = document.getElementById("add-student");
    const undoButton = document.getElementById("undo-action");

    // Inicializar los estudiantes a partir del LocalStorage, si existe
    let students = JSON.parse(localStorage.getItem("students")) || [];
    let actionHistory = []; // Historial de acciones

    const TOTAL_CLASSES = 36; // Total de clases fijas

    // Función para guardar estudiantes en el LocalStorage
    function saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(students));
    }

    // Función para agregar un alumno a la lista
    function addStudent() {
        const studentName = prompt("Ingrese el nombre del alumno:");
        if (studentName) {
            students.push({
                name: studentName,
                attendance: 0,
                absences: 0,
                status: 'Aprobado'
            });
            saveToLocalStorage();
            renderTable();
        }
    }

    // Función para marcar asistencia o falta
    function updateAttendance(index, isPresent) {
        const student = students[index];
        const previousAttendance = student.attendance;
        const previousAbsences = student.absences;

        if (student.attendance + student.absences < TOTAL_CLASSES) {
            if (isPresent) {
                student.attendance++;
                actionHistory.push({ index, type: 'absence', previousAttendance, previousAbsences });
            } else {
                student.absences++;
                actionHistory.push({ index, type: 'attendance', previousAttendance, previousAbsences });
            }

            // Verificar el estado del alumno basado en asistencias y faltas
            if (student.attendance >= 29) {
                student.status = 'Aprobado'; // 80% o más de asistencia
            } else if (student.absences >= 7) {
                student.status = 'Reprobado'; // 20% o más de faltas
            } else {
                student.status = 'En proceso'; // Entre 80% y 20%
            }

            saveToLocalStorage();
            renderTable();
        } else {
            alert("Este alumno ya ha completado las 36 clases.");
        }
    }

    // Función para deshacer la última acción
    function undoLastAction() {
        if (actionHistory.length > 0) {
            const lastAction = actionHistory.pop(); // Obtener y eliminar la última acción del historial
            const student = students[lastAction.index];

            // Restaurar valores previos según el tipo de acción
            if (lastAction.type === 'attendance') {
                student.absences = lastAction.previousAbsences;
                student.attendance = lastAction.previousAttendance;
            } else if (lastAction.type === 'absence') {
                student.attendance = lastAction.previousAttendance;
                student.absences = lastAction.previousAbsences;
            }

            // Recalcular el estado después de deshacer la acción
            if (student.attendance >= 29) {
                student.status = 'Aprobado';
            } else if (student.absences >= 7) {
                student.status = 'Reprobado';
            } else {
                student.status = 'En proceso'; // Restaurar estado si es necesario
            }

            saveToLocalStorage();
            renderTable();
        } else {
            alert("No hay acciones para deshacer.");
        }
    }

    // Función para eliminar un alumno
    function deleteStudent(index) {
        if (confirm("¿Estás seguro de que deseas eliminar este alumno?")) {
            students.splice(index, 1); // Eliminar el alumno del arreglo
            actionHistory = actionHistory.filter(action => action.index !== index); // Limpiar el historial de acciones para el alumno eliminado
            saveToLocalStorage(); // Guardar cambios en LocalStorage
            renderTable(); // Volver a renderizar la tabla
        }
    }

    // Renderizar la tabla de alumnos
    function renderTable() {
        studentList.innerHTML = ""; // Limpiar la tabla

        students.forEach((student, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.attendance}</td>
                <td>${student.absences}</td>
                <td>
                    <button onclick="updateAttendance(${index}, true)">Presente</button>
                    <button onclick="updateAttendance(${index}, false)">Ausente</button>
                </td>
                <td>${student.status}</td>
                <td><button class="delete" onclick="deleteStudent(${index})">Eliminar</button></td>
            `;

            studentList.appendChild(row);
        });
    }

    // Evento para agregar un alumno
    addStudentButton.addEventListener("click", addStudent);

    // Evento para deshacer la última acción
    undoButton.addEventListener("click", undoLastAction);

    // Hacer la función updateAttendance, undoLastAction y deleteStudent globales para poder usarlas en los botones
    window.updateAttendance = updateAttendance;
    window.undoLastAction = undoLastAction;
    window.deleteStudent = deleteStudent;

    // Renderizar la tabla cuando se carga la página
    renderTable();
});
