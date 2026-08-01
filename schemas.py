"""
Esquemas Pydantic para el Sistema Multiamgente de Transformación Digital IA+ITD
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TransformationRequest(BaseModel):
    process_description: str = Field(..., description="Descripción del proceso manual que se desea transformar")
    department: Optional[str] = Field("General", description="Departamento o área de la empresa")

class StepAction(BaseModel):
    step: str
    title: str
    duration: str
    responsible: str
    detail: str

class ProcessOptimizerOutput(BaseModel):
    agent: str = "ProcessOptimizer_Agent"
    pilar: str = "Operaciones y Procesos"
    status: str
    estimated_execution_time: str
    executive_summary: str
    bottleneck: str
    cycle_time_before_hours: float
    cycle_time_after_hours: float
    automation_feasibility: str
    solution: str
    step_by_step_actions: List[StepAction]
    tangible_deliverables: str

class ROIGuardianOutput(BaseModel):
    agent: str = "ROI_Guardian_Agent"
    pilar: str = "ROI y Valor de Negocio"
    status: str
    estimated_execution_time: str
    executive_summary: str
    hours_saved_monthly: float
    monthly_savings_usd: float
    annual_savings_usd: float
    implementation_cost_usd: float
    payback_months: float
    roi_year1: str
    step_by_step_actions: List[StepAction]
    tangible_deliverables: str

class GovernanceComplianceOutput(BaseModel):
    agent: str = "Governance_Compliance_Agent"
    pilar: str = "Gobernanza, Seguridad y Ética"
    status: str
    estimated_execution_time: str
    executive_summary: str
    pii_scan: str
    compliance_standards: List[str]
    risk_level: str
    audit_signature: str
    step_by_step_actions: List[StepAction]
    tangible_deliverables: str

class PeopleCultureOutput(BaseModel):
    agent: str = "People_Culture_Agent"
    pilar: str = "Cultura y Talento"
    status: str
    estimated_execution_time: str
    executive_summary: str
    change_readiness_index: str
    training_module: str
    upskilling_hours: int
    mitigation_strategy: str
    step_by_step_actions: List[StepAction]
    tangible_deliverables: str

class TechConnectorOutput(BaseModel):
    agent: str = "Tech_Connector_Agent"
    pilar: str = "Tecnología e Infraestructura"
    status: str
    estimated_execution_time: str
    executive_summary: str
    connected_systems: List[str]
    schema_validation: str
    latency_ms: int
    status_state: str
    step_by_step_actions: List[StepAction]
    tangible_deliverables: str

class AgileScrumOutput(BaseModel):
    agent: str = "Agile_Scrum_Agent"
    pilar: str = "Metodologías Ágiles & Sprints"
    status: str
    estimated_execution_time: str
    executive_summary: str
    mvp_scope_definition: str
    step_by_step_actions: List[StepAction]
    tangible_deliverables: str

class TransformationResponse(BaseModel):
    status: str
    process_description: str
    results: Dict[str, Any]
