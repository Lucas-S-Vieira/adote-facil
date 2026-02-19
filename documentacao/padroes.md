# Princípios (SOLID) e Padrões de Projeto — Adote Fácil

## 1. Princípios SOLID

### S — Princípio da Responsabilidade Única (SRP)

O projeto demonstra aplicação do SRP ao separar claramente responsabilidades no backend:

- `routes.ts` apenas define endpoints e encadeia middlewares e controllers.
- `controllers/` recebem requisições HTTP e coordenam chamadas aos services.
- `services/` concentram regras de negócio.
- `repositories/` encapsulam acesso ao banco de dados.
- `middlewares/` tratam autenticação e validações.

Exemplo extraído de `routes.ts`:

```ts
router.post(
  '/animals',
  userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance),
  upload.array('pictures', 5),
  createAnimalControllerInstance.handle.bind(createAnimalControllerInstance),
)

D — Princípio da Inversão de Dependência (DIP) — Oportunidade de Melhoria

Nas rotas, são utilizadas instâncias concretas diretamente, como no exemplo:

```ts`
userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance)


```md`
Essa abordagem funciona mas cria dependência direta da implementação concreta, uma possível melhoria seria aplicar injeção de dependência para reduzir acoplamento e melhorar testabilidade, programando contra interfaces em vez de classes concretas.

```md`
2. Padrões de Projeto
Padrão 1 — Chain of Responsibility (Aplicado)

O projeto utiliza o padrão Chain of Responsibility através do encadeamento de middlewares no Express.

Cada requisição passa por uma sequência de etapas antes de chegar ao controller. Caso algum middleware interrompa o fluxo (por exemplo, falha de autenticação), a execução não prossegue.

Exemplo:

router.post(
  '/animals',
  userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance),
  upload.array('pictures', 5),
  createAnimalControllerInstance.handle.bind(createAnimalControllerInstance),
)

Fluxo observado:

Middleware de autenticação

Middleware de upload

Controller responsável pela ação

Esse encadeamento caracteriza o padrão Chain of Responsibility.

```md`
Padrão 2 — Repository Pattern (Aplicado)

A presença da pasta src/repositories/ indica a aplicação do Repository Pattern.

O acesso ao banco de dados é encapsulado na classe de repositório, isolando a lógica de persistência da regra de negócio.

Exemplo extraído de ChatRepository:


export class ChatRepository {
  constructor(private readonly repository: PrismaClient) {}

  async create(params: CreateChatRepositoryDTO.Params) {
    return this.repository.chat.create({ data: params })
  }

  async findOneByUsersId(user1Id: string, user2Id: string) {
    return this.repository.chat.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    })
  }
}


Nesse trecho, observa-se que o repositório utiliza o Prisma para realizar operações no banco de dados, mantendo o acesso a dados centralizado nessa camada.

Benefícios observados:

Redução do acoplamento entre services e banco de dados.

Centralização das consultas.

Maior facilidade para testes unitários.

```md`
3. Conclusão

Com base na análise do código, o sistema demonstra boa organização arquitetural, com aplicação prática do Princípio da Responsabilidade Única, uso do padrão Chain of Responsibility via middlewares e adoção do Repository Pattern para abstração do acesso ao banco de dados.

Como melhoria futura, a aplicação de injeção de dependência pode fortalecer o alinhamento com o Princípio da Inversão de Dependência (DIP), aumentando a testabilidade e reduzindo o acoplamento entre componentes.