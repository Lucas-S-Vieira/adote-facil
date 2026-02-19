# Testes Automatizados — Adote Fácil (PR4)

## Ferramenta utilizada

Os testes de aceitação foram implementados utilizando **Cypress (E2E)**, simulando a interação real do usuário com a aplicação frontend.

---

## Cenários de teste (linguagem natural)

### Teste 1 — Login com sucesso (cenário principal)

**Dado** que o usuário está na tela de login  
**Quando** informa e-mail e senha válidos e confirma  
**Então** o sistema realiza a requisição de login e armazena os dados do usuário no navegador.

---

### Teste 2 — Login inválido (cenário alternativo)

**Dado** que o usuário está na tela de login  
**Quando** informa credenciais inválidas  
**Então** o sistema exibe mensagem de erro e permanece na tela de login.

---

### Teste 3 — Página de cadastro carrega corretamente

**Dado** que o usuário acessa a rota /cadastro  
**Quando** a página é carregada  
**Então** os campos essenciais (nome, email) e o botão de cadastro estão presentes.

---

## Como executar os testes

### 1. Iniciar o frontend

No diretório `frontend`:

```bash
npm run dev

## Observação

Para evitar dependência de backend ou banco de dados, os testes utilizam cy.intercept() para simular respostas da API nos cenários de login.