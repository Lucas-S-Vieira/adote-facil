describe("Adote Fácil - Testes de Aceitação", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
  });

  it("Login com sucesso (cenário principal)", () => {
    cy.intercept("POST", "**/login", (req) => {
      req.reply({
        statusCode: 201,
        body: {
          token: "fake-token",
          user: { id: "1", name: "Usuário Teste", email: "teste@email.com" },
        },
      });
    }).as("loginOk");

    cy.visit("/login");

    cy.get('input[type="email"]').type("teste@email.com", { force: true });
    cy.get('input[type="password"]').type("12345678", { force: true });
    cy.contains("button", "Login").click({ force: true });

    cy.wait("@loginOk");

    // valida efeito do login (sem depender de redirect/rota protegida)
    cy.window().then((win) => {
      expect(win.localStorage.getItem("user")).to.not.be.null;
    });
  });

  it("Login inválido exibe erro (cenário alternativo)", () => {
    cy.intercept("POST", "**/login", (req) => {
      req.reply({
        statusCode: 401,
        body: { message: "Credenciais inválidas" },
      });
    }).as("loginFail");

    cy.on("window:alert", (txt) => {
      expect(txt.toLowerCase()).to.match(/credenciais|inválido|erro/);
    });

    cy.visit("/login");

    cy.get('input[type="email"]').type("teste@email.com", { force: true });
    cy.get('input[type="password"]').type("senha_errada", { force: true });
    cy.contains("button", "Login").click({ force: true });

    cy.wait("@loginFail");
    cy.url().should("include", "/login");
  });

  it("Página de cadastro carrega e contém elementos essenciais", () => {
    cy.visit("/cadastro");

    // texto fixo do seu h1
    cy.contains(
      "Preencha seus dados para se cadastrar em nossa plataforma",
      { timeout: 8000 }
    ).should("exist");

    // inputs garantidos pelo seu código
    cy.get('input[type="text"]').should("exist");  // nome
    cy.get('input[type="email"]').should("exist"); // email

    // botão garantido
    cy.contains("button", "Cadastrar").should("exist");

    // link garantido
    cy.contains("a", "Faça login").should("have.attr", "href", "/login");
  });
});
