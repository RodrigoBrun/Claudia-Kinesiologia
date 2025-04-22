// ============================================
// Sistema centralizado para la Web de Claudia Llorente
// Maneja navegación, formularios y WhatsApp
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    class Sistema {
      constructor() {
        this.obtenerElementos();
        this.configurarEventos();
        this.inicializarTestLesion();
        this.configurarRestriccionHorarios();
        this.configurarLesionesInteractivo();
        this.configurarVerMasTratamientos(); // <-- Asegurate de tener esta línea ACTIVA
        this.adminPass = "claudia2025"; // clave provisoria, la podemos cambiar
      }

      obtenerElementos() {
        this.landing = document.querySelector('#landing');
        this.main = document.querySelector('#mainContent');
        this.kineBtn = document.querySelector('#enterKine');
        this.estBtn = document.querySelector('#enterEst');
        this.kineSection = document.querySelector('#kineSection');
        this.estSection = document.querySelector('#estSection');
        this.formKine = document.querySelector('#formKine');
        this.formEst = document.querySelector('#formEst');
        this.backBtns = document.querySelectorAll('.btnVolver');
        this.btnMostrarRegalo = document.querySelector('#mostrarRegalo');
        this.seccionRegalo = document.querySelector('#tarjetaRegalo');
        this.formRegalo = document.querySelector('#formRegalo');
        this.mensajeRegalo = document.querySelector('#mensajeRegaloEnviado');
        this.adminPanel = document.querySelector('#adminPanel');
      }

      configurarEventos() {
        let self = this;
      
        if (this.kineBtn) {
          this.kineBtn.addEventListener('click', () => self.mostrarSeccion('kine'));
        }
      
        if (this.estBtn) {
          this.estBtn.addEventListener('click', () => self.mostrarSeccion('est'));
        }
      
        if (this.formKine) {
          this.formKine.addEventListener('submit', async (e) => {
            e.preventDefault();
            await self.enviarWhatsApp('kine');
          });
        }
      
        if (this.formEst) {
          this.formEst.addEventListener('submit', (e) => {
            e.preventDefault();
            self.enviarWhatsApp('est');
          });
        }
      
        if (this.btnMostrarRegalo && this.seccionRegalo) {
          this.btnMostrarRegalo.addEventListener('click', () => {
            this.seccionRegalo.style.display = 'block';
            this.btnMostrarRegalo.style.display = 'none';
            this.seccionRegalo.scrollIntoView({ behavior: 'smooth' });
          });
        }
      
        if (this.formRegalo) {
          this.formRegalo.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarTarjetaRegalo();
          });
        }
      
        const fechaInput = document.querySelector('#fechaKine');
        if (fechaInput) {
          fechaInput.addEventListener('change', () => self.verificarTurnosOcupados());
        }
      
        this.backBtns.forEach(btn => {
          btn.addEventListener('click', () => self.volverInicio());
        });
      
        // 🔐 ADMIN MODAL
        const adminAccessBtn = document.querySelector('#adminAccess');
        const adminModal = document.querySelector('#adminLoginModal');
        const closeModal = document.querySelector('.close-modal');
        const ingresarBtn = document.querySelector('#btnIngresarAdmin');
        const cerrarAdminBtn = document.querySelector('#cerrarAdmin');
        this.adminPanel = document.querySelector('#adminPanel'); // asegurar acceso a adminPanel
      
        if (adminAccessBtn && adminModal && closeModal && ingresarBtn) {
          adminAccessBtn.addEventListener('click', () => {
            adminModal.style.display = 'flex';
          });
      
          closeModal.addEventListener('click', () => {
            adminModal.style.display = 'none';
          });
      
          window.addEventListener('click', (e) => {
            if (e.target === adminModal) {
              adminModal.style.display = 'none';
            }
          });
      
          ingresarBtn.addEventListener('click', () => {
            const pass = document.querySelector('#adminPass').value;
            if (pass === this.adminPass) {
              adminModal.style.display = 'none';
              this.adminPanel.style.display = 'block';
              this.cargarTurnosAdmin();
            } else {
              alert("Contraseña incorrecta");
            }
          });
        }
      
        // 👋 CERRAR MODO ADMIN
        if (cerrarAdminBtn) {
          cerrarAdminBtn.addEventListener('click', () => {
            this.adminPanel.style.display = 'none';
          });
        }
      }
      
      
      
      
      
  

      inicializarTestLesion() {
        let area = '', causa = '', dolor = '';
      
        const resultado = document.querySelector('#resultadoLesion');
        const sintomasInput = document.querySelector('#sintomas');
        const preguntas = document.querySelectorAll('#testLesion .pregunta');
      
        // Diccionario profesional de tratamientos sugeridos
        const recomendaciones = {
          cuello: ['TENS', 'acupuntura', 'puntos gatillo'],
          hombro: ['electrodos', 'kinesiología deportiva', 'ondas de choque'],
          espalda: ['termoterapia', 'ozono terapia', 'radiofrecuencia'],
          rodilla: ['presoterapia', 'vendaje funcional', 'ultrasonido'],
          tobillo: ['ultrasonido', 'vendajes', 'recuperación post-esguince'],
          otra: ['evaluación personalizada', 'consulta inicial con diagnóstico']
        };
      
        // Acción para todos los botones del test
        document.querySelectorAll('#testLesion .opcion').forEach(btn => {
          btn.addEventListener('click', () => {
      
            // Registrar respuesta
            if (btn.dataset.area) area = btn.dataset.area;
            if (btn.dataset.causa) causa = btn.dataset.causa;
            if (btn.dataset.dolor) dolor = btn.dataset.dolor;
      
            // Si es la respuesta final:
            if (btn.dataset.final === 'true') {
              const lista = recomendaciones[area] || recomendaciones.otra;
      
              // Crear devolución profesional
              const mensaje =
                `<strong>Resultado orientativo:</strong><br>
                Según tus respuestas, podrías estar presentando una molestia en <strong>${area}</strong>, causada por <strong>${causa}</strong> con dolor tipo <strong>${dolor}</strong>.<br><br>
                👉 <strong>Tratamientos sugeridos:</strong> ${lista.join(', ')}.<br><br>
                Este resultado no reemplaza una evaluación profesional.<br><em>Podés continuar con la reserva y se ajustará tu tratamiento tras la valoración inicial.</em>`;
      
              resultado.innerHTML = mensaje;
              resultado.style.display = 'block';
      
              // Precargar en campo de síntomas del formulario
              if (sintomasInput) {
                sintomasInput.value = `Molestia en ${area}, causa: ${causa}, dolor: ${dolor}. Sugerido: ${lista.join(', ')}.`;
              }
      
              // Scroll al formulario
              setTimeout(() => {
                document.querySelector('#formKine').scrollIntoView({ behavior: 'smooth' });
              }, 500);
            } else {
              // Avanzar a la siguiente pregunta
              const siguiente = document.getElementById(btn.dataset.next);
              if (siguiente) siguiente.style.display = 'block';
            }
      
            // Ocultar la pregunta actual
            btn.parentElement.style.display = 'none';
          });
        });
      }
      
      

      configurarRestriccionHorarios() {
        const fechaInput = document.querySelector('#fechaKine');
        const horaInput = document.querySelector('#horaKine');
      
        if (!fechaInput || !horaInput) return;
      
        fechaInput.addEventListener('change', () => {
          const fechaStr = fechaInput.value;
          if (!fechaStr) return;
      
          const fechaSeleccionada = new Date(fechaStr + 'T00:00:00');
          const dia = fechaSeleccionada.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
      
          let min = '';
          let max = '';
          let habilitado = true;
      
          switch (dia) {
            case 1: // Lunes
              // Dos turnos posibles: mañana y tarde
              // Para simplicidad, dejamos como rango completo
              min = '08:00';
              max = '17:00';
              break;
            case 2: // Martes
              min = '08:00';
              max = '14:00';
              break;
            case 3: // Miércoles
              min = '08:00';
              max = '18:00';
              break;
            case 4: // Jueves
              min = '08:00';
              max = '17:00';
              break;
            case 5: // Viernes
              min = '08:00';
              max = '14:00';
              break;
            default: // Sábado y domingo
              habilitado = false;
              break;
          }
      
          if (habilitado) {
            horaInput.disabled = false;
            horaInput.min = min;
            horaInput.max = max;
            horaInput.placeholder = '';
          } else {
            horaInput.disabled = true;
            horaInput.value = '';
            horaInput.placeholder = 'No disponible';
          }
        });
      }
      
      
      configurarVerMasTratamientos() {
        document.querySelectorAll('.ver-info-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const box = btn.closest('.tratamiento-box');
            const abierto = box.classList.contains('abierto');
      
            box.classList.toggle('abierto');
            btn.textContent = abierto ? '+ Ver más info' : '− Ocultar';
          });
        });
      }
      
      
      configurarLesionesInteractivo() {
        const botones = document.querySelectorAll('.ver-info-lesion');
        botones.forEach(btn => {
          btn.addEventListener('click', () => {
            const box = btn.closest('.lesion-box');
            box.classList.toggle('abierta');
            const abierto = box.classList.contains('abierta');
            btn.textContent = abierto ? '− Ocultar' : '+ Ver más info';
          });
        });
      }
      
      
      


      mostrarSeccion(tipo) {
        this.landing.style.display = 'none';
        this.main.style.display = 'block';
      
        // Ocultar ambas primero
        this.kineSection.style.display = 'none';
        this.estSection.style.display = 'none';
      
        // Mostrar la que corresponde
        if (tipo === 'kine') {
          this.kineSection.style.display = 'block';
          this.reiniciarAnimacion(this.kineSection);
        } else {
          this.estSection.style.display = 'block';
          this.reiniciarAnimacion(this.estSection);
        }
      }
  
      reiniciarAnimacion(elemento) {
        elemento.classList.remove('section');
        
        // Forzar reflow para reiniciar animación
        void elemento.offsetWidth;
        
        elemento.classList.add('section');
      }

      volverInicio() {
        this.main.style.display = 'none';
        this.kineSection.style.display = 'none';
        this.estSection.style.display = 'none';
        this.landing.style.display = 'flex';
      }
  
      async enviarWhatsApp(tipo) {
        let mensaje = '';
        let urlBase = 'https://wa.me/59899916753'; // Reemplazar con número de Claudia
        let mensajeExito;
      
        if (tipo === 'kine') {
          let nombre = document.querySelector('#nombreKine').value.trim();
          let fecha = document.querySelector('#fechaKine').value;
          let hora = document.querySelector('#horaKine').value;
          let sintomas = document.querySelector('#sintomas').value.trim();
      
          // 👉 Guardar en Firebase
          await db.collection('turnos').add({
            nombre: nombre,
            fecha: fecha,
            hora: hora,
            sintomas: sintomas,
            creado: new Date()
          });
      
          mensaje = `Hola Claudia, soy ${nombre}. Me gustaría agendar una sesión de kinesiología para el ${fecha} a las ${hora}.\n\nSíntomas: ${sintomas}`;
          mensajeExito = document.querySelector('#formKine + .mensaje-exito');
        }
      
        if (tipo === 'est') {
          let nombre = document.querySelector('#nombreEst').value.trim();
          let fecha = document.querySelector('#fechaEst').value;
          let tratamiento = document.querySelector('#tratamientoEst').value.trim();
          let consulta = document.querySelector('#consultaEst').value.trim();
      
          mensaje = `Hola Claudia, soy ${nombre}. Me gustaría reservar un turno de estética el día ${fecha}.\n\nTratamiento: ${tratamiento}\nConsulta: ${consulta}`;
          mensajeExito = document.querySelector('#formEst + .mensaje-exito');
        }
      
        // Mostrar mensaje visual
        if (mensajeExito) {
          mensajeExito.style.display = 'block';
          mensajeExito.style.opacity = '1';
      
          setTimeout(() => {
            mensajeExito.style.opacity = '0';
          }, 3000);
        }
      
        // Redirigir a WhatsApp
        let url = `${urlBase}?text=${encodeURIComponent(mensaje)}`;
        setTimeout(() => {
          window.open(url, '_blank');
        }, 1000);
      }
      


      enviarTarjetaRegalo() {
        let quien = document.querySelector('#quienRegala').value.trim();
        let para = document.querySelector('#quienRecibe').value.trim();
        let tratamiento = document.querySelector('#tratamientoRegalo').value.trim();
        let dedicatoria = document.querySelector('#dedicatoria').value.trim();
      
        // Mensaje para quien recibe el regalo
        let mensajeReceptor = `🎁 Hola ${para}! ${quien} te regaló un tratamiento en el Centro de Claudia Llorente 💆‍♀️✨\n\n🎀 Tratamiento: ${tratamiento}\n${dedicatoria ? `📝 Dedicatoria: ${dedicatoria}` : ''}\n\nCoordiná tu cita escribiendo a Claudia aquí: https://wa.me/598099123456`;
      
        // Mensaje para Claudia
        let mensajeClaudia = `🎁 Hola Claudia! Soy ${quien} y acabo de regalarle una sesión a ${para}.\n\n🎀 Tratamiento: ${tratamiento}\n${dedicatoria ? `📝 Dedicatoria: ${dedicatoria}` : ''}\n\nSolo para que estés al tanto 😊`;
      
        // Abrir WhatsApp para enviar el mensaje al destinatario (el usuario elige el contacto)
        let urlUsuario = `https://wa.me/?text=${encodeURIComponent(mensajeReceptor)}`;
        window.open(urlUsuario, '_blank');
      
        // Abrir WhatsApp para notificar a Claudia (número real de ella)
        let urlClaudia = `https://wa.me/598099123456?text=${encodeURIComponent(mensajeClaudia)}`;
        window.open(urlClaudia, '_blank');
      
        // Mostrar mensaje en pantalla
        this.mensajeRegalo.style.display = 'block';
      }
      
      

      async cargarHorariosDisponibles() {
        const fechaInput = document.querySelector('#fechaKine');
        const horaInput = document.querySelector('#horaKine');
        if (!fechaInput || !horaInput) return;
      
        const fecha = fechaInput.value;
        if (!fecha) return;
      
        // Formatear fecha como YYYY-MM-DD
        const fechaISO = new Date(fecha).toISOString().split('T')[0];
      
        // Obtener los turnos de ese día
        const snapshot = await db.collection('turnos')
          .where('fecha', '==', fechaISO)
          .get();
      
        const horasReservadas = [];
        snapshot.forEach(doc => {
          horasReservadas.push(doc.data().hora);
        });
      
        // Validar si la hora seleccionada ya fue reservada
        if (horasReservadas.includes(horaInput.value)) {
          horaInput.setCustomValidity("Este horario ya fue reservado.");
        } else {
          horaInput.setCustomValidity("");
        }
      
        // Mostramos sugerencia si hay
        if (horasReservadas.length > 0) {
          horaInput.title = `Horarios ocupados: ${horasReservadas.join(', ')}`;
        } else {
          horaInput.title = "";
        }
      }
      




      async verificarTurnosOcupados() {
        const fecha = document.querySelector('#fechaKine').value;
        const horaInput = document.querySelector('#horaKine');
      
        if (!fecha || !horaInput) return;
      
        // Obtener turnos ya reservados en Firebase
        const snapshot = await db.collection('turnos').where('fecha', '==', fecha).get();
        const horasOcupadas = snapshot.docs.map(doc => doc.data().hora);
      
        // Generar las horas posibles según el día seleccionado
        const dia = new Date(fecha + 'T00:00:00').getDay(); // 0=Dom, 1=Lun, etc.
        let opciones = [];
      
        if (dia === 1) opciones = ['08:00', '09:00', '10:00', '15:00', '16:00'];
        if (dia === 2) opciones = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
        if (dia === 3) opciones = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        if (dia === 4) opciones = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
        if (dia === 5) opciones = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
      
        // Limpiar y crear nuevas opciones en el input de hora
        horaInput.innerHTML = '';
        opciones.forEach(hora => {
          const option = document.createElement('option');
          option.value = hora;
          option.textContent = hora;
          if (horasOcupadas.includes(hora)) {
            option.disabled = true;
            option.textContent += ' (ocupado)';
          }
          horaInput.appendChild(option);
        });
      
        horaInput.disabled = opciones.length === 0;
      }
      


      async cargarTurnosAdmin() {
        const lista = document.querySelector('#listaTurnos');
        lista.innerHTML = '<p>Cargando turnos...</p>';
      
        try {
          const snapshot = await db.collection('turnos').orderBy('fecha').get();
      
          if (snapshot.empty) {
            lista.innerHTML = '<p>No hay turnos agendados.</p>';
            return;
          }
      
          lista.innerHTML = ''; // Limpiar
      
          snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement('div');
            div.innerHTML = `
              <strong>${data.fecha}</strong> a las <strong>${data.hora}</strong><br>
              <span>${data.nombre}</span> - ${data.sintomas || 'Sin descripción'}
              <br><button class="btnEliminar" data-id="${doc.id}">🗑 Eliminar</button>
            `;
            lista.appendChild(div);
          });
      
          // Escuchamos los botones de eliminar
          lista.querySelectorAll('.btnEliminar').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
      
              if (confirm("¿Estás seguro de que querés eliminar este turno?")) {
                try {
                  await db.collection('turnos').doc(id).delete();
                  btn.parentElement.remove(); // Lo quitamos del HTML
                } catch (err) {
                  alert('Error al eliminar el turno: ' + err.message);
                }
              }
            });
          });
      
        } catch (error) {
          lista.innerHTML = `<p>Error al cargar los turnos: ${error.message}</p>`;
        }
      }
      
      
      


      
    }
  
    // Inicializar clase
    new Sistema();
  });
  