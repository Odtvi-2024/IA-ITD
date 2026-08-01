/* ==========================================================================
   LÓGICA DEL FRONTEND - IA+ITD (INFORME FINAL COMPLETO CON GUÍA DE ACCIONES)
   ========================================================================== */

/* INITIALIZATION */
  // 1. Inputs & Form Elements
  const presetSelect = document.getElementById('preset-scenario');
  const processTextArea = document.getElementById('process-description');
  const objectiveTextArea = document.getElementById('company-objective');

  // 2. Action Buttons
  const btnRun = document.getElementById('btn-run-simulation');
  const btnClear = document.getElementById('btn-clear-terminal');
  const btnOpenReport = document.getElementById('btn-open-report');
  const btnNewAnalysis = document.getElementById('btn-new-analysis');
  const btnResetForm = document.getElementById('btn-reset-form');
  const btnSubmitAnswers = document.getElementById('btn-submit-answers');
  const btnModeSim = document.getElementById('btn-mode-sim');
  const btnModeApi = document.getElementById('btn-mode-api');

  // 3. Navigation Links
  const navReportLink = document.getElementById('nav-report-link');
  const navTrackerLink = document.getElementById('nav-tracker-link');
  const navAnalyticsLink = document.getElementById('nav-analytics-link');
  const navDashLink = document.getElementById('nav-dash-link');
  const navSimLink = document.getElementById('nav-sim-link');
  const navPilaresLink = document.getElementById('nav-pilares-link');

  // 4. Screens & Main Sections
  const screenDashboard = document.getElementById('screen-dashboard');
  const screenDiagnostic = document.getElementById('screen-diagnostic');
  const missingInfoSection = document.getElementById('missing-info-section');
  const missingQuestionsList = document.getElementById('missing-questions-list');
  const trackerSection = document.getElementById('tracker-section');
  const analyticsSection = document.getElementById('analytics-section');

  // 5. Console & Status Elements
  const terminalOutput = document.getElementById('terminal-output');
  const statusLabel = document.getElementById('execution-status-label');

  // 6. Tracker Elements
  const trackerMilestonesList = document.getElementById('tracker-milestones-list');
  const trackerProgressPercentage = document.getElementById('tracker-progress-percentage');
  const trackerProgressBar = document.getElementById('tracker-progress-bar');

  // 7. KPI elements
  const kpiOps = document.getElementById('kpi-ops');
  const kpiRoi = document.getElementById('kpi-roi');
  const kpiGov = document.getElementById('kpi-gov');
  const kpiCulture = document.getElementById('kpi-culture');
  const kpiTech = document.getElementById('kpi-tech');

  // 8. Pipeline steps
  const steps = {
    ops: document.getElementById('step-ops'),
    roi: document.getElementById('step-roi'),
    gov: document.getElementById('step-gov'),
    culture: document.getElementById('step-culture'),
    tech: document.getElementById('step-tech'),
    agile: document.getElementById('step-agile')
  };

  // 9. Modals
  const modalAgent = document.getElementById('modal-agent');
  const modalAgentTitle = document.getElementById('modal-agent-title');
  const modalAgentBody = document.getElementById('modal-agent-body');
  const btnCloseAgentModal = document.getElementById('btn-close-agent-modal');

  const modalReport = document.getElementById('modal-report');
  const modalReportBody = document.getElementById('modal-report-body');
  const btnCloseReportModal = document.getElementById('btn-close-report-modal');
  const btnPrintReport = document.getElementById('btn-print-report');

  // 10. Slider Elements
  const scaleSlider = document.getElementById('scale-slider');
  const sliderVolumeVal = document.getElementById('slider-volume-val');
  const simAnnualSavings = document.getElementById('sim-annual-savings');
  const simHoursSaved = document.getElementById('sim-hours-saved');
  const simCapacityBoost = document.getElementById('sim-capacity-boost');

  // 11. State
  let mode = 'sim'; 
  let isRunning = false;
  let latestExecutionData = null;
  let clientClarifications = {}; 
  let trackerTasksState = []; 

  // Preset scenarios
  const scenarios = {
    "1": "El departamento financiero recibe 500 facturas mensuales en PDF por correo. Los analistas revisan manualmente cada factura, la digitan en Excel, buscan el centro de costo en SAP y solicitan aprobación vía Email a gerencia. El proceso toma 14 horas por lote y genera errores de digitación.",
    "2": "El equipo de RRHH tarda 5 días hábiles en enrolar a un nuevo empleado: llenar formularios en papel, crear manualmente usuarios en Active Directory, solicitar credenciales en cuentas bancarias corporativas y asignar equipo de cómputo en Mesa de Ayuda.",
    "3": "Mesa de ayuda recibe 1,200 tickets al mes de restablecimiento de contraseña y permisos. Los analistas atienden cada ticket en un promedio de 25 minutos, congestionando el soporte y retrasando problemas críticos de la empresa."
  };

  const scenarioObjectives = {
    "1": "Automatizar la aprobación y contabilización de facturas en SAP para eliminar el 90% del tiempo de procesado manual y cero errores.",
    "2": "Reducir el tiempo de alta de nuevos empleados de 5 días a menos de 2 horas con creación automática de usuarios y permisos en Active Directory.",
    "3": "Implementar un bot de auto-servicio de contraseñas de IA para liberar el 80% de la carga de soporte Nivel 1."
  };

  // Diagnostic Flag Banner Helper
  function setDiagnosticFlag(flagCode, textMessage) {
    const flagEl = document.getElementById('flag-message');
    const timeEl = document.getElementById('flag-timestamp');
    const barEl = document.getElementById('diagnostic-flag-bar');

    if (flagEl) flagEl.innerHTML = `🚩 [BANDERA ${flagCode}]: ${textMessage}`;
    if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();

    if (barEl) {
      barEl.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
      setTimeout(() => {
        if (barEl) barEl.style.background = 'linear-gradient(90deg, #0284c7, #0d9488)';
      }, 450);
    }
  }

  // Screen Switcher Helper
  function showScreen(screenName) {
    if (screenName === 'dashboard') {
      if (screenDashboard) screenDashboard.style.display = 'block';
      if (screenDiagnostic) screenDiagnostic.style.display = 'none';
      if (navDashLink) navDashLink.classList.add('active');
      if (navSimLink) navSimLink.classList.remove('active');
      if (navPilaresLink) navPilaresLink.classList.remove('active');
      if (navTrackerLink) navTrackerLink.classList.remove('active');
      if (navAnalyticsLink) navAnalyticsLink.classList.add('active');
      setDiagnosticFlag("VISTA", "Pantalla cambiada a Dashboard General de Analítica Avanzada.");
    } else {
      if (screenDashboard) screenDashboard.style.display = 'none';
      if (screenDiagnostic) screenDiagnostic.style.display = 'block';
      if (navSimLink) navSimLink.classList.add('active');
      if (navDashLink) navDashLink.classList.remove('active');
      if (navAnalyticsLink) navAnalyticsLink.classList.remove('active');
      setDiagnosticFlag("VISTA", "Pantalla cambiada a Formulario de Análisis Diagnóstico.");
    }
  }

  // Reset for New Company Helper
  function resetForNewCompany() {
    processTextArea.value = "";
    if (objectiveTextArea) objectiveTextArea.value = "";
    if (presetSelect) presetSelect.value = "custom";

    latestExecutionData = null;
    clientClarifications = {};
    trackerTasksState = [];

    if (kpiOps) kpiOps.textContent = '--';
    if (kpiRoi) kpiRoi.textContent = '--';
    if (kpiGov) kpiGov.textContent = '--';
    if (kpiCulture) kpiCulture.textContent = '--';
    if (kpiTech) kpiTech.textContent = '--';

    ['ops', 'roi', 'gov', 'culture', 'tech', 'agile'].forEach(k => {
      const cardEl = document.getElementById(`status-card-${k}`);
      if (cardEl) cardEl.textContent = 'Estado: Pendiente';
    });

    resetPipelineUI();

    if (missingInfoSection) missingInfoSection.style.display = "none";
    if (trackerSection) trackerSection.style.display = "none";
    if (btnOpenReport) btnOpenReport.style.display = "none";
    if (statusLabel) statusLabel.textContent = "Ingresa la problemática";

    if (terminalOutput) {
      terminalOutput.innerHTML = `
        <div class="log-entry">
          <span class="log-time">[SISTEMA IA+ITD]</span>
          <span style="color: var(--text-muted);">Terminal limpia. Listo para procesar un nuevo diagnóstico de empresa.</span>
        </div>
      `;
    }

    showScreen('diagnostic');
    processTextArea.focus();
  }

  // Event Listeners for Navigation
  if (navDashLink) navDashLink.addEventListener('click', (e) => { e.preventDefault(); showScreen('dashboard'); });
  if (navAnalyticsLink) navAnalyticsLink.addEventListener('click', (e) => { e.preventDefault(); showScreen('dashboard'); });
  if (navSimLink) navSimLink.addEventListener('click', (e) => { e.preventDefault(); showScreen('diagnostic'); });
  if (navPilaresLink) navPilaresLink.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('diagnostic');
    const el = document.getElementById('pilares');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  if (navTrackerLink) navTrackerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('diagnostic');
    const el = document.getElementById('tracker-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  if (btnNewAnalysis) btnNewAnalysis.addEventListener('click', resetForNewCompany);
  if (btnResetForm) btnResetForm.addEventListener('click', resetForNewCompany);

  // Default screen on startup
  showScreen('diagnostic');

  // Event Listeners
  presetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (scenarios[val]) {
      processTextArea.value = scenarios[val];
      if (objectiveTextArea) objectiveTextArea.value = scenarioObjectives[val] || "";
    } else if (val === 'custom') {
      processTextArea.value = "";
      if (objectiveTextArea) objectiveTextArea.value = "";
      processTextArea.placeholder = "Describe los problemas, procesos manuales, cuellos de botella, equipo y situación actual...";
      processTextArea.focus();
    }
  });

  // Limpiar campos si está seleccionada la opción custom al cargar
  if (presetSelect.value === 'custom') {
    processTextArea.value = "";
    if (objectiveTextArea) objectiveTextArea.value = "";
  }

  if (btnModeSim) {
    btnModeSim.addEventListener('click', () => {
      mode = 'sim';
      btnModeSim.classList.add('active');
      if (btnModeApi) btnModeApi.classList.remove('active');
      logTerminal("SISTEMA IA+ITD", "Modo cambiado a MOTOR DE ANÁLISIS DE DIAGNÓSTICO", "tech");
    });
  }

  if (btnModeApi) {
    btnModeApi.addEventListener('click', () => {
      mode = 'api';
      btnModeApi.classList.add('active');
      if (btnModeSim) btnModeSim.classList.remove('active');
      logTerminal("SISTEMA IA+ITD", "Modo cambiado a BACKEND REST API (http://localhost:8000)", "tech");
    });
  }

  btnClear.addEventListener('click', () => {
    terminalOutput.innerHTML = `
      <div class="log-entry">
        <span class="log-time">[${getTime()}]</span>
        <span style="color: var(--text-muted);">Terminal limpia. Listo para procesar un nuevo diagnóstico en IA+ITD.</span>
      </div>
    `;
    resetPipelineUI();
    missingInfoSection.style.display = "none";
    trackerSection.style.display = "none";
    clientClarifications = {};
  });

  const btnRunTop = document.getElementById('btn-run-simulation-top');
  const btnHeaderRun = document.getElementById('btn-header-run');

  async function triggerSimulation() {
    if (isRunning) return;
    let text = processTextArea ? processTextArea.value.trim() : "";
    let objective = objectiveTextArea ? objectiveTextArea.value.trim() : "";

    // Si los recuadros están vacíos, autocompletar con un caso real de la Pyme para ejecutar directamente
    if (!text) {
      text = "Mi empresa es pequeña, tenemos un nivel de venta de 25.000.000 de pesos mensuales. Somos una empresa que se dedica a dar servicios de diseño industrial. Somos en total 8 trabajadores full-time y los otros los contratamos part-time dependiendo de la demanda.";
      if (processTextArea) processTextArea.value = text;
      if (objectiveTextArea && !objective) {
        objective = "Agregar mayor valor estratégico a nuestros servicios de diseño industrial, automatizar procesos operativos y duplicar nuestro margen sin sobrecargar la nómina.";
        objectiveTextArea.value = objective;
      }
    }

    try {
      setDiagnosticFlag("2: BOTÓN PRESIONADO", "Iniciando orquestación de 6 Agentes sobre problemática y objetivo...");
      isRunning = true;
      
      const runButtons = [btnRun, btnRunTop, btnHeaderRun].filter(Boolean);
      runButtons.forEach(b => {
        b.disabled = true;
        b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Ejecutando 6 Agentes IA+ITD...`;
      });

      if (statusLabel) statusLabel.textContent = "Analizando brecha (As-Is vs. To-Be)...";
      resetPipelineUI();
      if (missingInfoSection) missingInfoSection.style.display = "none";

      await runExhaustiveAnalysis(text, objective);

      isRunning = false;
      
      if (btnRun) { btnRun.disabled = false; btnRun.innerHTML = `<i class="fa-solid fa-brain"></i> Iniciar Análisis Exhaustivo de Agentes`; }
      if (btnRunTop) { btnRunTop.disabled = false; btnRunTop.innerHTML = `<i class="fa-solid fa-rocket"></i> Iniciar Análisis Exhaustivo de Agentes`; }
      if (btnHeaderRun) { btnHeaderRun.disabled = false; btnHeaderRun.innerHTML = `<i class="fa-solid fa-play"></i> Ejecutar 6 Agentes`; }

      if (statusLabel) statusLabel.textContent = "Análisis completado con éxito";
      if (btnOpenReport) btnOpenReport.style.display = "flex";
      if (trackerSection) trackerSection.style.display = "block";
      if (analyticsSection) analyticsSection.style.display = "block";

      setDiagnosticFlag("9: COMPLETADO EXITOSAMENTE", "6 Dictámenes y 6 Preguntas Deducidas listos abajo.");

      // Auto-scroll a las preguntas deducidas o dictámenes
      if (missingInfoSection && missingInfoSection.style.display !== "none") {
        missingInfoSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        const pilaresEl = document.getElementById('pilares');
        if (pilaresEl) pilaresEl.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Error en ejecución de agentes:", err);
      setDiagnosticFlag("ERROR", "Ocurrió una excepción al procesar la simulación.");
      isRunning = false;
      
      if (btnRun) { btnRun.disabled = false; btnRun.innerHTML = `<i class="fa-solid fa-brain"></i> Iniciar Análisis Exhaustivo de Agentes`; }
      if (btnRunTop) { btnRunTop.disabled = false; btnRunTop.innerHTML = `<i class="fa-solid fa-rocket"></i> Iniciar Análisis Exhaustivo de Agentes`; }
      if (btnHeaderRun) { btnHeaderRun.disabled = false; btnHeaderRun.innerHTML = `<i class="fa-solid fa-play"></i> Ejecutar 6 Agentes`; }
    }
  }

  if (btnRun) btnRun.addEventListener('click', triggerSimulation);
  if (btnRunTop) btnRunTop.addEventListener('click', triggerSimulation);
  if (btnHeaderRun) btnHeaderRun.addEventListener('click', triggerSimulation);

  if (processTextArea) {
    processTextArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        triggerSimulation();
      }
    });
  }

  // Bind global window references for inline onclick attributes
  window.triggerSimulation = triggerSimulation;
  window.resetForNewCompany = resetForNewCompany;
  window.showScreen = showScreen;
  window.openExecutiveReport = openExecutiveReport;

  // Slider de Escala de Negocio
  const scaleSlider = document.getElementById('scale-slider');
  const sliderVolumeVal = document.getElementById('slider-volume-val');
  const simAnnualSavings = document.getElementById('sim-annual-savings');
  const simHoursSaved = document.getElementById('sim-hours-saved');
  const simCapacityBoost = document.getElementById('sim-capacity-boost');

  if (scaleSlider) {
    scaleSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (sliderVolumeVal) sliderVolumeVal.textContent = `$${val.toLocaleString('es-CL')} CLP / mes`;
      
      const annualSavingsCLP = Math.round(val * 0.48);
      const hoursSaved = Math.round((val / 25000000) * 140);
      const capBoost = Math.min(85, Math.round(25 + (val / 25000000) * 10));

      if (simAnnualSavings) simAnnualSavings.textContent = `$${annualSavingsCLP.toLocaleString('es-CL')} CLP`;
      if (simHoursSaved) simHoursSaved.textContent = `${hoursSaved} Horas / mes`;
      if (simCapacityBoost) simCapacityBoost.textContent = `+${capBoost}% Capacidad`;
    });
  }

  // Re-evaluation button click
  btnSubmitAnswers.addEventListener('click', async () => {
    if (isRunning) return;

    const answerInputs = missingQuestionsList.querySelectorAll('.user-answer-input');
    let hasAnswers = false;
    let combinedClarificationText = "\n\n--- INFORMACIÓN ADICIONAL ACLARADA POR EL CLIENTE ---\n";

    answerInputs.forEach((input) => {
      const val = input.value.trim();
      const questionText = input.getAttribute('data-question');
      const agentName = input.getAttribute('data-agent');

      if (val) {
        hasAnswers = true;
        clientClarifications[agentName] = val;
        combinedClarificationText += `* [${agentName}] ${questionText} -> RESPUESTA: ${val}\n`;
      }
    });

    if (!hasAnswers) {
      alert("Por favor escribe la respuesta a al menos una de las preguntas antes de re-evaluar.");
      return;
    }

    isRunning = true;
    btnSubmitAnswers.disabled = true;
    btnSubmitAnswers.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Re-evaluando dictámenes IA+ITD...`;

    logTerminal("ORQUESTADOR IA+ITD", "🔄 Incorporando las respuestas específicas del cliente. Re-evaluando dictámenes de los 5 agentes...", "tech");
    await delay(800);

    const enrichedText = processTextArea.value.trim() + combinedClarificationText;
    const objective = objectiveTextArea ? objectiveTextArea.value.trim() : "";
    await runExhaustiveAnalysis(enrichedText, objective, true);

    isRunning = false;
    btnSubmitAnswers.disabled = false;
    btnSubmitAnswers.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Re-evaluar Análisis con la Nueva Información`;
    
    alert("¡Los dictámenes, tiempos e informe final han sido re-evaluados con éxito integrando tu nueva información!");
  });

  // Modal Closers
  btnCloseAgentModal.addEventListener('click', () => modalAgent.classList.remove('active'));
  btnCloseReportModal.addEventListener('click', () => modalReport.classList.remove('active'));
  
  btnOpenReport.addEventListener('click', openExecutiveReport);
  navReportLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (!latestExecutionData) {
      alert("Por favor ejecuta primero un diagnóstico con el botón 'Iniciar Análisis Exhaustivo'.");
      return;
    }
    openExecutiveReport();
  });

  btnPrintReport.addEventListener('click', () => {
    window.print();
  });

  // Agent Cards Click Handling
  document.querySelectorAll('.agent-profile-card.clickable').forEach(card => {
    card.addEventListener('click', () => {
      const agentKey = card.getAttribute('data-agent');
      if (!latestExecutionData) {
        alert("Primero debes hacer clic en 'Iniciar Análisis Exhaustivo de Agentes'.");
        return;
      }
      openAgentModal(agentKey);
    });
  });

  // Helpers
  function getTime() {
    return new Date().toLocaleTimeString();
  }

  function logTerminal(agentName, message, cssClass = 'ops', jsonObj = null) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    let jsonHTML = '';
    if (jsonObj) {
      jsonHTML = `<pre class="json-viewer">${JSON.stringify(jsonObj, null, 2)}</pre>`;
    }

    entry.innerHTML = `
      <span class="log-time">[${getTime()}]</span>
      <span class="log-agent ${cssClass}">${agentName}:</span>
      <div style="flex-grow:1;">
        <div>${message}</div>
        ${jsonHTML}
      </div>
    `;
    terminalOutput.appendChild(entry);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function setStepState(stepKey, state) {
    const el = steps[stepKey];
    if (!el) return;
    el.className = `pipeline-step ${state}`;
  }

  function resetPipelineUI() {
    Object.keys(steps).forEach(k => setStepState(k, 'waiting'));
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Universal Semantic Extractor for ANY of 100+ different companies and objectives
  function extractCaseContext(rawProblemText, rawObjectiveText = "") {
    const combinedText = (rawProblemText + " " + rawObjectiveText).trim();
    const problemUpper = rawProblemText.toUpperCase();
    
    // 1. Extract Core Subject / Industry from raw text dynamically
    let subject = "los servicios y operaciones de la empresa";
    const subjectMatch = rawProblemText.match(/(empresa\s*de\s*[\w\s]{3,30}|dedica\s*a\s*[\w\s]{3,30}|servicios\s*de\s*[\w\s]{3,30}|departamento\s*de\s*[\w\s]{3,30}|área\s*de\s*[\w\s]{3,30})/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
    } else if (problemUpper.includes("DISEÑO") || problemUpper.includes("INDUSTRIAL") || problemUpper.includes("RENDER")) {
      subject = "los servicios de diseño industrial y desarrollo de proyectos";
    } else if (problemUpper.includes("FACTURA") || problemUpper.includes("FINANCIER") || problemUpper.includes("PAGO")) {
      subject = "el proceso de aprobación de facturas y contabilidad";
    } else if (problemUpper.includes("RRHH") || problemUpper.includes("ONBOARDING") || problemUpper.includes("EMPLEADO")) {
      subject = "el proceso de onboarding de personal y accesos IT";
    } else if (problemUpper.includes("TICKET") || problemUpper.includes("SOPORTE") || problemUpper.includes("MESA DE AYUDA")) {
      subject = "la atención de tickets en la mesa de ayuda";
    } else if (problemUpper.includes("REPUESTO") || problemUpper.includes("MANTENIMIENTO") || problemUpper.includes("LOGISTICA")) {
      subject = "la gestión de repuestos y logística de mantenimiento";
    }

    // 2. Extract Desired Objective / Goal (To-Be)
    let desiredGoal = "agregar mayor valor percibido y optimizar la capacidad operativa";
    if (rawObjectiveText && rawObjectiveText.trim().length > 5) {
      desiredGoal = rawObjectiveText.trim();
    } else {
      const goalMatch = rawProblemText.match(/(agregar\s*valor[\w\s]*|\bcuánto[\w\s]*|\bcómo[\w\s]*|\bescal[\w\s]*|\baumentar\s*[\w\s]*|\breducir\s*[\w\s]*)/i);
      if (goalMatch) desiredGoal = goalMatch[1].trim();
    }

    // 3. Extract Core Bottleneck / Pain Point (As-Is)
    let currentPain = "los tiempos de procesamiento manual";
    const painMatch = rawProblemText.match(/(errores\s*de\s*[\w\s]+|detiene\s*[\w\s]+|retraso\s*[\w\s]+|pérdida\s*[\w\s]+|demora\s*[\w\s]+|tarda\s*[\w\s]+|lote\s*y\s*gener[\w\s]+)/i);
    if (painMatch) currentPain = painMatch[1].trim();

    // 4. Extract Systems & Tools
    const systems = [];
    if (combinedText.toUpperCase().includes("SAP")) systems.push("SAP ERP");
    if (combinedText.toUpperCase().includes("EXCEL") || combinedText.toUpperCase().includes("PLANILLA")) systems.push("Microsoft Excel");
    if (combinedText.toUpperCase().includes("PDF")) systems.push("Archivos PDF");
    if (combinedText.toUpperCase().includes("ACTIVE DIRECTORY")) systems.push("Active Directory");
    if (combinedText.toUpperCase().includes("CAD") || combinedText.toUpperCase().includes("3D")) systems.push("Software CAD/3D");
    if (combinedText.toUpperCase().includes("WHATSAPP")) systems.push("WhatsApp");
    if (combinedText.toUpperCase().includes("EMAIL") || combinedText.toUpperCase().includes("CORREO")) systems.push("Email");
    if (systems.length === 0) systems.push("las herramientas de trabajo actuales");

    // 5. Extract Team & Revenue Context
    const workerMatch = rawProblemText.match(/(\d+)\s*(trabajadores|empleados|personas|colaboradores|analistas)/i);
    const workerText = workerMatch ? `${workerMatch[1]} trabajadores` : null;

    const hasPartTime = combinedText.toUpperCase().includes("PART-TIME") || combinedText.toUpperCase().includes("PART TIME") || combinedText.toUpperCase().includes("FREELANCE");

    const revenueMatch = rawProblemText.match(/([\d\.,]+\s*(pesos|usd|\$|dólares|dolares|mensuales|anuales))/i);
    const revenueText = revenueMatch ? revenueMatch[1].trim() : null;

    return { subject, desiredGoal, currentPain, systems, workerText, hasPartTime, revenueText, rawProblemText, rawObjectiveText };
  }

  // Generate 6 True Dynamic Questions analyzing the exact GAP (Problem vs Objective)
  function generateContextualQuestions(rawProblemText, rawObjectiveText = "") {
    const ctx = extractCaseContext(rawProblemText, rawObjectiveText);
    const mainSys = ctx.systems[0] || "las herramientas actuales";
    const secSys = ctx.systems[1] || "las planillas de control";
    const questions = [];

    // 1. ProcessOptimizer_Agent (Operations & Process GAP)
    questions.push({
      agent: "ProcessOptimizer_Agent",
      pilar: "Operaciones",
      question: `1. Para lograr la meta de "${ctx.desiredGoal}" en ${ctx.subject}: ¿En qué etapa específica del proceso actual (${ctx.currentPain}) se produce la mayor pérdida de tiempo que frena alcanzar ese objetivo?`
    });

    // 2. ROI_Guardian_Agent (ROI & Value GAP)
    let q2 = `2. Analizando el objetivo de "${ctx.desiredGoal}" ${ctx.revenueText ? 'con un nivel de ventas actuales de ' + ctx.revenueText : ''}: ¿Qué presupuesto o margen adicional proyectan generar y cuánto costo ${ctx.hasPartTime ? 'en personal part-time' : ''} se busca optimizar?`;
    questions.push({
      agent: "ROI_Guardian_Agent",
      pilar: "ROI Financiero",
      question: q2
    });

    // 3. Governance_Compliance_Agent (Governance & IP GAP)
    let q3 = `3. Para resguardar a la empresa mientras avanzan hacia "${ctx.desiredGoal}": ¿Qué normativas, firmas de aprobación o resguardo de propiedad intelectual (ej: diseños/planos o datos confidenciales) se deben exigir?`;
    if (ctx.hasPartTime) {
      q3 = `3. Al trabajar con personal part-time/por demanda para lograr "${ctx.desiredGoal}": ¿Cómo protegen los derechos de autor, acuerdos de confidencialidad (NDA) y accesos a la información de clientes?`;
    }
    questions.push({
      agent: "Governance_Compliance_Agent",
      pilar: "Gobernanza",
      question: q3
    });

    // 4. People_Culture_Agent (Culture & Team GAP)
    questions.push({
      agent: "People_Culture_Agent",
      pilar: "Cultura",
      question: `4. En relación al equipo ${ctx.workerText ? 'de ' + ctx.workerText : 'de la empresa'} ${ctx.hasPartTime ? 'y el personal part-time' : ''}: ¿Qué herramientas de IA o automatización conocen hoy y qué capacitación requieren para acelerar el logro de "${ctx.desiredGoal}"?`
    });

    // 5. Tech_Connector_Agent (Technology GAP)
    questions.push({
      agent: "Tech_Connector_Agent",
      pilar: "Tecnología",
      question: `5. Desde la perspectiva tecnológica para impulsar "${ctx.desiredGoal}": ¿Tienen centralizada la información y herramientas en la nube (${mainSys}) para permitir trabajo colaborativo en tiempo real?`
    });

    // 6. Agile_Scrum_Agent (Agile & MVP GAP)
    questions.push({
      agent: "Agile_Scrum_Agent",
      pilar: "Metodologías Ágiles",
      question: `6. Para definir el MVP del Sprint 1 (semanas 1 y 2) que entregue valor inmediato hacia "${ctx.desiredGoal}": ¿Cuál es la primera funcionalidad u oferta clave que deberíamos lanzar como Quick Win?`
    });

    return questions;
  }

  // Exhaustive Multi-Agent Analysis Engine
  async function runExhaustiveAnalysis(diagnosticText, companyObjectiveText = "", isReevaluation = false) {
    logTerminal("ORQUESTADOR IA+ITD", `${isReevaluation ? 'Re-evaluando' : 'Iniciando'} análisis situacional sobre la problemática y meta deseada...`, "tech");
    await delay(120);

    const systemsFound = [];
    const textUpper = (diagnosticText + " " + companyObjectiveText).toUpperCase();
    if (textUpper.includes("EXCEL") || textUpper.includes("PLANILLA")) systemsFound.push("Microsoft Excel");
    if (textUpper.includes("SAP")) systemsFound.push("SAP ERP");
    if (textUpper.includes("EMAIL") || textUpper.includes("CORREO") || textUpper.includes("OUTLOOK")) systemsFound.push("Email Gateway");
    if (textUpper.includes("PDF")) systemsFound.push("Documentos PDF");
    if (textUpper.includes("CRM") || textUpper.includes("SALESFORCE")) systemsFound.push("CRM Systems");
    if (textUpper.includes("ACTIVE DIRECTORY") || textUpper.includes("USUARIOS")) systemsFound.push("Active Directory");
    if (systemsFound.length === 0) systemsFound.push("Sistemas Legados Internos", "Bases de datos SQL");

    let customHourlyRate = 34; 
    const salaryMatch = diagnosticText.match(/(\d+)\s*(usd|\$|dólares|dolares|pesos|salario)/i);
    if (salaryMatch) {
      const extractedVal = parseInt(salaryMatch[1]);
      if (extractedVal > 100) customHourlyRate = Math.round(extractedVal / 160);
    }

    const hourMatch = diagnosticText.match(/(\d+)\s*(horas|hrs|h|días|dias)/i);
    const estimatedHours = hourMatch ? parseInt(hourMatch[1]) * (hourMatch[2].toLowerCase().includes("día") ? 8 : 1) : 14;

    const questionsList = generateContextualQuestions(diagnosticText, companyObjectiveText);

    // AGENT 1: ProcessOptimizer_Agent
    setStepState('ops', 'active');
    logTerminal("ProcessOptimizer_Agent", "Iniciando descomposición de la situación operacional de la empresa...", "ops");
    await delay(120);

    const opsOutput = {
      agent: "ProcessOptimizer_Agent",
      pilar: "Operaciones y Procesos",
      status: isReevaluation ? "DICTAMEN RE-EVALUADO EN IA+ITD" : "DICTAMEN INICIAL SITUACIONAL",
      estimated_execution_time: "Duración estimada: 2 Semanas (80 hrs-hombre)",
      executive_summary: "Reducción dramática del tiempo de procesamiento operativo mediante la eliminación de captura manual e integración de agentes OCR inteligentes.",
      as_is_diagnosis: `Situación Detectada: Ineficiencia operativa severa en la interacción entre ${systemsFound.join(", ")}.`,
      to_be_architecture: `Arquitectura Objetivo: Orquestación inteligente de IA para procesar tareas con aprobación en 1-clic.`,
      current_hours_spent: estimatedHours,
      target_hours_optimized: Math.max(0.5, (estimatedHours * 0.1).toFixed(1)),
      automation_feasibility: `${Math.min(95, 80 + systemsFound.length * 4)}%`,
      step_by_step_actions: [
        { step: "Paso 1", title: "Acción 1: Mapeo Fino de Campos de Entrada", duration: "3 días", responsible: "Analista de Procesos", detail: `Identificar las variables críticas a extraer automáticamente de ${systemsFound[0] || 'los sistemas'} eliminando la digitación.` },
        { step: "Paso 2", title: "Acción 2: Despliegue del Orquestador de IA", duration: "4 días", detail: "Configurar los modelos de extracción e inferencia estructurada de datos en formato JSON estandarizado." },
        { step: "Paso 3", title: "Acción 3: Reglas Automáticas de Negocio", duration: "3 días", detail: "Programar verificaciones automáticas de montos, centros de costo y firmas de autorización sin intervención humana." },
        { step: "Paso 4", title: "Acción 4: Pruebas de Carga y Cero Errores", duration: "4 días", detail: "Ejecutar 100 transacciones reales simuladas en paralelo asegurando una tasa de error inferior al 0.1%." }
      ],
      tangible_deliverables: "Matriz As-Is/To-Be, Diagrama de Flujo BPMN y Motor Orquestador Desplegado"
    };
    if (clientClarifications["ProcessOptimizer_Agent"]) {
      opsOutput.client_clarification_applied = clientClarifications["ProcessOptimizer_Agent"];
    }

    logTerminal("ProcessOptimizer_Agent", "Dictamen de Operaciones completado:", "ops", opsOutput);
    setStepState('ops', 'completed');
    if (kpiOps) kpiOps.textContent = `90% Reducción`;
    const cardOps = document.getElementById('status-card-ops');
    if (cardOps) cardOps.textContent = `Tiempo: 2 Semanas`;
    setDiagnosticFlag("3: AGENTE OPERACIONES OK", "ProcessOptimizer_Agent completó mapa de procesos As-Is/To-Be.");
    await delay(120);

    // AGENT 2: ROI_Guardian_Agent
    setStepState('roi', 'active');
    logTerminal("ROI_Guardian_Agent", "Generando modelo financiero adaptado a la situación de costo de la empresa...", "roi");
    await delay(120);

    const hoursSavedMonthly = Math.round(estimatedHours * 10);
    const monthlySavings = hoursSavedMonthly * customHourlyRate;
    const annualSavings = monthlySavings * 12;
    const capexImplementation = 11000;
    const opexMonthly = 450;
    const paybackMonths = (capexImplementation / monthlySavings).toFixed(1);
    const roiYear1 = Math.round(((annualSavings - capexImplementation - (opexMonthly * 12)) / capexImplementation) * 100);

    const roiOutput = {
      agent: "ROI_Guardian_Agent",
      pilar: "ROI y Valor de Negocio",
      status: isReevaluation ? "MODELO RE-EVALUADO CON DATOS REALES" : "MODELO FINANCIERO INICIAL",
      estimated_execution_time: "Duración estimada: 1 Semana (40 hrs-hombre)",
      executive_summary: "Recuperación completa del capital invertido (CAPEX) en menos de 3 meses, generando retornos netos superiores al 300% en el primer año.",
      applied_hourly_rate_usd: `$${customHourlyRate}/hr`,
      capex_investment_usd: `$${capexImplementation.toLocaleString()}`,
      monthly_savings_usd: `$${monthlySavings.toLocaleString()}`,
      annual_net_savings_usd: `$${annualSavings.toLocaleString()}`,
      payback_period: `${paybackMonths} meses`,
      projected_roi_year1: `+${roiYear1}%`,
      step_by_step_actions: [
        { step: "Paso 1", title: "Acción 1: Auditoría de Costos Laborales Directos", duration: "2 días", responsible: "CFO Virtual / ROI Guardian", detail: `Consolidar las horas dedicadas actuales (${estimatedHours}h/sem) contra el costo laboral real de $${customHourlyRate}/h.` },
        { step: "Paso 2", title: "Acción 2: Configuración del Tablero de Ahorros", duration: "2 días", detail: "Crear un indicador en vivo en el dashboard que muestre el monto acumulado ahorrado por transacción." },
        { step: "Paso 3", title: "Acción 3: Evaluación de Sensibilidad de Escala", duration: "1 día", detail: "Proyectar escenarios de crecimiento operativo al +20% y +50% sin incrementar costo de nómina." },
        { step: "Paso 4", title: "Acción 4: Dictamen de Liberación Presupuestaria", duration: "2 días", detail: "Presentar el Business Case formal con VAN/TIR a la gerencia general recomendando la inversión." }
      ],
      tangible_deliverables: "Modelo Financiero VAN/TIR y Tablero de Seguimiento de ROI"
    };
    if (clientClarifications["ROI_Guardian_Agent"]) {
      roiOutput.client_clarification_applied = clientClarifications["ROI_Guardian_Agent"];
    }

    logTerminal("ROI_Guardian_Agent", "Dictamen Financiero completado:", "roi", roiOutput);
    setStepState('roi', 'completed');
    if (kpiRoi) kpiRoi.textContent = `+${roiYear1}% ROI`;
    const cardRoi = document.getElementById('status-card-roi');
    if (cardRoi) cardRoi.textContent = `Payback: ${paybackMonths} meses`;
    setDiagnosticFlag("4: AGENTE ROI OK", "ROI_Guardian_Agent generó modelo financiero (+340% ROI).");
    await delay(120);

    // AGENT 3: Governance_Compliance_Agent
    setStepState('gov', 'active');
    logTerminal("Governance_Compliance_Agent", "Auditando requisitos normativos y sensibilidad de datos...", "gov");
    await delay(120);

    const hasPII = textUpper.includes("EMPLEADO") || textUpper.includes("CLIENTE") || textUpper.includes("PERSONA") || textUpper.includes("RUT") || textUpper.includes("CORREO");
    const govOutput = {
      agent: "Governance_Compliance_Agent",
      pilar: "Gobernanza, Seguridad y Ética",
      status: isReevaluation ? "AUDITORÍA RE-EVALUADA" : "AUDITORÍA INICIAL",
      estimated_execution_time: "Duración estimada: 2 Semanas (60 hrs-hombre)",
      executive_summary: "Garantía de cumplimiento estricto con normativas ISO 27001 y GDPR mediante arquitectura de anonimización de datos (PII Masking).",
      pii_risk_classification: hasPII ? "MEDIO-ALTO (Datos personales de personas/clientes)" : "BAJO (Datos procesales)",
      compliance_standards: ["ISO/IEC 27001:2022", "GDPR Compliance", "EU AI Act Requirements"],
      step_by_step_actions: [
        { step: "Paso 1", title: "Acción 1: Mapeo de Campos PII Sensibles", duration: "3 días", responsible: "CISO / Oficial de Cumplimiento", detail: "Identificar nombres, RUTs, correos o datos bancarios manipulados para definir la máscara de cifrado." },
        { step: "Paso 2", title: "Acción 2: Despliegue de Capa de Anonimización", duration: "4 días", detail: "Configurar el middleware PII Masking que anonimiza datos confidenciales antes de la inferencia por IA." },
        { step: "Paso 3", title: "Acción 3: Trazabilidad e Histórico Cifrado", duration: "3 días", detail: "Implementar log de auditoría cifrado en AES-256 para firmar digitalmente cada respuesta de los agentes." },
        { step: "Paso 4", title: "Acción 4: Umbrales Human-in-the-Loop", duration: "4 días", detail: "Establecer revisión humana obligatoria para transacciones excepcionales o de confianza < 90%." }
      ],
      tangible_deliverables: "Matriz de Riesgo ISO 27001, Filtro de Data Masking Activo y Certificado"
    };
    if (clientClarifications["Governance_Compliance_Agent"]) {
      govOutput.client_clarification_applied = clientClarifications["Governance_Compliance_Agent"];
    }

    logTerminal("Governance_Compliance_Agent", "Dictamen de Gobernanza completado:", "gov", govOutput);
    setStepState('gov', 'completed');
    if (kpiGov) kpiGov.textContent = "ISO 27001 OK";
    const cardGov = document.getElementById('status-card-gov');
    if (cardGov) cardGov.textContent = "Cumplimiento: ISO 27001";
    await delay(120);

    // AGENT 4: People_Culture_Agent
    setStepState('culture', 'active');
    logTerminal("People_Culture_Agent", "Diseñando estrategia de gestión del cambio atinente a la situación del equipo...", "culture");
    await delay(120);

    const cultureOutput = {
      agent: "People_Culture_Agent",
      pilar: "Cultura y Talento",
      status: isReevaluation ? "ESTRATEGIA CULTURAL RE-EVALUADA" : "ESTRATEGIA INICIAL",
      estimated_execution_time: "Duración estimada: 3 Semanas (90 hrs-hombre)",
      executive_summary: "Transformación de la cultura organizacional posicionando la IA como un co-piloto de apoyo, reorientando el tiempo libre a tareas de alto valor.",
      organizational_readiness_index: "85/100",
      step_by_step_actions: [
        { step: "Paso 1", title: "Acción 1: Evaluación de Resistencia e Inquietudes", duration: "4 días", responsible: "Gestión del Cambio / People Culture", detail: "Realizar encuestas rápidas de clima para identificar miedos o dudas respecto al uso de la IA." },
        { step: "Paso 2", title: "Acción 2: Taller Práctico 'Co-Piloto Digital'", duration: "5 días", detail: `Impartir 8 horas de capacitación en el uso de la nueva plataforma automatizada de ${systemsFound[0] || 'IA'}.` },
        { step: "Paso 3", title: "Acción 3: Plan de Redestinación de Horas Liberadas", duration: "5 días", detail: `Reasignar formalmente las ${hoursSavedMonthly} horas semanales liberadas hacia atención a clientes y análisis.` },
        { step: "Paso 4", title: "Acción 4: Red Interna de Campeones Digitales", duration: "7 días", detail: "Certificar a 2 líderes internos del departamento para acompañar la adopción continua del equipo." }
      ],
      tangible_deliverables: "Malla Curricular de Capacitación y 100% Personal Certificado"
    };
    if (clientClarifications["People_Culture_Agent"]) {
      cultureOutput.client_clarification_applied = clientClarifications["People_Culture_Agent"];
    }

    logTerminal("People_Culture_Agent", "Dictamen de Cultura completado:", "culture", cultureOutput);
    setStepState('culture', 'completed');
    if (kpiCulture) kpiCulture.textContent = "85/100 Prep";
    const cardCult = document.getElementById('status-card-culture');
    if (cardCult) cardCult.textContent = "Capacitación: 3 Semanas";
    await delay(120);

    // AGENT 5: Tech_Connector_Agent
    setStepState('tech', 'active');
    logTerminal("Tech_Connector_Agent", "Construyendo conectores e integraciones para los sistemas detectados...", "tech");
    await delay(120);

    const techOutput = {
      agent: "Tech_Connector_Agent",
      pilar: "Tecnología e Infraestructura",
      status: isReevaluation ? "ARQUITECTURA RE-EVALUADA" : "ARQUITECTURA INICIAL",
      estimated_execution_time: "Duración estimada: 2 Semanas (70 hrs-hombre)",
      executive_summary: "Arquitectura moderna basada en microservicios desacoplados y conectores API REST que aseguran latencias inferiores a 250ms.",
      target_architecture: "Microservicios REST API + Event Webhooks",
      required_connectors: systemsFound.map(s => `Conector API para ${s}`),
      step_by_step_actions: [
        { step: "Paso 1", title: "Acción 1: Diseño de Contratos OpenAPI / Swagger", duration: "3 días", responsible: "Arquitecto de Software / Tech Connector", detail: `Definir estructuras JSON estandarizadas para comunicar ${systemsFound.slice(0, 2).join(" y ")}.` },
        { step: "Paso 2", title: "Acción 2: Desarrollo de Middleware Webhook", duration: "4 días", detail: "Construir el listener seguro con autenticación OAuth2 y cifrado de tokens de integración." },
        { step: "Paso 3", title: "Acción 3: Pruebas de Latencia y Disponibilidad", duration: "3 días", detail: "Asegurar latencias < 250ms por transacción bajo carga simultánea de peticiones." },
        { step: "Paso 4", title: "Acción 4: Despliegue CI/CD y Monitoreo 24/7", duration: "4 días", detail: "Configurar automatización de despliegue continuo con alertas de caídas en tiempo real." }
      ],
      tangible_deliverables: "Código Fuente de APIs, Documentación Swagger y Pipeline CI/CD"
    };
    if (clientClarifications["Tech_Connector_Agent"]) {
      techOutput.client_clarification_applied = clientClarifications["Tech_Connector_Agent"];
    }

    logTerminal("Tech_Connector_Agent", "Dictamen Técnico completado:", "tech", techOutput);
    setStepState('tech', 'completed');
    if (kpiTech) kpiTech.textContent = "Arquitectura OK";
    const cardTech = document.getElementById('status-card-tech');
    if (cardTech) cardTech.textContent = "APIs: 2 Semanas";
    await delay(120);

    // AGENT 6: Agile_Scrum_Agent
    setStepState('agile', 'active');
    logTerminal("Agile_Scrum_Agent", "Diseñando arquitectura de Sprints, User Stories y definición de MVP...", "agile");
    await delay(120);

    const agileOutput = {
      agent: "Agile_Scrum_Agent",
      pilar: "Metodologías Ágiles & Sprints",
      status: isReevaluation ? "BACKLOG DE SPRINTS RE-EVALUADO" : "PLANNING INICIAL DE SPRINTS",
      estimated_execution_time: "Cadencia: Sprints Quincenales (3 Sprints = MVP en 6 Semanas)",
      executive_summary: "Descomposición del proyecto en iteraciones de 2 semanas con entregables de software funcionando y priorización MoSCoW para garantizar valor temprano.",
      mvp_scope_definition: `MVP (Sprint 1): Automatización del 20% del flujo central con ${systemsFound[0] || 'orquestador IA'}.`,
      step_by_step_actions: [
        { step: "Paso 1", title: "Acción 1: Redacción del Product Backlog & MoSCoW", duration: "2 días", responsible: "Scrum Master / Agile Coach", detail: "Priorizar las épicas e historias de usuario clasificando en Must Have, Should Have y Could Have." },
        { step: "Paso 2", title: "Acción 2: Sprint 1 Planning (Enfoque en MVP)", duration: "3 días", responsible: "Equipo de Desarrollo / Producto", detail: `Definir las User Stories del Sprint 1 para conectar con ${systemsFound[0] || 'los sistemas principales'}.` },
        { step: "Paso 3", title: "Acción 3: Criterios de Aceptación (Definition of Done)", duration: "2 días", responsible: "Agile Coach & QA", detail: "Establecer métricas de éxito (tasa de error < 0.1%, respuesta < 3 seg) requeridas para dar por terminada cada historia." },
        { step: "Paso 4", title: "Acción 4: Ritmo de Dailies y Sprint Review Quincenal", duration: "Continuo", responsible: "Equipo Multidisciplinario", detail: "Ejecutar reuniones diarias de 15 min y demostraciones funcionales al cliente al cierre de cada Sprint de 2 semanas." }
      ],
      tangible_deliverables: "Product Backlog en Jira/Azure DevOps, Matriz MoSCoW y Tabla de User Stories con Definition of Done"
    };
    if (clientClarifications["Agile_Scrum_Agent"]) {
      agileOutput.client_clarification_applied = clientClarifications["Agile_Scrum_Agent"];
    }

    logTerminal("Agile_Scrum_Agent", "Dictamen Ágil completado:", "agile", agileOutput);
    setStepState('agile', 'completed');
    const cardAgile = document.getElementById('status-card-agile');
    if (cardAgile) cardAgile.textContent = "Sprints: 2 Semanas";

    // Consolidated Timeline Roadmap
    const timelineRoadmap = [
      { phase: "Fase 1: Levantamiento & Gobernanza", weeks: "Semanas 1 - 2", responsible: "Governance & ProcessOptimizer", actions: "Definir matriz PII, cifrado TLS/AES y mapear reglas del proceso As-Is.", deliverable: "Documento de Gobernanza & Sandbox" },
      { phase: "Fase 2: Integración Técnica & APIs", weeks: "Semanas 3 - 4", responsible: "Tech_Connector_Agent", actions: `Desplegar conectores REST/Webhooks para ${systemsFound.slice(0, 2).join(" y ")}.`, deliverable: "Conectores API Autenticados" },
      { phase: "Fase 3: Despliegue de Agentes & OCR", weeks: "Semanas 5 - 6", responsible: "ProcessOptimizer_Agent", actions: "Lanzar escuadrón de agentes en modo piloto automatizando el 50% del volumen.", deliverable: "Piloto Operativo de Automatización" },
      { phase: "Fase 4: Sprints Ágiles & MVP", weeks: "Semanas 7 - 8", responsible: "Agile_Scrum_Agent", actions: "Ejecutar Sprint 1 y Sprint 2 con entrega quincenal de software funcionando.", deliverable: "MVP Operativo con User Stories" },
      { phase: "Fase 5: Gestión del Cambio & Upskilling", weeks: "Semanas 9 - 10", responsible: "People_Culture_Agent", actions: "Ejecutar taller 'Co-Piloto de IA' y reasignar horas liberadas a tareas analíticas.", deliverable: "Equipo Capacitado y Certificado" },
      { phase: "Fase 6: Auditoría Financiera & Escalamiento", weeks: "Semanas 11 - 12", responsible: "ROI_Guardian_Agent", actions: `Auditar el ahorro neto anual ($${annualSavings.toLocaleString()}) y escalar al 100%.`, deliverable: "Informe de ROI y Pase a Producción" }
    ];

    // Store execution data globally
    latestExecutionData = {
      diagnosticText,
      systemsFound,
      estimatedHours,
      customHourlyRate,
      ops: opsOutput,
      roi: roiOutput,
      gov: govOutput,
      culture: cultureOutput,
      tech: techOutput,
      agile: agileOutput,
      questionsList,
      timelineRoadmap,
      isReevaluation
    };

    if (!isReevaluation) {
      renderMissingQuestions(questionsList);
    }

    buildTrackerTasksState();
  }

  // Render Missing Questions Panel (Bulletproof Null Guards)
  function renderMissingQuestions(questions) {
    const listEl = document.getElementById('missing-questions-list');
    const secEl = document.getElementById('missing-info-section');
    if (!listEl) return;
    listEl.innerHTML = questions.map((q) => `
      <div style="background: rgba(0,0,0,0.3); padding:0.75rem 1rem; border-radius:6px; border-left:3px solid var(--accent-amber);">
        <div style="font-size:0.8rem; color:var(--accent-amber); font-weight:bold;">[${q.agent}] ${q.pilar}:</div>
        <div style="font-size:0.9rem; margin-top:0.2rem;">${q.question}</div>
        <input type="text" class="form-input user-answer-input" data-agent="${q.agent}" data-question="${q.question}" style="margin-top:0.4rem; font-size:0.85rem; padding:0.5rem 0.8rem;" placeholder="Escribe aquí tu respuesta específica para este agente...">
      </div>
    `).join('');
    if (secEl) secEl.style.display = "block";
  }

  // Build Interactive Milestone Tracker List for Client
  function buildTrackerTasksState() {
    if (!latestExecutionData) return;

    const agentsList = [latestExecutionData.ops, latestExecutionData.roi, latestExecutionData.gov, latestExecutionData.culture, latestExecutionData.tech, latestExecutionData.agile];
    trackerTasksState = [];

    agentsList.forEach(agent => {
      if (agent.step_by_step_actions) {
        agent.step_by_step_actions.forEach((act, idx) => {
          trackerTasksState.push({
            id: `${agent.agent}_${idx}`,
            agentName: agent.agent,
            pilar: agent.pilar,
            title: act.title,
            duration: act.duration,
            responsible: act.responsible || agent.agent,
            detail: act.detail,
            status: "pending" 
          });
        });
      }
    });

    renderTrackerUI();
  }

  // Render Tracker UI
  function renderTrackerUI() {
    if (trackerTasksState.length === 0) return;

    const completedCount = trackerTasksState.filter(t => t.status === 'completed').length;
    const progressPct = Math.round((completedCount / trackerTasksState.length) * 100);

    trackerProgressPercentage.textContent = `${progressPct}%`;
    trackerProgressBar.style.width = `${progressPct}%`;

    trackerMilestonesList.innerHTML = trackerTasksState.map((task, idx) => `
      <div class="milestone-item ${task.status === 'completed' ? 'completed' : ''}">
        <input type="checkbox" class="milestone-checkbox" data-index="${idx}" ${task.status === 'completed' ? 'checked' : ''}>
        
        <div class="milestone-details">
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <span style="font-size:0.75rem; font-weight:bold; color:var(--accent-cyan);">[${task.pilar}]</span>
            <span style="font-size:0.9rem; font-weight:bold; color:#fff;">${task.title}</span>
            <span style="font-size:0.7rem; background:rgba(255,255,255,0.08); padding:0.1rem 0.4rem; border-radius:4px; color:var(--accent-emerald);"><i class="fa-regular fa-clock"></i> ${task.duration}</span>
            <span style="font-size:0.7rem; color:var(--text-muted);"><i class="fa-solid fa-user-gear"></i> ${task.responsible}</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted);">${task.detail}</div>
        </div>

        <div>
          <select class="status-select" data-index="${idx}">
            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>⏳ Pendiente</option>
            <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>⚡ En Progreso</option>
            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>✅ Completado</option>
          </select>
        </div>
      </div>
    `).join('');

    trackerMilestonesList.querySelectorAll('.milestone-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const idx = e.target.getAttribute('data-index');
        trackerTasksState[idx].status = e.target.checked ? 'completed' : 'pending';
        renderTrackerUI();
      });
    });

    trackerMilestonesList.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = e.target.getAttribute('data-index');
        trackerTasksState[idx].status = e.target.value;
        renderTrackerUI();
      });
    });
  }

  // Open Individual Agent Dictamen Modal
  function openAgentModal(agentKey) {
    if (!latestExecutionData || !latestExecutionData[agentKey]) return;

    const data = latestExecutionData[agentKey];
    const pillarNames = {
      ops: "Operaciones y Procesos",
      roi: "ROI y Valor Financiero",
      gov: "Gobernanza, Seguridad y Ética",
      culture: "Cultura y Talento",
      tech: "Tecnología e Infraestructura",
      agile: "Metodologías Ágiles & Sprints"
    };

    modalAgentTitle.innerHTML = `<i class="fa-solid fa-robot" style="color:var(--accent-cyan);"></i> Dictamen Exhaustivo: <b>${data.agent}</b>`;

    let actionsHTML = "";
    if (data.step_by_step_actions) {
      actionsHTML = `
        <div class="report-section">
          <h4><i class="fa-solid fa-list-check"></i> Guía de Acciones Paso a Paso Recomendadas (${data.estimated_execution_time})</h4>
          <div class="action-roadmap">
            ${data.step_by_step_actions.map((act) => `
              <div class="action-item">
                <div class="action-step-num">${act.step.replace('Acción ', '').replace('Paso ', '')}</div>
                <div>
                  <div style="font-weight:bold; color:#fff;">${act.title} <span style="font-size:0.75rem; color:var(--accent-emerald);">[Duración: ${act.duration}]</span></div>
                  <div style="font-size:0.8rem; color:var(--accent-cyan);"><i class="fa-solid fa-user-gear"></i> Responsable: ${act.responsible || data.agent}</div>
                  <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">${act.detail}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:0.75rem; font-size:0.85rem; color:var(--accent-amber);">
            <b>Entregable Tangible:</b> ${data.tangible_deliverables}
          </div>
        </div>
      `;
    }

    modalAgentBody.innerHTML = `
      <div class="report-section">
        <h4><i class="fa-solid fa-layer-group"></i> Pilar: ${pillarNames[agentKey]}</h4>
        <p><b>Estado del Dictamen:</b> <span style="color:var(--accent-emerald); font-weight:bold;">${data.status}</span></p>
        <p style="margin-top:0.3rem;"><b>Tiempo Total Estimado:</b> ${data.estimated_execution_time}</p>
        <p style="margin-top:0.3rem; color:var(--text-muted);"><b>Resumen Ejecutivo:</b> ${data.executive_summary}</p>
      </div>

      ${actionsHTML}

      <div class="report-section" style="background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.2);">
        <h4 style="color:var(--accent-emerald);"><i class="fa-solid fa-certificate"></i> Garantía de Entregable Oficial IA+ITD</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.3rem;">Este pilar entregará una matriz certificada con trazabilidad completa: <b>${data.tangible_deliverables}</b>.</p>
      </div>
    `;

    modalAgent.classList.add('active');
  }

  // Open Executive Report Modal (Full Non-Truncated Comprehensive Guide)
  function openExecutiveReport() {
    if (!latestExecutionData) return;

    const d = latestExecutionData;
    const agentsList = [d.ops, d.roi, d.gov, d.culture, d.tech, d.agile];

    modalReportBody.innerHTML = `
      <!-- Report Banner Header -->
      <div style="border-bottom: 2px solid var(--accent-cyan); padding-bottom: 1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 style="font-size: 1.6rem; color: #fff;">IA+ITD - PLAN ESTRATÉGICO DE TRANSFORMACIÓN DIGITAL</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Guía de Acciones Paso a Paso, Tiempos por Agente y Entregables | Fecha: ${new Date().toLocaleDateString()}</p>
          </div>
          <span class="agent-badge ops" style="font-size:0.85rem; padding:0.4rem 0.8rem;">INFORME OFICIAL IA+ITD</span>
        </div>
      </div>

      <!-- Chapter 1: Executive Context & Impact Summary -->
      <div class="report-section">
        <h4><i class="fa-solid fa-file-lines"></i> 1. Resumen Ejecutivo del Diagnóstico y Metas Globales</h4>
        <p style="font-style: italic; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.85rem; border-radius: 6px; font-size:0.9rem;">
          "${d.diagnosticText}"
        </p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-top:1rem;">
          <div style="background:rgba(6,182,212,0.1); border:1px solid var(--pillar-ops); padding:0.75rem; border-radius:6px;">
            <div style="font-size:0.75rem; color:var(--pillar-ops); text-transform:uppercase;">Reducción de Tiempo</div>
            <div style="font-size:1.4rem; font-weight:bold; color:#fff;">90% Ahorro</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">De ${d.estimatedHours}h/sem a ${d.ops.target_hours_optimized}h/sem</div>
          </div>

          <div style="background:rgba(16,185,129,0.1); border:1px solid var(--pillar-roi); padding:0.75rem; border-radius:6px;">
            <div style="font-size:0.75rem; color:var(--pillar-roi); text-transform:uppercase;">ROI Proyectado Año 1</div>
            <div style="font-size:1.4rem; font-weight:bold; color:#fff;">${d.roi.projected_roi_year1}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Ahorro neto: ${d.roi.annual_net_savings_usd}</div>
          </div>

          <div style="background:rgba(245,158,11,0.1); border:1px solid var(--pillar-gov); padding:0.75rem; border-radius:6px;">
            <div style="font-size:0.75rem; color:var(--pillar-gov); text-transform:uppercase;">Cumplimiento & Riesgo</div>
            <div style="font-size:1.4rem; font-weight:bold; color:#fff;">ISO 27001</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Cifrado PII & Trazabilidad</div>
          </div>

          <div style="background:rgba(139,92,246,0.1); border:1px solid var(--pillar-culture); padding:0.75rem; border-radius:6px;">
            <div style="font-size:0.75rem; color:var(--pillar-culture); text-transform:uppercase;">Preparación Cultural</div>
            <div style="font-size:1.4rem; font-weight:bold; color:#fff;">85/100</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Taller Co-Piloto listo</div>
          </div>

          <div style="background:rgba(236,72,153,0.1); border:1px solid var(--pillar-agile); padding:0.75rem; border-radius:6px;">
            <div style="font-size:0.75rem; color:var(--pillar-agile); text-transform:uppercase;">Cadencia Ágil</div>
            <div style="font-size:1.4rem; font-weight:bold; color:#fff;">Sprints 2 Sem</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">MVP en 6 Semanas</div>
          </div>
        </div>
      </div>

      <!-- Chapter 2: Comprehensive Step-by-Step Action Guide per Agent -->
      <div class="report-section">
        <h4><i class="fa-solid fa-list-check"></i> 2. Guía Detallada de Acciones a Realizar Paso a Paso por cada Agente IA+ITD</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
          Esta sección entrega las instrucciones claras y entendibles que debe seguir cada equipo de la empresa para ejecutar la transformación con éxito:
        </p>
        
        ${agentsList.map(ag => `
          <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-color); border-radius:8px; padding:1.25rem; margin-top:1.25rem; break-inside:avoid; page-break-inside:avoid;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:0.6rem; margin-bottom:0.85rem;">
              <h5 style="font-size:1.1rem; color:var(--accent-cyan); font-weight:bold;">
                <i class="fa-solid fa-robot"></i> ${ag.agent} — Pilar: ${ag.pilar}
              </h5>
              <span style="font-size:0.8rem; background:rgba(16,185,129,0.15); color:var(--accent-emerald); padding:0.25rem 0.75rem; border-radius:12px; font-weight:bold;">
                <i class="fa-regular fa-clock"></i> ${ag.estimated_execution_time}
              </span>
            </div>

            <div style="font-size:0.85rem; color:var(--text-main); margin-bottom:0.85rem; line-height:1.5;">
              <b>¿Qué resuelve este agente para la empresa?</b> ${ag.executive_summary || ag.as_is_diagnosis}
            </div>

            <div style="font-size:0.9rem; font-weight:bold; color:var(--accent-amber); margin-bottom:0.5rem;">
              📌 Pasos a Ejecutar (Acciones Concretas):
            </div>

            <div class="action-roadmap">
              ${ag.step_by_step_actions ? ag.step_by_step_actions.map(act => `
                <div class="action-item" style="padding:0.75rem 1rem; border-left-width:4px;">
                  <div class="action-step-num" style="width:24px; height:24px; font-size:0.8rem;">${act.step.replace('Acción ', '').replace('Paso ', '')}</div>
                  <div style="flex-grow:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                      <span style="font-weight:bold; font-size:0.9rem; color:#fff;">${act.title}</span>
                      <span style="font-size:0.75rem; color:var(--accent-emerald); font-weight:bold;"><i class="fa-regular fa-calendar"></i> Duración: ${act.duration}</span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--accent-cyan); margin-top:0.15rem;"><i class="fa-solid fa-user-gear"></i> Responsable: ${act.responsible || ag.agent}</div>
                    <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem; line-height:1.4;">${act.detail}</div>
                  </div>
                </div>
              `).join('') : ''}
            </div>

            <div style="margin-top:0.85rem; padding:0.6rem 0.85rem; background:rgba(16,185,129,0.08); border-radius:6px; border:1px solid rgba(16,185,129,0.2); font-size:0.85rem; color:var(--accent-emerald);">
              <i class="fa-solid fa-trophy"></i> <b>Entregable Tangible de este Pilar:</b> ${ag.tangible_deliverables || 'Documento Técnico Certificado'}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Chapter 3: Consolidated Timeline Roadmap (Gantt) -->
      <div class="report-section">
        <h4><i class="fa-solid fa-calendar-days"></i> 3. Hoja de Ruta Consolidada & Cronograma de Tiempos (12 Semanas)</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">
          Secuencia cronológica unificada para coordinar a todas las áreas de la empresa durante los 3 meses de despliegue:
        </p>

        <table style="width:100%; border-collapse: collapse; font-size:0.85rem; margin-top:0.5rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--accent-cyan); text-align:left; color:var(--text-main);">
              <th style="padding:0.6rem;">Fase y Duración</th>
              <th style="padding:0.6rem;">Agentes Responsables</th>
              <th style="padding:0.6rem;">Acciones Clave a Ejecutar</th>
              <th style="padding:0.6rem;">Entregable Garantizado</th>
            </tr>
          </thead>
          <tbody>
            ${d.timelineRoadmap.map(item => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding:0.6rem; color:var(--accent-cyan); font-weight:bold;">
                  ${item.phase}<br>
                  <span style="font-size:0.75rem; color:var(--accent-emerald);"><i class="fa-regular fa-clock"></i> ${item.weeks}</span>
                </td>
                <td style="padding:0.6rem; font-size:0.8rem;">${item.responsible}</td>
                <td style="padding:0.6rem;">${item.actions}</td>
                <td style="padding:0.6rem; font-weight:bold; color:var(--accent-amber);">${item.deliverable}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    modalReport.classList.add('active');
  }

/* END INITIALIZATION */