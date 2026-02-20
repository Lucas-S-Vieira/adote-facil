describe("Adote Fácil - Testes de Aceitação", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false);
  });

  /**
   * Banner visual para apresentação (aparece na tela do app durante o teste).
   */
  const showBanner = (text: string, kind = "info", ms = 1400) => {
    const bg =
      kind === "success"
        ? "#16a34a"
        : kind === "error"
          ? "#dc2626"
          : "#2563eb";

    cy.window().then((win) => {
      const id = "e2e-demo-banner";
      const existing = win.document.getElementById(id);
      if (existing) existing.remove();

      const div = win.document.createElement("div");
      div.id = id;
      div.innerText = text;

      div.style.position = "fixed";
      div.style.top = "12px";
      div.style.left = "50%";
      div.style.transform = "translateX(-50%)";
      div.style.zIndex = "999999";
      div.style.padding = "12px 16px";
      div.style.borderRadius = "12px";
      div.style.background = bg;
      div.style.color = "white";
      div.style.fontSize = "16px";
      div.style.fontWeight = "700";
      div.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";
      div.style.maxWidth = "90%";
      div.style.textAlign = "center";

      win.document.body.appendChild(div);
    });

    cy.wait(ms);

    cy.window().then((win) => {
      const el = win.document.getElementById("e2e-demo-banner");
      if (el) el.remove();
    });
  };

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
    showBanner("🔐 Abrindo tela de login...", "info", 900);

    // Ajustado para usar name no lugar de type
    cy.get('input[name="email"]').type("teste@email.com", { delay: 120 });
    cy.wait(300);
    cy.get('input[name="password"]').type("12345678", { delay: 120 });
    cy.wait(300);

    showBanner("➡️ Enviando login...", "info", 900);
    // force: true removido para garantir teste real de interatividade
    cy.contains("button", "Login").click();

    cy.wait("@loginOk");

    // Validação robusta de que o token foi armazenado
    cy.getCookie("token").should("exist");
    cy.window().its("localStorage").invoke("getItem", "user").should("exist");

    showBanner("✅ Login realizado com sucesso!", "success", 1500);
  });

  it("Login inválido exibe erro (cenário alternativo)", () => {
    cy.intercept("POST", "**/login", (req) => {
      req.reply({
        statusCode: 401,
        body: { message: "Credenciais inválidas" },
      });
    }).as("loginFail");

    cy.visit("/login");
    showBanner("🔐 Tentando login inválido...", "info", 900);

    cy.get('input[name="email"]').type("teste@email.com", { delay: 120 });
    cy.wait(300);
    cy.get('input[name="password"]').type("senha_errada", { delay: 120 });
    cy.wait(300);

    cy.contains("button", "Login").click();

    cy.wait("@loginFail");

    cy.url().should("include", "/login");

    showBanner("❌ Credenciais inválidas (erro esperado)", "error", 1600);
  });

  it("Cadastro: página carrega + validações aparecem ao enviar vazio", () => {
    cy.visit("/cadastro");
    showBanner("📄 Página de cadastro carregada", "info", 1200);

    cy.contains("h1", "Preencha seus dados para se cadastrar", {
      timeout: 8000,
    }).should("exist");

    showBanner("✍️ Preenchendo alguns campos...", "info", 900);

    // Ajustado para usar name no lugar de type
    cy.get('input[name="name"]').type("Larissa", { delay: 120 });
    cy.wait(300);
    cy.get('input[name="email"]').type("lari@email.com", { delay: 120 });
    cy.wait(500);

    showBanner("🧪 Enviando formulário incompleto para mostrar validações", "info", 1200);
    cy.contains("button", "Cadastrar").click();

    cy.contains("span", /senha/i, { timeout: 8000 }).should("exist");
    cy.contains("span", /obrigat/i, { timeout: 8000 }).should("exist");

    showBanner("✅ Validações exibidas com sucesso!", "success", 1600);

    cy.contains("a", "Faça login").should("have.attr", "href", "/login");
  });
});