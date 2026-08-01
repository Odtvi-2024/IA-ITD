"""
Servidor FastAPI para la API REST del Sistema Multiamgente
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import TransformationRequest, TransformationResponse
from backend.orchestrator import MultiAgentOrchestrator

app = FastAPI(
    title="API de Transformación Digital con Agentes de IA",
    description="Servidor REST para ejecutar el escuadrón de 5 agentes de IA.",
    version="1.0.0"
)

# Permitir CORS para comunicación directa con el Dashboard Web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = MultiAgentOrchestrator()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Agents Digital Transformation Engine",
        "pillars": ["Operaciones", "ROI", "Gobernanza", "Cultura", "Tecnología"]
    }

@app.get("/api/agents/status")
def get_agents_status():
    return {
        "active_agents": 5,
        "squad": [
            {"name": "ProcessOptimizer_Agent", "pillar": "Operaciones y Procesos", "status": "READY"},
            {"name": "ROI_Guardian_Agent", "pillar": "ROI y Valor de Negocio", "status": "READY"},
            {"name": "Governance_Compliance_Agent", "pillar": "Gobernanza, Seguridad y Ética", "status": "READY"},
            {"name": "People_Culture_Agent", "pillar": "Cultura y Talento", "status": "READY"},
            {"name": "Tech_Connector_Agent", "pillar": "Tecnología e Infraestructura", "status": "READY"}
        ]
    }

@app.post("/api/run-transformation", response_model=TransformationResponse)
def run_transformation(request: TransformationRequest):
    try:
        if not request.process_description.strip():
            raise HTTPException(status_code=400, detail="La descripción del proceso no puede estar vacía.")
        
        response = orchestrator.run_pipeline(request.process_description)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
