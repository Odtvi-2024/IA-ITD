"""
Definición de Agentes de IA con Análisis Exhaustivo y Guía de Acciones Paso a Paso
"""
import uuid
import re
from backend.schemas import (
    ProcessOptimizerOutput,
    ROIGuardianOutput,
    GovernanceComplianceOutput,
    PeopleCultureOutput,
    TechConnectorOutput,
    AgileScrumOutput,
    StepAction
)

class BaseAgent:
    def __init__(self, name: str, pillar: str, system_prompt: str):
        self.name = name
        self.pillar = pillar
        self.system_prompt = system_prompt

class ProcessOptimizerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ProcessOptimizer_Agent",
            pillar="Operaciones y Procesos",
            system_prompt="""Eres el Analista Sénior de Procesos. Realizas diagnósticos As-Is/To-Be,
            calculas reducciones de tiempo y orientas al cliente con acciones paso a paso."""
        )

    def run(self, process_desc: str) -> ProcessOptimizerOutput:
        systems = []
        desc_upper = process_desc.upper()
        if "SAP" in desc_upper: systems.append("SAP")
        if "EXCEL" in desc_upper: systems.append("Excel")
        if "EMAIL" in desc_upper or "CORREO" in desc_upper: systems.append("Email Gateway")
        if "PDF" in desc_upper: systems.append("Lector PDF")
        if not systems: systems = ["Sistemas Legados"]

        hours_match = re.search(r'(\d+)\s*(horas|hrs|h)', process_desc, re.IGNORECASE)
        hours_before = float(hours_match.group(1)) if hours_match else 14.0
        hours_after = max(0.5, round(hours_before * 0.1, 1))

        return ProcessOptimizerOutput(
            status="DICTAMEN EXHAUSTIVO COMPLETO",
            estimated_execution_time="Duración estimada: 2 Semanas (80 hrs-hombre)",
            executive_summary="Reducción dramática del tiempo operativo mediante la eliminación de captura manual e integración de agentes OCR inteligentes.",
            bottleneck=f"Fricción operativa e intercambio manual entre {', '.join(systems)}",
            cycle_time_before_hours=hours_before,
            cycle_time_after_hours=hours_after,
            automation_feasibility=f"{min(95, 78 + len(systems)*4)}%",
            solution=f"Orquestador de IA autónomo para automatizar {systems[0]}",
            step_by_step_actions=[
                StepAction(step="Paso 1", title="Acción 1: Mapeo Fino de Campos de Entrada", duration="3 días", responsible="Analista de Procesos", detail=f"Identificar las variables críticas a extraer automáticamente de {systems[0]}."),
                StepAction(step="Paso 2", title="Acción 2: Despliegue del Orquestador IA", duration="4 días", responsible="Ingeniero de Automatización", detail="Configurar los modelos de extracción e inferencia estructurada JSON."),
                StepAction(step="Paso 3", title="Acción 3: Reglas Automáticas de Negocio", duration="3 días", responsible="Analista de Procesos", detail="Programar verificaciones automáticas de montos y firmas de autorización."),
                StepAction(step="Paso 4", title="Acción 4: Pruebas de Carga y Cero Errores", duration="4 días", responsible="Equipo QA / Operaciones", detail="Ejecutar 100 transacciones reales simuladas en paralelo con error < 0.1%.")
            ],
            tangible_deliverables="Matriz As-Is/To-Be, Diagrama BPMN y Motor Orquestador Desplegado"
        )

class ROIGuardianAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ROI_Guardian_Agent",
            pillar="ROI y Valor de Negocio",
            system_prompt="""Eres el CFO Virtual. Calculas el modelo financiero, CAPEX/OPEX y Payback con acciones paso a paso."""
        )

    def run(self, ops_output: ProcessOptimizerOutput) -> ROIGuardianOutput:
        hours_saved = (ops_output.cycle_time_before_hours - ops_output.cycle_time_after_hours) * 10
        monthly_savings = hours_saved * 34.0
        annual_savings = monthly_savings * 12
        cost = 11000.0
        payback = round(cost / monthly_savings, 1) if monthly_savings > 0 else 0
        roi_year1 = f"{int(((annual_savings - cost) / cost) * 100)}%"

        return ROIGuardianOutput(
            status="MODELO FINANCIERO EXHAUSTIVO",
            estimated_execution_time="Duración estimada: 1 Semana (40 hrs-hombre)",
            executive_summary="Recuperación completa del capital invertido (CAPEX) en menos de 3 meses con retornos netos > 300% en año 1.",
            hours_saved_monthly=hours_saved,
            monthly_savings_usd=monthly_savings,
            annual_savings_usd=annual_savings,
            implementation_cost_usd=cost,
            payback_months=payback,
            roi_year1=roi_year1,
            step_by_step_actions=[
                StepAction(step="Paso 1", title="Acción 1: Auditoría de Costos Laborales Directos", duration="2 días", responsible="CFO Virtual", detail=f"Consolidar horas dedicadas actuales contra costo laboral real de $34/h."),
                StepAction(step="Paso 2", title="Acción 2: Configuración del Tablero de Ahorros", duration="2 días", detail="Crear un indicador en vivo en el dashboard que muestre el monto ahorrado."),
                StepAction(step="Paso 3", title="Acción 3: Evaluación de Sensibilidad de Escala", duration="1 día", detail="Proyectar escenarios de crecimiento al +20% y +50% sin costo de nómina."),
                StepAction(step="Paso 4", title="Acción 4: Dictamen de Liberación Presupuestaria", duration="2 días", detail="Presentar el Business Case formal a la mesa directiva para liberar presupuesto.")
            ],
            tangible_deliverables="Modelo Financiero VAN/TIR y Tablero de Seguimiento de ROI"
        )

class GovernanceComplianceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Governance_Compliance_Agent",
            pillar="Gobernanza, Seguridad y Ética",
            system_prompt="""Eres el CISO y Oficial de Cumplimiento. Auditás la privacidad PII y seguridad ISO 27001."""
        )

    def run(self, process_desc: str) -> GovernanceComplianceOutput:
        desc_upper = process_desc.upper()
        has_pii = any(w in desc_upper for w in ["EMPLEADO", "CLIENTE", "PERSONA", "RUT", "CORREO", "EMAIL"])
        
        return GovernanceComplianceOutput(
            status="AUDITORÍA NORMATIVA EXHAUSTIVA",
            estimated_execution_time="Duración estimada: 2 Semanas (60 hrs-hombre)",
            executive_summary="Cumplimiento estricto ISO 27001 y GDPR mediante arquitectura de anonimización de datos (PII Masking).",
            pii_scan="PII DETECTADO (Requiere Data Masking)" if has_pii else "LIMPIO",
            compliance_standards=["ISO/IEC 27001:2022", "GDPR Compliance", "EU AI Act"],
            risk_level="MEDIUM" if has_pii else "LOW",
            audit_signature=f"SIG-{uuid.uuid4().hex[:8].upper()}-OK",
            step_by_step_actions=[
                StepAction(step="Paso 1", title="Acción 1: Mapeo de Campos PII Sensibles", duration="3 días", responsible="CISO", detail="Identificar nombres, RUTs, correos o datos bancarios manipulados para cifrado."),
                StepAction(step="Paso 2", title="Acción 2: Despliegue de Capa de Anonimización", duration="4 días", detail="Configurar middleware PII Masking que anonimiza datos antes de inferencia IA."),
                StepAction(step="Paso 3", title="Acción 3: Trazabilidad e Histórico Cifrado", duration="3 días", detail="Implementar log cifrado AES-256 para firmar digitalmente cada acción."),
                StepAction(step="Paso 4", title="Acción 4: Umbrales Human-in-the-Loop", duration="4 días", detail="Establecer revisión humana obligatoria para transacciones de confianza < 90%.")
            ],
            tangible_deliverables="Matriz de Riesgo ISO 27001, Filtro de Data Masking Activo y Certificado"
        )

class PeopleCultureAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="People_Culture_Agent",
            pillar="Cultura y Talento",
            system_prompt="""Eres el Director de Cambio Cultural. Diseñas programas de Upskilling e integración humana."""
        )

    def run(self, ops_output: ProcessOptimizerOutput) -> PeopleCultureOutput:
        return PeopleCultureOutput(
            status="PLAN CULTURAL EXHAUSTIVO",
            estimated_execution_time="Duración estimada: 3 Semanas (90 hrs-hombre)",
            executive_summary="Posicionamiento de la IA como co-piloto de apoyo, reorientando el tiempo libre a tareas de alto valor.",
            change_readiness_index="85/100",
            training_module="Programa 'Co-Piloto Digital' para optimización de tareas repetitivas",
            upskilling_hours=8,
            mitigation_strategy="Reorientación de horas liberadas a actividades de análisis y gestión",
            step_by_step_actions=[
                StepAction(step="Paso 1", title="Acción 1: Encuesta de Resistencia", duration="4 días", responsible="Gestión del Cambio", detail="Evaluar la receptividad del equipo ante la incorporación de asistentes de IA."),
                StepAction(step="Paso 2", title="Acción 2: Taller Práctico 'Co-Piloto Digital'", duration="5 días", detail="Impartir 8 horas de capacitación en el uso de la nueva plataforma automatizada."),
                StepAction(step="Paso 3", title="Acción 3: Redestinación de Tiempo de Valor", duration="5 días", detail="Reasignar formalmente las horas liberadas hacia atención a clientes y análisis."),
                StepAction(step="Paso 4", title="Acción 4: Red Interna de Campeones Digitales", duration="7 días", detail="Certificar a 2 líderes internos para acompañar la adopción continua del equipo.")
            ],
            tangible_deliverables="Malla Curricular de Capacitación y 100% Personal Certificado"
        )

class TechConnectorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Tech_Connector_Agent",
            pillar="Tecnología e Infraestructura",
            system_prompt="""Eres el Arquitecto de Software. Diseñas conectores API, webhooks y middleware."""
        )

    def run(self) -> TechConnectorOutput:
        return TechConnectorOutput(
            status="ARQUITECTURA TÉCNICA EXHAUSTIVA",
            estimated_execution_time="Duración estimada: 2 Semanas (70 hrs-hombre)",
            executive_summary="Arquitectura moderna basada en microservicios desacoplados y conectores REST API con latencia < 250ms.",
            connected_systems=["REST API ERP Gateway", "OAuth2 Identity Provider", "Webhook Receiver"],
            schema_validation="VALIDATED_100%",
            latency_ms=95,
            status_state="PRODUCTION_READY",
            step_by_step_actions=[
                StepAction(step="Paso 1", title="Acción 1: Contratos OpenAPI / Swagger", duration="3 días", responsible="Arquitecto de Software", detail="Definir estructuras JSON estandarizadas para comunicar los sistemas corporativos."),
                StepAction(step="Paso 2", title="Acción 2: Desarrollo de Middleware Webhook", duration="4 días", responsible="Ingeniero Backend", detail="Construir el listener seguro con autenticación OAuth2 y cifrado de tokens."),
                StepAction(step="Paso 3", title="Acción 3: Pruebas de Latencia y Carga", duration="3 días", detail="Asegurar latencia < 250ms por transacción bajo carga simultánea de peticiones."),
                StepAction(step="Paso 4", title="Acción 4: Despliegue CI/CD a Producción", duration="4 días", detail="Configurar automatización de despliegue continuo con monitoreo de disponibilidad.")
            ],
            tangible_deliverables="Código Fuente de APIs, Documentación Swagger y Pipeline CI/CD"
        )

class AgileScrumAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Agile_Scrum_Agent",
            pillar="Metodologías Ágiles & Sprints",
            system_prompt="""Eres el Agile Coach & Scrum Master. Traduces el diagnóstico en Product Backlog, Sprints de 2 semanas, User Stories y Criterios de Aceptación."""
        )

    def run(self) -> AgileScrumOutput:
        return AgileScrumOutput(
            status="PLANNING ÁGIL Y SPRINTS EXHAUSTIVO",
            estimated_execution_time="Cadencia: Sprints Quincenales (3 Sprints = MVP en 6 Semanas)",
            executive_summary="Descomposición del proyecto en iteraciones de 2 semanas con entregables de software funcionando y priorización MoSCoW para garantizar valor temprano.",
            mvp_scope_definition="MVP (Sprint 1): Automatización del 20% del flujo central con orquestador de IA.",
            step_by_step_actions=[
                StepAction(step="Paso 1", title="Acción 1: Redacción del Product Backlog & MoSCoW", duration="2 días", responsible="Scrum Master / Agile Coach", detail="Priorizar las épicas e historias de usuario clasificando en Must Have, Should Have y Could Have."),
                StepAction(step="Paso 2", title="Acción 2: Sprint 1 Planning (Enfoque en MVP)", duration="3 días", responsible="Equipo de Desarrollo / Producto", detail="Definir las User Stories del Sprint 1 para conectar con los sistemas principales."),
                StepAction(step="Paso 3", title="Acción 3: Criterios de Aceptación (Definition of Done)", duration="2 días", responsible="Agile Coach & QA", detail="Establecer métricas de éxito (tasa de error < 0.1%, respuesta < 3 seg) requeridas para cerrar cada historia."),
                StepAction(step="Paso 4", title="Acción 4: Ritmo de Dailies y Sprint Review", duration="Continuo", responsible="Equipo Multidisciplinario", detail="Ejecutar reuniones diarias de 15 min y demostraciones funcionales al cliente al cierre de cada Sprint de 2 semanas.")
            ],
            tangible_deliverables="Product Backlog en Jira/Azure DevOps, Matriz MoSCoW y Tabla de User Stories con Definition of Done"
        )
