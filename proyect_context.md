# project_context.md
## 1) Contexto general

Este proyecto construye un MVP mostrable de un sistema de control de stock automatizado, apoyado por agentes y flujos en n8n ejecutándose localmente.

El MVP se compone de dos piezas principales:

1) E-commerce demo:
- la fuente de datos de productos se ubica en el excel :
https://docs.google.com/spreadsheets/d/1TQXwskKWUQ3NQnXcVx4pE1Zpxtu8tns9/edit?gid=1620448077#gid=1620448077

- el e-commerce corresponde al proyecto front en el directorio e-commerce, esta listo no hacer modificaciones.

2) Agente de control de stock (n8n local):
- Recibe por correo un documento adjunto (foto o PDF) con una orden de compra o entrada de productos.
- Procesa el adjunto para extraer texto (PDF text o OCR si es imagen/escaneado).
- Interpreta el contenido y responde el correo con un resumen de lo entendido.
- Espera la confirmación explícita del usuario (reply con "OK <transaction_id>").
- Si el usuario aprueba, actualiza el stock en el mismo Google Sheet.
- Finalmente envía un correo con el resumen "antes y después" por SKU/producto.

Se busca mantener estructura IaaS:
- Infraestructura como código (Docker Compose, variables de entorno, persistencia).
- Servicios desplegables localmente (n8n y e-commerce).
- Workflows exportables (n8n) y configuración reproducible.

Principios clave:
- No se actualiza stock sin aprobación explícita.
- SKU/código es el identificador único (llave) para mapear productos en el Sheet.
- Transacciones auditables e idempotentes (no aplicar dos veces lo mismo).
- Cada tarea/etapa se implementa con un agente separado.

---

## 2) Alcance del MVP mostrable (Definition of Done global)

El MVP se considera listo cuando:

E-commerce:
- Catálogo muestra productos desde Google Sheet (proyecto desarrollado)

Agente (n8n local):
- Flujo A: ingesta correo + adjunto + extracción texto + parse a JSON + respuesta con resumen y transaction_id.
- Flujo B: recepción de "OK transaction_id" + lectura Sheet + actualización stock + reporte antes/después por SKU + correo final.
- Workflows exportados a archivos .json e importables.

Infra:
- Docker Compose levanta n8n (persistencia) y opcionalmente el e-commerce.
- .env.example documentado sin secretos.
- docs/runbook.md con pasos para levantar todo local.

---

## 3) Estructura del repositorio (recomendada)

stock-agent-iaas/
  infra/
    docker-compose.yml
    .env.example
    scripts/
  services/
    ecommerce-demo/
      app/
      Dockerfile
    n8n/
      workflows/
      credentials_templates/
  agents/
    00-orchestrator.md
    01-sheet-audit-agent.md
    02-sheet-imageurl-agent.md
    03-sheet-access-agent.md
    04-ecommerce-catalog-agent.md
    05-ecommerce-pdp-agent.md
    06-n8n-local-bootstrap-agent.md
    07-n8n-ingest-email-agent.md
    08-n8n-ocr-pdf-extract-agent.md
    09-n8n-llm-parse-agent.md
    10-n8n-approval-agent.md
    11-n8n-sheets-update-agent.md
    12-n8n-report-agent.md
  docs/
    runbook.md
    decisions.md
    demo-script.md

---


## 5) Reglas operativas para todos los agentes

- Cada agente debe crear o modificar solo los archivos de su ámbito.
- Si algo es ambiguo (por ejemplo, cuál columna es SKU), no adivinar: documentar en docs/decisions.md y dejarlo “pendiente”.
- No introducir secretos en el repo.
- Todo debe poder ejecutarse localmente con Docker Compose.

