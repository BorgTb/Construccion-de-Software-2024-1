<template>
    <div class="profesorPage">
        <div class="containerTitle">
            <h1>{{ nombreSesion }}</h1>
            <h1 class="claseNumeroSesion">{{ sessionId }}</h1>
        </div>
        <div class="dashboard">
            <!--  <button @click="createSession">Crear Sesión</button> -->
            <button v-if=!isCancelada class="hero__cta" @click="añadir">Añadir Alumno</button>
            <button v-if=!isCancelada class="hero__cta" @click="cancelarSesion(idRuta)">Cancelar Sesion</button>
            <button v-if=!isCancleada class="hero__cta" @click="redirigirCrearEvaluacion(); menuOpen = false">Crear
                Evaluación</button>
            <!--  <button @click="otherOptions">Otras Opciones</button> -->
        </div>
        <div class="mainContainer">
            <div class="chartContainer">
                <canvas id="studentsPieChart"></canvas>
                <div class="legend"></div>
            </div>
            <div class="chartDataContainer">
                <h2>Datos del Gráfico</h2>
                <p><strong>Total de Estudiantes:</strong> {{ alumnos.length }}</p>
                <p><strong>Aplicaciones Peligrosas Abiertas:</strong> {{ totalDangerousApps }}</p>
                <p><strong>Última Actividad:</strong> {{ lastActivity }}</p>
                <div class="charts">
                    <canvas id="appsBarChart"></canvas>
                </div>
            </div>
        </div>
        <div class="bottomContainer">
            <table>
                <thead>
                    <tr>
                        <th>Matrícula</th>
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="alumno in alumnos" :key="alumno._id">
                        <td :class="{ 'row-red ban-text': alumnosBaneados.includes(alumno.email) }">
                            {{ alumno.matricula }}</td>
                        <td :class="{ 'row-red ban-text': alumnosBaneados.includes(alumno.email) }">
                            {{ alumno.firstName }}</td>
                        <td :class="{ 'row-red ban-text': alumnosBaneados.includes(alumno.email) }">
                            {{ alumno.lastName }}</td>
                        <td :class="{ 'row-red ban-text': alumnosBaneados.includes(alumno.email) }">
                            {{ alumno.secondLastName }}
                        </td>
                        <td
                            :class="{ 'row-red': alumnosBaneados.includes(alumno.email), 'peligro-text': alumno.status === 'Peligro', 'advertencia-text': alumno.status === 'Advertencia', 'normal-text': alumno.status === 'Normal' }">
                            {{ alumno.status }}
                        </td>
                        <td v-if="!alumnosBaneados.includes(alumno.email)"
                            :class="{ 'row-red': alumnosBaneados.includes(alumno.email) }">
                            <button class="actionButton ban" @click="banExpStudent(alumno, accion = true)"
                                :disabled="alumno.status !== 'Peligro' && alumno.status !== 'Advertencia'">Banear</button>
                            <!-- Si "accion" es true se banea, si no, no -->
                            <button class="actionButton expel" @click="banExpStudent(alumno, accion = false)"
                                :disabled="alumno.status !== 'Peligro' && alumno.status !== 'Advertencia'">Expulsar</button>
                            <!--<button class="actionButton notify" @click="notifyStudent(alumno)">Notificar</button>-->
                            <BotonNotificar :participante="alumno" :session="sessionId" />
                            <button class="actionButton view" @click="viewProcesses(alumno._id)"><i
                                    class="fas fa-eye"></i></button>
                        </td>
                        <td v-else :class="{ 'row-red ban-text': alumnosBaneados.includes(alumno.email) }"
                            style="font-size: 20px;">
                            <b>Baneado</b>
                            <button class="actionButton desban" @click="unbanStudent(alumno)">Desbanear</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="showModal" class="modal" @click.self="closeModal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h2>Datos de {{ selectedStudent.firstName }} {{ selectedStudent.lastName }} {{
                    selectedStudent.secondLastName }}</h2>
                <h3>Últimas URLs</h3>
                <ul>
                    <li v-for="url in selectedStudent.latestUrls" :key="url">
                        <a :href="url" target="_blank">{{ url }}</a>
                    </li>
                </ul>
                <h3>Procesos</h3>
                <ul>
                    <li v-for="app in selectedStudent.apps" :key="app.name">
                        <i class="fas fa-check-circle" :class="app.status"></i>{{ app }}
                    </li>
                </ul>
                <button class="closeButton" @click="closeModal">Cerrar</button>
            </div>
        </div>

    </div>
    <div>
        <section class="modal_añadir">
            <div class="modal__container_añadir">
                <img src="@/assets/logo.svg" class="modal__img_añadir">
                <h2 class="modal__title_añadir">Añadir Alumno</h2>
                <div class="wrap-check-58">
                    <div class="round">
                        <div class="input-container_añadir">
                            <input type="text" name="text" v-model="searchQuery" class="input_añadir"
                                placeholder="Buscar por nombre...">
                            <span class="icon_añadir">
                                <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path opacity="1" d="M14 5H20" stroke="#000" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path opacity="1" d="M14 8H17" stroke="#000" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path
                                            d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                                            stroke="#000" stroke-width="2.5" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                        <path opacity="1" d="M22 22L20 20" stroke="#000" stroke-width="3.5"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </span>
                        </div>
                        <ul name="user" id="user" class="modal__select_añadir">
                            <li v-for="user in filteredUsers" :key="user._id" class="listar_alumnos">
                                <label class="container_check">
                                    <input type="checkbox" v-model="user.selected">
                                    <div class="checkmark_check">
                                        <div class="input_alumnos">
                                            <span class="dato_alumno">{{ user.matricula }}</span>
                                            <span class="dato_alumno">{{ user.firstName }}</span>
                                            <span class="dato_alumno">{{ user.lastName }}</span>
                                        </div>
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="botones_añadir">
                    <a href="#" @click.prevent="anadir_Usuario" class="modal_close_añadir">Añadir</a>
                    <a href="#" class="modal__close_añadir">Cerrar</a>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import BotonNotificar from '@/components/ComponentesGrupoClaudio/BotonNotificar.vue';
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { time } from 'xpress/lib/string';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Accede a tu clave API como una variable de entorno
const genAI = new GoogleGenerativeAI("AIzaSyAt9ZEV59R9z5vL9ENMVwVx3b5t9kg0MNY");
export default {
    setup() {
        const route = useRoute();
        const idRuta = route.params.id;
        const router = useRouter();
        let nombreSesion = ref('');
        let isCancelada = ref(false);
        const obtenerDatosSesion = async () => {
            try {
                const respuesta = await fetch('http://localhost:8080/sessions/' + idRuta);
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    nombreSesion.value = datos.nombre;
                    isCancelada.value = datos.cancelada;
                } else {
                    console.error('Error al obtener los datos:', respuesta.statusText);
                }
            } catch (error) {
                console.error('Error en la petición fetch:', error);
            }
        };
        const cancelarSesion = async (id) => {
            try {
                let respuesta = await fetch(`http://localhost:8080/cancelarSesion/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (respuesta.ok) {
                    console.log("marcado como cancelado")
                }
                else {
                    console.error("Error al marcar como cancelado")
                }
            } catch {
                console.error("Error al obtener sesion")
            }
        }
        onMounted(obtenerDatosSesion)
        return {
            idRuta,
            nombreSesion,
            cancelarSesion,
            isCancelada,
            router

        };
    },
    data() {

        return {
            alumnos: [],
            alumnosBaneados: [],
            session: {},
            totalDangerousApps: 0,
            lastActivity: '',
            showModal: false,
            selectedStudent: '',
            sessionId: this.idRuta,
            users: [],
            asignaturas: [],
            searchQuery: '',
        };
    },

    created() {
        this.alumnosbaneados();
        this.fetchUsers();
        this.mounted();
    },

    name: 'ProfesorPage',
    components: {
        BotonNotificar,
    },
    methods: {
        /*async fetchSessionData() {
            try {
                const response = await axios.get(`http://localhost:8080/sessions/${this.idRuta}`);
                const sessionData = response.data;
                this.session = sessionData;
                this.alumnos = this.assignAppsToStudents(sessionData.participantes);
                this.totalDangerousApps = this.calculateTotalDangerousApps(this.alumnos);
                this.lastActivity = new Date().toLocaleString();
                this.createCharts();
            } catch (error) {
                console.error('Error fetching session data:', error);
            }
        },*/
        redirigirCrearEvaluacion() {
            this.router.push({ name: 'CrearEvaluacion', params: { sesionId: this.sessionId } });
        },

        assignAppsToStudents(students) {
            const dangerApps = ['ChatGPT', 'Steam', "Discord", "TeamSpeak", "Skype", "Zoom", "Telegram", "WhatsApp", "Instagram", "Snapchat", "TikTok", "YouTube", "Twitch", "Tinder", "Grinder"];
            const warningApps = ['Slack', 'Skype', 'Zoom', "EpicGames", "Word", "Excel", "PowerPoint", "Paint", "Illustrator", "Photoshop", "Premiere", "Acrobat", "Ink"];
            const normalApps = ['Word', 'Excel', 'PowerPoint', 'Chrome', "PSeInt", "Spyder", "Eclipse", "NetBeans", "IntelliJ", "PyCharm", "VisualStudio", "CodeBlocks", "DevC++", "SublimeText", "Atom", "Notepad++", "Vim", "Emacs", "Nano", "Gedit", "pgAdmin", "GitBash"];
            const statuses = ['Peligro', 'Advertencia', 'Normal'];
            let statusIndex = 0;

            return students.map((student) => {
                const apps = [];
                const status = statuses[statusIndex];

                const appList = status === 'Peligro' ? dangerApps : (status === 'Advertencia' ? warningApps : normalApps);
                const randomApps = this.shuffleArray(appList);

                const numberOfApps = Math.floor(Math.random() * 2) + 2;
                for (let i = 0; i < numberOfApps; i++) {
                    apps.push({ name: randomApps[i], status });
                }

                statusIndex = (statusIndex + 1) % statuses.length;

                return {
                    ...student,
                    apps,
                    status,
                };
            });
        },

        /*assignAppsToStudents(students) {
            const dangerApps = ['Discord', 'ChatGPT', 'Steam'];
            const warningApps = ['Slack', 'Zoom', 'Skype'];
            const normalApps = ['Word', 'Excel', 'PowerPoint', 'Chrome'];

            return students.map((student, index) => {
                const apps = [];
                let status = 'Normal';

                if (index % 3 === 0) {
                    status = 'Peligro';
                } else if (index % 3 === 1) {
                    status = 'Advertencia';
                }

                const appList = status === 'Peligro' ? dangerApps : (status === 'Advertencia' ? warningApps : normalApps);
                const randomApps = this.shuffleArray(appList);

                const numberOfApps = Math.floor(Math.random() * 2) + 2;
                for (let i = 0; i < numberOfApps; i++) {
                    apps.push({ name: randomApps[i], status });
                }

                return {
                    ...student,
                    apps,
                    status,
                };
            });
        },*/
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        async fetchUsers() {
            try {
                //el gran problema que hubo para hacer filtro y usar los usuarios dentro de la bd fue que no habia usuarios y no existia un metodo para agregarlos
                //por lo que se tuvo que hacer un metodo para agregar usuarios  directamente en el array de la bd de mongo
                //pero al menos ya funcion el filtro y se pueden ver los usuarios en la tabla con su respectiva información

                const response = await axios.get('http://localhost:8080/users');
                const participantes = response.data;

                const sessionResponse = await axios.get('http://localhost:8080/sesion/' + this.sessionId);// + this.sessionId);
                const sessionUsers = sessionResponse.data;

                console.log("ID de los Usuarios de la Sesion \n" + sessionUsers.participantes);

                const participantesIds = sessionUsers.participantes;

                const studentsWithApps = this.assignAppsToStudents(participantes).filter(user =>
                    participantesIds.includes(user._id)
                );

                //const studentsWithApps = this.assignAppsToStudents(response.data);
                this.alumnos = studentsWithApps;
                this.totalDangerousApps = studentsWithApps.reduce((total, student) => {
                    return total + student.apps.filter(app => app.status === 'danger').length;
                }, 0);
                this.lastActivity = new Date().toLocaleString();
                this.createCharts();
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        calculateTotalDangerousApps(students) {
            return students.reduce((total, student) => {
                return total + student.apps.filter(app => app.status === 'Peligro').length;
            }, 0);
        },
        async obtainAllProcesses() {
            let matrixProcesses = [];
            let processesMax = 0;
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            try {
                for (const alumno of this.alumnos) {
                    const response = await axios.get(`http://localhost:8080/obtenerProcesos/${alumno._id}`);
                    const prompt = `Dada la lista de procesos: ${response.data}\n Proporcione solamente los nombres de las aplicaciones (no de sistema) presentes entre estos procesos (nombre que aparece en el admin de tareas) y clasifique cada uno como 'bueno', 'malo' o 'intermedio' según la etica estudiantil y los procesos que ayuden a realizar trampa son malos por ejemplo: "Discord" ya que tiene chat con otros usuarios, indicando la clasificación entre paréntesis al lado del nombres. Devuelva la lista de procesos en un formato separado por comas. Seguir explicitamente este formato: proceso1 (bueno), proceso2 (malo), proceso3 (intermedio). Sin explicacion y mostrando los nombres conocidos (Visal Studio Code en vez de code).`;
                    const result = await model.generateContent(prompt);
                    const response2 = result.response;
                    const text = response2.text();

                    // Convertir la lista separada por comas a un arreglo
                    const processNamesWithCategories = text.split(',').map(name => name.trim());

                    // Combinar nombres únicos
                    const uniqueProcessNamesWithCategories = [...new Set(processNamesWithCategories)];
                    matrixProcesses.push(uniqueProcessNamesWithCategories);
                    if (response.data.length > processesMax) {
                        processesMax = response.data.length;
                    }
                }

                // Repeticiones de cada proceso
                let processCount = {};
                matrixProcesses.flat().forEach(process => {
                    if (processCount[process]) {
                        processCount[process]++;
                    } else {
                        processCount[process] = 1;
                    }
                });

                // Crear matriz resultado con proceso y veces que se repite
                let resultMatrix = [];
                for (let process in processCount) {
                    resultMatrix.push({ proceso: process, repeticiones: processCount[process] });
                }
                return resultMatrix;
            } catch (error) {
                console.error('Error al obtener los procesos del estudiante:', error);
                return [];
            }
        },
        async createCharts() {
            const pieCtx = document.getElementById('studentsPieChart').getContext('2d');
            const appsCtx = document.getElementById('appsBarChart').getContext('2d');

            const data = {
                labels: ['Peligro', 'Advertencia', 'Normal'],
                datasets: [{
                    data: [
                        this.alumnos.filter(s => s.status === 'Peligro').length,
                        this.alumnos.filter(s => s.status === 'Advertencia').length,
                        this.alumnos.filter(s => s.status === 'Normal').length,
                    ],
                    backgroundColor: ['#FF0000', '#f7d547', '#008000'],
                }],
            };

            new Chart(pieCtx, {
                type: 'pie',
                data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    aspectRatio: 1,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Estado de los Estudiantes',
                        },
                    },
                    onClick: this.handleChartClick,
                },
            });

            const resultMatrix = await this.obtainAllProcesses();
            const appLabels = resultMatrix.map(item => item.proceso);
            const appData = resultMatrix.map(item => item.repeticiones);


            new Chart(appsCtx, {
                type: 'bar',
                data: {
                    labels: appLabels,
                    datasets: [{
                        label: 'Uso de Aplicaciones',
                        data: appData,
                        backgroundColor: '#08cccc',
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Uso de Aplicaciones por los Estudiantes',
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 90,
                                minRotation: 45,
                            },
                        },
                    },
                },
            });
        },
        handleChartClick(elements) {
            if (elements.length) {
                const chart = elements[0].element.$context.raw;
                const index = elements[0].index;
                const label = chart.data.labels[index];
                this.filteredStudents = this.alumnos.filter(student => student.status === label);
                this.showModal = true;
            }
        },
        closeModal() {
            this.showModal = false;
        },
        async banExpStudent(student, accion) {
            if (student.status === 'Peligro' || student.status === 'Advertencia') {
                try {
                    if (!accion) {
                        this.alumnos = this.alumnos.filter(al => al !== student)
                    }
                    const response = await axios.post('http://localhost:8080/banearExpulsar/' + this.sessionId, { email: student.email, userId: student._id, banear: accion });

                    if (response.status === 200) {
                        await this.alumnosbaneados(); // Actualiza alumnosBaneados después de cada acción
                    } else {
                        throw new Error('Error al actualizar la lista de participantes');
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                }

            } else {
                alert(`La acción de banear solo está disponible para estudiantes en estado de Peligro o Advertencia.`);
            }
        },
        notifyStudent(student) {
            alert(`Notificación enviada a ${student.firstName} ${student.lastName}.`);
        },
        async viewProcesses(userId) {
            console.log("ID de la sesión: " + this.sessionId);
            const selectedStudent = this.alumnos.find(alumno => alumno._id === userId);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            if (!selectedStudent) {
                alert('Estudiante no encontrado');
                return;
            }

            try {

                const response = await axios.get(`http://localhost:8080/obtenerProcesos/${userId}`);
                const prompt = `Dada la lista de procesos: ${response.data}\n Proporcione solamente los nombres de las aplicaciones (no de sistema) presentes entre estos procesos (nombre que aparece en el admin de tareas) y clasifique cada uno como 'bueno', 'malo' o 'intermedio' según la etica estudiantil y los procesos que ayuden a realizar trampa son malos por ejemplo: "Discord" ya que tiene chat con otros usuarios, indicando la clasificación entre paréntesis al lado del nombres. Devuelva la lista de procesos en un formato separado por comas. Seguir explicitamente este formato: proceso1 (bueno), proceso2 (malo), proceso3 (intermedio). Sin explicacion y mostrando los nombres conocidos (Visal Studio Code en vez de code).`;

                const result = await model.generateContent(prompt);
                const response2 = result.response;
                const text = response2.text();

                // Convertir la lista separada por comas a un arreglo
                const processNamesWithCategories = text.split(',').map(name => name.trim());

                // Combinar nombres únicos
                const uniqueProcessNamesWithCategories = [...new Set(processNamesWithCategories)];

                // Escribe los nombres de procesos únicos en un archivo
                const fileText = uniqueProcessNamesWithCategories.join('\n');
                
                // Hacer una solicitud para obtener la última entrada de URLs para este userId en MongoDB
                const urlsResponse = await axios.get(`http://localhost:8080/obtenerUltimaEntrada/${userId}`);
                const lastEntry = urlsResponse.data;
                const latestUrls = lastEntry.urls.split(','); // Convertir la cadena de URLs en un array

                // Hacer una solicitud para obtener los procesos para este userId
                const processesResponse = await axios.get(`http://localhost:8080/obtenerProcesos/${userId}`);
                const apps = processesResponse.data;

                this.selectedStudent = {
                    ...selectedStudent,
                    latestUrls, // Asignar el array de URLs
                    apps: uniqueProcessNamesWithCategories,
                };
                console.log("Última URLs: ", latestUrls);
                console.log("procesos: " + uniqueProcessNamesWithCategories.join(', '));

                this.showModal = true;

                return uniqueProcessNamesWithCategories;
            } catch (error) {
                console.error('Error al obtener datos del estudiante:', error);
                alert('Error al obtener datos del estudiante');
            }
        },



        createSession() {
            console.log(this.idRuta);
        },
        otherOptions() {
            alert('Otras opciones.');
        },
        async mounted() {
            const sessionResponse = await axios.get('http://localhost:8080/sesion/' + this.sessionId);
            const sessionUsers = sessionResponse.data;
            const asignatura = sessionUsers.asignatura;
            const participantesIds = sessionUsers.participantes;
            console.log("--------->" + asignatura)
            const response = await axios.get('http://localhost:8080/users');
            const allUsers = response.data;

            const members = await this.AsignaturaMembers(asignatura);

            this.users = allUsers.filter(user => {
                const isMember = members.includes(user._id.toString());
                const isNotParticipant = !participantesIds.includes(user._id.toString());
                const isAlumno = user.role == 'alumno';
                //console.log(`User ${user._id}: isMember=${isMember}, isNotParticipant=${isNotParticipant}, isAlumno=${isAlumno}`);
                return isMember && isNotParticipant && isAlumno;
            });

        },
        añadir() {
            const openModal = document.querySelector('.hero__cta');
            const modal = document.querySelector('.modal_añadir');
            const closeModal = document.querySelector('.modal__close_añadir');
            const closeModal2 = document.querySelector('.modal_close_añadir');

            openModal.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('modal_añadir--show');
            });

            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('modal_añadir--show');
            });
            closeModal2.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('modal_añadir--show');
                //alert("alumnos agregados correctamente");
            });
        },
        async anadir_Usuario() {
            try {
                const selectedUsers = this.users.filter(user => user.selected);
                //console.log(selectedUsers.map(user => user._id));

                const response = await axios.post('http://localhost:8080/anadir_Usuario', {
                    users: selectedUsers.map(user => user._id),
                    sesion_id: this.sessionId
                });
                Swal.fire({
                    title: 'Alumnos agregados correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                this.fetchUsers();
                console.log(response.data);

            } catch (error) {
                console.error(error);
            }
        },
        async alumnosbaneados() {
            try {
                const response = await axios.get('http://localhost:8080/bannedusers/' + this.sessionId);

                this.alumnosBaneados = response.data
                console.log(this.alumnosBaneados)

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async unbanStudent(student) {
            try {
                const response = await axios.post('http://localhost:8080/desbanear/' + this.sessionId, { email: student.email });

                if (response.status === 200) {
                    await this.alumnosbaneados(); // Actualiza alumnosBaneados después de cada acción
                } else {
                    throw new Error('Error al actualizar la lista de participantes');
                }

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async AsignaturaMembers(asignaturaId) {
            try {
                //console.log("-->" + asignaturaId);
                const response = await axios.get('http://localhost:8080/obtenerMiembrosAsignatura', {
                    params: {
                        asignaturaId: asignaturaId
                    }
                });
                //console.log("Members de la asignatura:", response.data);
                const memberIdsAsString = response.data.map(member => member.toString());

                return memberIdsAsString;

            } catch (error) {
                console.error(error);
                return [];
            }
        }
    },
    computed: {
        // Filtra los usuarios basándose en el campo de búsqueda
        filteredUsers() {
            return this.users.filter(user => {
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                return fullName.includes(this.searchQuery.toLowerCase());
            });
        },
    },
};

</script>

<style scoped>
.input_alumnos {
    padding-left: 30px;
}

.round {
    width: 150%;
    margin-left: 10px;
}

.input-container_añadir {
    width: 100%;
    position: relative;
    margin-left: -20%;
}

.icon_añadir {
    position: absolute;
    right: 10px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
}

.input_añadir {
    width: 100%;
    height: 40px;
    padding: 10px;
    transition: .2s linear;
    border: 2.5px solid black;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;

}

.input_añadir:focus {
    outline: none;
    border: 0.5px solid black;
    box-shadow: -5px -5px 0px black;
}

.input-container_añadir:hover>.icon_añadir {
    animation: anim 1s linear infinite;
}

@keyframes anim {

    0%,
    100% {
        transform: translateY(calc(-50% - 5px)) scale(1);
    }

    50% {
        transform: translateY(calc(-50% - 5px)) scale(1.1);
    }
}

.container_check {
    --input-focus: #2d8cf0;
    --input-out-of-focus: #ccc;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #323232;
    position: relative;
    cursor: pointer;

}

.container_check input {
    position: absolute;
    opacity: 0;
}

.checkmark_check {
    width: 30px;
    height: 30px;
    position: relative;
    top: 0;
    left: 0;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    box-shadow: 4px 4px var(--main-color);
    background-color: var(--input-out-of-focus);
    transition: all 0.3s;
    margin-left: -5%;
}

.container_check input:checked~.checkmark_check {
    background-color: var(--input-focus);
}

.checkmark_check:after {
    content: "";
    width: 7px;
    height: 15px;
    position: absolute;
    top: 2px;
    left: 8px;
    display: none;
    border: solid var(--bg-color);
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg);
}

.container_check input:checked~.checkmark_check:after {
    display: block;
}

.botones_añadir {
    display: inline;
}

.dato_alumno {
    margin: 0 7px;
}

.listar_alumnos {
    margin-top: 1%;
    list-style-type: none;
    font-size: 1.2rem;
}

.hero__cta {
    text-decoration: none;
    color: #fff;
    border: 1px solid;
    border-radius: 6px;
    font-weight: 500;
    transition: background-color .3s;

}

.hero__cta:hover {
    background-color: var(--container-background-color);
    color: #1e3c72;
}

.modal__select_añadir {
    max-height: 220px;
    overflow-y: auto;
    width: 135%;
    margin-left: -30%;
}

.modal_añadir {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #111111bd;
    display: flex;
    opacity: 0;
    pointer-events: none;
    transition: opacity .6s .9s;
    --transform: translateY(-100vh);
    --transition: transform .8s;
}

.modal_añadir--show {
    opacity: 1;
    pointer-events: unset;
    transition: opacity .6s;
    --transform: translateY(0);
    --transition: transform .8s .8s;
}

.modal__container_añadir {
    margin: auto;
    width: 100%;
    max-width: 600px;
    max-height: 90%;
    background-color: var(--container-background-color);
    border-radius: 6px;
    padding: 1em 1em;
    display: grid;
    gap: 0.5em;
    place-items: center;
    grid-auto-columns: 100%;
    transform: var(--transform);
    transition: var(--transition);
}

.modal__title_añadir {
    font-size: 2.5rem;
}

.modal__img_añadir {
    width: 25%;
    max-width: 300px;
}

.modal_close_añadir,
.modal__close_añadir {
    text-decoration: none;
    color: #000;
    background-color: #06bfbf;
    padding: 1em 3em;
    border: 1px solid;
    border-radius: 6px;
    display: inline-block;
    font-weight: 600;
    transition: background-color .3s;
    margin: 0 5px;
}

.modal_close_añadir:hover,
.modal__close_añadir:hover {
    color: #000;
    background-color: #1f9b9b;
}

.actionButton[disabled] {
    background-color: #cccccc;
    cursor: not-allowed;
    color: #666666;
}

.profesorPage {
    padding: 2rem;
    margin: 60px auto;
    background-color: var(--background-color);
    color: #333;
    width: 80%;
    max-width: 1200px;
}

.dashboard {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
}

.dashboard button {
    margin-left: 5px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: var(--button-background-color);
    color: var(--text-color);
    cursor: pointer;
    font-size: 1rem;
}

.dashboard button:hover {
    background-color: var(--button-hover-background-color);
}

.mainContainer {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

.chartContainer,
.chartDataContainer {
    width: calc(50% - 10px);
    color: var(--text-color);
    height: 500px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--container-background-color);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    overflow: hidden;
}

.chartContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.chartContainer canvas {
    width: 100%;
    height: auto;
    max-width: 400px;
    max-height: 400px;
}

.chartDataContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
}

.chartDataContainer .charts {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-top: 40px;
}

.chartDataContainer .charts canvas {
    width: 100%;
    height: auto;
    max-height: 200px;
}

.chartDataContainer p {
    margin: 10px 0;
}

.bottomContainer {
    margin-top: 20px;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: var(--container-background-color);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

table,
th,
td {
    border: 1px solid var(--border-color);
    background-color: var(--container-background-color);
    color: var(--text-color);
}

th,
td {
    padding: 12px 15px;
    text-align: left;
    font-size: 0.9rem;
}

th {
    background-color: var(--container-background-color);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
}

.actionButton {
    margin: 5px 5px 5px 0;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
}

.actionButton.ban {
    color: var(--text-color);
    background-color: var(--table-button-color);
}

.actionButton.ban:hover {
    background-color: var(--button-hover-background-color);
}

.actionButton.expel {
    color: var(--text-color);
    background-color: var(--table-button-color);
}

.actionButton.expel:hover {
    background-color: var(--button-hover-background-color);
}

.actionButton.notify {
    color: var(--text-color);
    background-color: var(--table-button-color);
}

.actionButton.notify:hover {
    background-color: var(--button-hover-background-color);
}

.actionButton.view {
    color: var(--text-color);
    background-color: var(--table-button-color);
}

.actionButton.view:hover {
    background-color: var(--button-hover-background-color);
}

.peligro {
    background-color: rgba(255, 0, 0, 0.1);
}

.advertencia {
    background-color: rgba(255, 255, 0, 0.1);
}

.peligro-text {
    font-weight: bold;
    color: #FF0000;
}

.normal-text {
    font-weight: bold;
    color: #008000;

}

.advertencia-text {
    font-weight: bold;
    color: #f7d547;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: var(--container-background-color);
    color: var(--text-color);
    margin: auto;
    padding: 20px;
    width: 80%;
    max-width: 600px;
    border-radius: 10px;
    text-align: center;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: var(--text-color);
    text-decoration: none;
    cursor: pointer;
}

.modal-content ul {
    list-style: none;
    padding: 0;
}

.modal-content li {
    padding: 10px;
}

.modal-content li:last-child {
    border-bottom: none;
}

.modal-content i {
    margin-right: 10px;
}

.closeButton {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: var(--button-background-color);
    color: var(--text-color);
    cursor: pointer;
    font-size: 1rem;
}

.closeButton:hover {
    background-color: var(--button-hover-background-color);
}

.row-red {
    background-color: #E52B50;
}

.ban-text {
    color: white;
}

.desban {
    margin-left: 7vw;
    background-color: #008000;
}

@media (max-width: 1200px) {
    .profesorPage {
        width: 90%;
    }

    .mainContainer {
        flex-direction: column;
        align-items: center;
    }

    .chartContainer,
    .chartDataContainer {
        width: 100%;
        height: auto;
    }

    .chartDataContainer .charts {
        margin-top: 20px;
    }
}

@media (max-width: 768px) {
    .dashboard {
        flex-direction: column;
        align-items: center;
    }

    .dashboard button {
        width: 100%;
        margin-bottom: 10px;
    }

    .bottomContainer {
        overflow-x: auto;
    }

    table {
        width: 100%;
    }

    th,
    td {
        padding: 8px;
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .profesorPage {
        padding: 1rem;
    }

    h1,
    h2 {
        font-size: 1.5rem;
    }

    .dashboard button {
        font-size: 0.9rem;
    }

    th,
    td {
        font-size: 0.7rem;
    }

    .modal-content {
        width: 95%;
        padding: 10px;
    }

    .closeButton {
        padding: 8px 16px;
        font-size: 0.9rem;
    }

}

.containerTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.claseNumeroSesion {
    font-size: medium;
    color: gray;
}
</style>
