# PR5 — Análise DevOps e melhorias no CI/CD

## Contexto atual do projeto

O repositório possui:

- Workflow GitHub Actions em `.github/workflows/experimento-ci-cd.yml`
- Orquestração via `docker-compose.yml`
- Containers para backend, frontend e banco de dados

O pipeline executa:
1. Testes unitários no backend
2. Build do projeto
3. Subida temporária dos containers
4. Geração de artefato

---

## Melhorias implementadas

### 1) Correção da execução do Docker Compose

O `docker-compose.yml` está localizado na raiz do projeto.  
Anteriormente, o workflow executava `docker compose up` dentro do diretório `./backend`.

Isso poderia impedir que o GitHub Actions encontrasse corretamente o arquivo `docker-compose.yml`.

**Correção aplicada:**  
Remoção do `working-directory: ./backend` no step de subida dos containers, garantindo que o Docker Compose seja executado na raiz do repositório.

---

### 2) Uso de `npm ci` no lugar de `npm install`

O pipeline utilizava `npm install` para instalar dependências.

Em ambientes de integração contínua, recomenda-se utilizar `npm ci`, pois:

- Garante instalação determinística
- É mais rápido
- Utiliza estritamente o `package-lock.json`
- Evita inconsistências entre ambientes

**Correção aplicada:**  
Substituição de `npm install` por `npm ci`.

---

## Melhorias sugeridas para evolução futura

- Adicionar cache de dependências no GitHub Actions.
- Adicionar etapa de lint (ESLint) no pipeline.
- Substituir uso de `sleep` por espera ativa baseada em healthcheck.
- Implementar multi-stage build no Dockerfile para reduzir tamanho das imagens.
- Separar variáveis sensíveis para ambientes distintos (CI, desenvolvimento e produção).

---

## Conclusão

As melhorias aplicadas tornam o pipeline mais estável e alinhado às boas práticas de CI/CD.

O projeto passa a ter um fluxo mais confiável e reproduzível, reduzindo falhas relacionadas a ambiente e execução do Docker Compose.
