"""
Orquestador del Escuadrón de Agentes de Transformación Digital
"""
from backend.agents import (
    ProcessOptimizerAgent,
    ROIGuardianAgent,
    GovernanceComplianceAgent,
    PeopleCultureAgent,
    TechConnectorAgent,
    AgileScrumAgent
)
from backend.schemas import TransformationResponse

class MultiAgentOrchestrator:
    def __init__(self):
        self.ops_agent = ProcessOptimizerAgent()
        self.roi_agent = ROIGuardianAgent()
        self.gov_agent = GovernanceComplianceAgent()
        self.culture_agent = PeopleCultureAgent()
        self.tech_agent = TechConnectorAgent()
        self.agile_agent = AgileScrumAgent()

    def run_pipeline(self, process_description: str) -> TransformationResponse:
        """
        Ejecuta la tubería secuencial de los 6 agentes
        """
        # Step 1: Operaciones
        ops_result = self.ops_agent.run(process_description)

        # Step 2: ROI (Consume output del Step 1)
        roi_result = self.roi_agent.run(ops_result)

        # Step 3: Gobernanza
        gov_result = self.gov_agent.run(process_description)

        # Step 4: Cultura (Consume output del Step 1)
        culture_result = self.culture_agent.run(ops_result)

        # Step 5: Tecnología
        tech_result = self.tech_agent.run()

        # Step 6: Metodologías Ágiles & Sprints
        agile_result = self.agile_agent.run()

        return TransformationResponse(
            status="SUCCESS",
            process_description=process_description,
            results={
                "ops": ops_result.model_dump(),
                "roi": roi_result.model_dump(),
                "gov": gov_result.model_dump(),
                "culture": culture_result.model_dump(),
                "tech": tech_result.model_dump(),
                "agile": agile_result.model_dump()
            }
        )
