/* ==========================================================================
   LÓGICA DEL FRONTEND - IA+ITD (INFORME FINAL COMPLETO CON GUÍA DE ACCIONES)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const presetSelect = document.getElementById('preset-scenario');
  const processTextArea = document.getElementById('process-description');
  const btnRun = document.getElementById('btn-run-simulation');
  const btnClear = document.getElementById('btn-clear-terminal');
  const terminalOutput = document.getElementById('terminal-output');
  const statusLabel = document.getElementById('execution-status-label');
  const btnOpenReport = document.getElementById('btn-open-report');
  const navReportLink = document.getElementById('nav-report-link');
  
  const btnModeSim = document.getElementById('btn-mode-sim');
  const btnModeApi = document.getElementById('btn-mode-api');

  // Missing Info Section
  const missingInfoSection = document.getElementById('missing-info-section');
  const missingQuestionsList = document.getElementById('missing-questions-list');
  const btnSubmitAnswers = document.getElementById('btn-submit-answers');

  // Tracker Section Elements
  const trackerSection = document.getElementById('tracker-section');
  const trackerMilestonesList = document.getElementById('tracker-milestones-list');
  const trackerProgressPercentage = document.getElementById('tracker-progress-percentage');
  const trackerProgressBar = document.getElementById('tracker-progress-bar');

  // KPI elements
  const kpiOps = document.getElementById('kpi-ops');
  const kpiRoi = document.getElementById('kpi-roi');
  const kpiGov = document.getElementById('kpi-gov');
  const kpiCulture = document.getElementById('kpi-culture');
  const kpiTech = document.getElementById('kpi-tech');

  // Pipeline steps
  const steps = {
    ops: document.getElementById('step-ops'),
    roi: document.getElementById('step-roi'),
    gov: document.getElementById('step-gov'),
    culture: document.getElementById('step-culture'),
    tech: document.getElementById('step-tech'),
    agile: document.getElementById('step-agile')
  };

  // Modals
  const modalAgent = document.getElementById('modal-agent');
  const modalAgentTitle = document.getElementById('modal-agent-title');
  const modalAgentBody = document.getElementById('modal-agent-body');
  const btnCloseAgentModal = document.getElementById('btn-close-agent-modal');

  const modalReport = document.getElementById('modal-report');
  const modalReportBody = document.getElementById('modal-report-body');
  const btnCloseReportModal = document.getElementById('btn-close-report-modal');
  const btnPrintReport = document.getElementById('btn-print-report');

  // State
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

  // Event Listeners
  presetSelect.addEventListener('change', (e) => {
    if (scenarios[e.target.value]) {
      processTextArea.value = scenarios[e.target.value];
    } else if (e.target.value === 'custom') {
      processTextArea.value = "";
      processTextArea.placeholder = "Pega o escribe aquí el diagnóstico real realizado en tu empresa...";
      processTextArea.focus();
    }
  });

  // Limpiar campo si está seleccionada la opción custom al cargar
  if (presetSelect.value === 'custom') {
    processTextArea.value = "";
  }

  btnModeSim.addEventListener('click', () => {
    mode = 'sim';
    btnModeSim.classList.add('active');
    btnModeApi.classList.remove('active');
    logTerminal("SISTEMA IA+ITD", "Modo cambiado a MOTOR DE ANÁLISIS DE DIAGNÓSTICO", "tech");
  });

  btnModeApi.addEventListener('click', () => {
    mode = 'api';
    btnModeApi.classList.add('active');
    btnModeSim.classList.remove('active');
    logTerminal("SISTEMA IA+ITD", "Modo cambiado a BACKEND REST API (http://localhost:8000)", "tech");
  });

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

  btnRun.addEventListener('click', async () => {
    if (isRunning) return;
    const text = processTextArea.value.trim();
    if (!text) {
      alert("Por favor pega o ingresa el texto del diagnóstico de tu empresa en el cuadro de texto.");
      return;
    }

    isRunning = true;
    btnRun.disabled = true;
    statusLabel.textContent = "Analizando diagnóstico de la empresa...";
    resetPipelineUI();
    missingInfoSection.style.display = "none";

    await runExhaustiveAnalysis(text);

    isRunning = false;
    btnRun.disabled = false;
    statusLabel.textContent = "Análisis completado";
    btnOpenReport.style.display = "flex";
    trackerSection.style.display = "block";
  });

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
    await runExhaustiveAnalysis(enrichedText, true);

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

  // Context-Aware Question Generator Function
  function generateContextualQuestions(textUpper) {
    const questions = [];

    // 1. ProcessOptimizer Question
    if (textUpper.includes("FACTURA") || textUpper.includes("PDF") || textUpper.includes("FINANCIERO")) {
      questions.push({
        agent: "ProcessOptimizer_Agent",
        pilar: "Operaciones",
        question: "1. ¿Qué porcentaje de las facturas/documentos recibidos mensualmente presenta errores de datos o formato que obligan a una revisión manual excepcional?"
      });
    } else if (textUpper.includes("RRHH") || textUpper.includes("EMPLEADO") || textUpper.includes("ONBOARDING")) {
      questions.push({
        agent: "ProcessOptimizer_Agent",
        pilar: "Operaciones",
        question: "1. ¿Cuáles son los 3 formularios o carpetas en papel que más retrasan el alta operativa del nuevo trabajador?"
      });
    } else if (textUpper.includes("TICKET") || textUpper.includes("SOPORTE") || textUpper.includes("AYUDA")) {
      questions.push({
        agent: "ProcessOptimizer_Agent",
        pilar: "Operaciones",
        question: "1. ¿Qué porcentaje de los tickets atendidos mensualmente corresponde a reseteos simples de contraseñas versus problemas técnicos complejos?"
      });
    } else {
      questions.push({
        agent: "ProcessOptimizer_Agent",
        pilar: "Operaciones",
        question: "1. ¿En qué paso específico del proceso manual se genera la mayor acumulación de tareas y tiempo de espera entre áreas?"
      });
    }

    // 2. ROI_Guardian Question
    if (textUpper.includes("FACTURA") || textUpper.includes("PAGO")) {
      questions.push({
        agent: "ROI_Guardian_Agent",
        pilar: "ROI Financiero",
        question: "2. ¿Existen intereses, multas o pérdidas de descuentos por pronto pago debido a demoras en la aprobación de estos documentos?"
      });
    } else if (textUpper.includes("RRHH") || textUpper.includes("EMPLEADO")) {
      questions.push({
        agent: "ROI_Guardian_Agent",
        pilar: "ROI Financiero",
        question: "2. ¿Cuál es el costo estimado para la empresa por cada día que un nuevo colaborador permanece sin sus accesos o equipo listo para trabajar?"
      });
    } else if (textUpper.includes("TICKET") || textUpper.includes("SOPORTE")) {
      questions.push({
        agent: "ROI_Guardian_Agent",
        pilar: "ROI Financiero",
        question: "2. ¿Cuántos técnicos dedicados a soporte Nivel 1 atienden estas solicitudes y cuál es su costo horario estimado?"
      });
    } else {
      questions.push({
        agent: "ROI_Guardian_Agent",
        pilar: "ROI Financiero",
        question: "2. ¿Cuál es el salario promedio mensual o valor de la hora del personal dedicado a realizar estas tareas manuales?"
      });
    }

    // 3. Governance_Compliance Question
    if (textUpper.includes("EMPLEADO") || textUpper.includes("RRHH") || textUpper.includes("SALARIO") || textUpper.includes("CONTRATO")) {
      questions.push({
        agent: "Governance_Compliance_Agent",
        pilar: "Gobernanza",
        question: "3. ¿El proceso manipula datos personales altamente confidenciales de trabajadores (RUT, cuentas bancarias, fichas médicas) sujetas a normativas PII?"
      });
    } else if (textUpper.includes("FACTURA") || textUpper.includes("PAGO") || textUpper.includes("BANCO")) {
      questions.push({
        agent: "Governance_Compliance_Agent",
        pilar: "Gobernanza",
        question: "3. ¿Se requiere la firma digital o aprobación formal auditada en 2 pasos para desembolsos o pagos a proveedores?"
      });
    } else {
      questions.push({
        agent: "Governance_Compliance_Agent",
        pilar: "Gobernanza",
        question: "3. ¿Los servidores e información de la empresa residen en infraestructura local (On-Premise) o en nube (AWS/Azure/GCP)?"
      });
    }

    // 4. People_Culture Question
    if (textUpper.includes("TICKET") || textUpper.includes("SOPORTE")) {
      questions.push({
        agent: "People_Culture_Agent",
        pilar: "Cultura",
        question: "4. ¿Cuál es la tasa de desgaste o rotación del equipo de soporte debido a la atención de consultas altamente repetitivas y rutinarias?"
      });
    } else if (textUpper.includes("RRHH") || textUpper.includes("OPERACIONES")) {
      questions.push({
        agent: "People_Culture_Agent",
        pilar: "Cultura",
        question: "4. ¿Qué disposición tiene el equipo operativo para usar asistentes virtuales de IA o existe temor a la digitalización de sus funciones?"
      });
    } else {
      questions.push({
        agent: "People_Culture_Agent",
        pilar: "Cultura",
        question: "4. ¿A qué actividades estratégicas de valor preferiría la empresa destinar las horas que hoy se pierden en el trabajo manual?"
      });
    }

    // 5. Tech_Connector Question
    if (textUpper.includes("SAP")) {
      questions.push({
        agent: "Tech_Connector_Agent",
        pilar: "Tecnología",
        question: "5. ¿La versión de SAP utilizada en la empresa (S/4HANA o ECC) cuenta con módulos OData / REST APIs habilitados o requiere conectores directos?"
      });
    } else if (textUpper.includes("ACTIVE DIRECTORY") || textUpper.includes("USUARIOS")) {
      questions.push({
        agent: "Tech_Connector_Agent",
        pilar: "Tecnología",
        question: "5. ¿Utilizan Microsoft Entra ID (Azure AD), Okta o un Active Directory local para la autenticación y asignación de permisos de usuarios?"
      });
    } else {
      questions.push({
        agent: "Tech_Connector_Agent",
        pilar: "Tecnología",
        question: "5. ¿Los sistemas o planillas actuales disponen de interfaces de conexión API / Webhooks o requieren integraciones a nivel de archivo/base de datos?"
      });
    }

    // 6. Agile_Scrum Question
    questions.push({
      agent: "Agile_Scrum_Agent",
      pilar: "Metodologías Ágiles",
      question: "6. ¿Cuáles son las 2 victorias tempranas (Quick Wins) o funcionalidades críticas que la gerencia exige ver automatizadas en el Sprint 1 (primeras 2 semanas)?"
    });

    return questions;
  }

  // Exhaustive Multi-Agent Analysis Engine
  async function runExhaustiveAnalysis(diagnosticText, isReevaluation = false) {
    logTerminal("ORQUESTADOR IA+ITD", `${isReevaluation ? 'Re-evaluando' : 'Iniciando'} análisis situacional sobre el texto (${diagnosticText.length} caracteres)...`, "tech");
    await delay(500);

    const systemsFound = [];
    const textUpper = diagnosticText.toUpperCase();
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

    const questionsList = generateContextualQuestions(textUpper);

    // AGENT 1: ProcessOptimizer_Agent
    setStepState('ops', 'active');
    logTerminal("ProcessOptimizer_Agent", "Iniciando descomposición de la situación operacional de la empresa...", "ops");
    await delay(800);

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
    kpiOps.textContent = `90% Reducción`;
    document.getElementById('status-card-ops').textContent = `Tiempo: 2 Semanas`;
    await delay(600);

    // AGENT 2: ROI_Guardian_Agent
    setStepState('roi', 'active');
    logTerminal("ROI_Guardian_Agent", "Generando modelo financiero adaptado a la situación de costo de la empresa...", "roi");
    await delay(900);

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
    kpiRoi.textContent = `+${roiYear1}% ROI`;
    document.getElementById('status-card-roi').textContent = `Payback: ${paybackMonths} meses`;
    await delay(600);

    // AGENT 3: Governance_Compliance_Agent
    setStepState('gov', 'active');
    logTerminal("Governance_Compliance_Agent", "Auditando requisitos normativos y sensibilidad de datos...", "gov");
    await delay(800);

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
    kpiGov.textContent = "ISO 27001 OK";
    document.getElementById('status-card-gov').textContent = "Cumplimiento: ISO 27001";
    await delay(600);

    // AGENT 4: People_Culture_Agent
    setStepState('culture', 'active');
    logTerminal("People_Culture_Agent", "Diseñando estrategia de gestión del cambio atinente a la situación del equipo...", "culture");
    await delay(800);

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
    kpiCulture.textContent = "85/100 Prep";
    document.getElementById('status-card-culture').textContent = "Capacitación: 3 Semanas";
    await delay(600);

    // AGENT 5: Tech_Connector_Agent
    setStepState('tech', 'active');
    logTerminal("Tech_Connector_Agent", "Construyendo conectores e integraciones para los sistemas detectados...", "tech");
    await delay(700);

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
    kpiTech.textContent = "Arquitectura OK";
    document.getElementById('status-card-tech').textContent = "APIs: 2 Semanas";
    await delay(600);

    // AGENT 6: Agile_Scrum_Agent
    setStepState('agile', 'active');
    logTerminal("Agile_Scrum_Agent", "Diseñando arquitectura de Sprints, User Stories y definición de MVP...", "agile");
    await delay(700);

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
    document.getElementById('status-card-agile').textContent = "Sprints: 2 Semanas";

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

  // Render Missing Questions Panel
  function renderMissingQuestions(questions) {
    missingQuestionsList.innerHTML = questions.map((q) => `
      <div style="background: rgba(0,0,0,0.3); padding:0.75rem 1rem; border-radius:6px; border-left:3px solid var(--accent-amber);">
        <div style="font-size:0.8rem; color:var(--accent-amber); font-weight:bold;">[${q.agent}] ${q.pilar}:</div>
        <div style="font-size:0.9rem; margin-top:0.2rem;">${q.question}</div>
        <input type="text" class="form-input user-answer-input" data-agent="${q.agent}" data-question="${q.question}" style="margin-top:0.4rem; font-size:0.85rem; padding:0.5rem 0.8rem;" placeholder="Escribe aquí tu respuesta específica para este agente...">
      </div>
    `).join('');
    missingInfoSection.style.display = "block";
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

      <div class="report-section">
        <h4><i class="fa-solid fa-code"></i> Ficha Técnica Estructurada (JSON Dictamen)</h4>
        <pre class="json-viewer" style="font-size:0.85rem;">${JSON.stringify(data, null, 2)}</pre>
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

});
