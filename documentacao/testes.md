# Testes Automatizados — Adote Fácil (PR4)

## Ferramenta utilizada

Os testes de aceitação foram implementados utilizando **Cypress (E2E)**, simulando a interação real do usuário com a aplicação frontend.

---

## Cenários de teste

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

## Análise dos Testes Unitários (Backend)

Os testes unitários do backend (escritos em Jest) cobrem a camada de `Services` (regras de negócio) para os módulos de Usuário, Animal e Chat. A estratégia atual utiliza a biblioteca `jest-mock-extended` para simular o comportamento dos Repositórios e Provedores (como o Prisma e o Bcrypt), garantindo que os testes sejam rápidos e isolados do banco de dados real.

### Pontos Fortes Identificados:

* **Isolamento Eficiente:** O uso de `MockProxy` garante que a camada de persistência (Prisma) não seja acionada durante os testes unitários.
* **Cobertura de Fluxos Alternativos:** Os testes validam não apenas o "caminho feliz" (`Success`), mas também o tratamento de exceções de negócio, como tentativas de criar um chat consigo mesmo ou e-mails duplicados (`Failure`).
* **Validação de Contratos:** O uso massivo de `toHaveBeenCalledWith` assegura que os Services estão repassando os dados no formato correto para os Repositórios.

### Melhorias Propostas (Ações Futuras):

**1. Ausência de Testes na Camada de Controllers:**
Atualmente, a suíte foca quase exclusivamente na camada `Service`.

* **Proposta:** Criar arquivos `.spec.ts` para os `Controllers` mockando as instâncias de Request (`req`) e Response (`res`) do Express. Isso garantirá que cláusulas de guarda (como a verificação de `user.id` no *upload* de animais) e os mapeamentos de Status HTTP (201, 400, 500) sejam validados automaticamente.

**2. Riscos de Escopo com `beforeAll` vs `beforeEach`:**
Em alguns arquivos (como `create-user-chat.spec.ts` e `create-animal.spec.ts`), os mocks são inicializados dentro do bloco `beforeAll`.

* **Proposta:** Mover a instanciação dos mocks (`mock<Repository>()`) para dentro do bloco `beforeEach`. Embora o estado das chamadas (`mockClear`) possa ser limpo, instanciar no `beforeAll` significa que a mesma instância do mock é compartilhada por todos os testes do arquivo. Isso pode gerar falsos positivos se um teste anterior sofrer mutação ou falhar de forma inesperada. O uso do `beforeEach` garante um estado de memória 100% virgem para cada bloco `test`.