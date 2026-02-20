# Princípios (SOLID) e Padrões de Projeto — Adote Fácil

## 1. Princípios SOLID

### S — Princípio da Responsabilidade Única (SRP)

O projeto demonstra aplicação do SRP ao separar claramente responsabilidades no backend:

* `routes.ts` apenas define endpoints e encadeia middlewares e controllers.
* `controllers/` recebem requisições HTTP e coordenam chamadas aos services.
* `services/` concentram regras de negócio.
* `repositories/` encapsulam acesso ao banco de dados.
* `middlewares/` tratam autenticação e validações.

Exemplo extraído de `routes.ts`:

```ts
router.post(
  '/animals',
  userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance),
  upload.array('pictures', 5),
  createAnimalControllerInstance.handle.bind(createAnimalControllerInstance),
)

```

### D — Princípio da Inversão de Dependência (DIP) — Oportunidade de Melhoria

Nas rotas, são utilizadas instâncias concretas diretamente, como no exemplo:

```ts
userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance)

```

Essa abordagem funciona, mas cria dependência direta da implementação concreta. Uma possível melhoria seria aplicar a injeção de dependência para reduzir o acoplamento e melhorar a testabilidade, programando contra interfaces em vez de classes concretas.

**Como poderia ser aplicado (Solução):**
Em vez de importar a instância diretamente no arquivo de rotas, poderíamos injetar a dependência via construtor, dependendo de uma abstração:

```ts
// 1. Criamos a abstração (Interface)
interface IAuthMiddleware {
  authenticate(req: Request, res: Response, next: NextFunction): void;
}

// 2. A classe de rotas passa a depender da interface, e não da implementação concreta
export class AnimalRoutes {
  constructor(private authMiddleware: IAuthMiddleware) {}

  public setup() {
    router.post(
      '/animals',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      // ...
    );
  }
}

```

---

## 2. Padrões de Projeto

### Padrão 1 — Chain of Responsibility (Aplicado)

O projeto utiliza o padrão Chain of Responsibility através do encadeamento de middlewares no framework Express.

Cada requisição passa por uma sequência de etapas antes de chegar ao controller. Caso algum middleware interrompa o fluxo (por exemplo, falha de autenticação), a execução não prossegue.

Exemplo em rotas:

```ts
router.post(
  '/animals',
  userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance),
  upload.array('pictures', 5),
  createAnimalControllerInstance.handle.bind(createAnimalControllerInstance),
)

```

Fluxo observado:

1. Middleware de autenticação
2. Middleware de upload
3. Controller responsável pela ação

Esse encadeamento sucessivo onde cada elo decide se passa a requisição adiante ou a encerra caracteriza perfeitamente o padrão Chain of Responsibility.

### Padrão 2 — Repository Pattern (Aplicado)

A presença da pasta `src/repositories/` indica a aplicação do Repository Pattern. O acesso ao banco de dados é encapsulado na classe de repositório, isolando a lógica de persistência da regra de negócio.

Exemplo extraído de `ChatRepository`:

```ts
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

```

Nesse trecho, observa-se que o repositório utiliza o Prisma para realizar operações no banco de dados, mantendo o acesso a dados centralizado nessa camada.
**Benefícios observados:**

* Redução do acoplamento entre services e banco de dados.
* Centralização das consultas.
* Maior facilidade para testes unitários.

### Padrão 3 — Singleton Pattern (Aplicado na Prática)

O uso de instâncias nomeadas como `userAuthMiddlewareInstance` e `createAnimalControllerInstance` indica a aplicação do padrão Singleton (baseado no cache de módulos do Node.js).

Em vez de criar um `new Controller()` a cada nova requisição, o sistema cria uma única instância do objeto na memória durante a inicialização do módulo e a reaproveita em todas as rotas que precisam dela.

Exemplo do conceito aplicado:

```ts
class CreateAnimalController {
  async handle(req: Request, res: Response) { /* ... */ }
}

// O módulo exporta uma única instância global para a aplicação (Singleton)
export const createAnimalControllerInstance = new CreateAnimalController();

```

Isso otimiza o consumo de memória, garantindo que objetos sem estado (stateless) não sejam instanciados repetidamente de forma desnecessária.

---

## 3. Conclusão

Com base na análise do código, o sistema demonstra boa organização arquitetural, com aplicação prática do Princípio da Responsabilidade Única (SRP), uso do padrão Chain of Responsibility via middlewares, Singleton na exportação de controllers e adoção do Repository Pattern para abstração do acesso ao banco de dados.

Como melhoria futura, a aplicação estruturada de injeção de dependência pode fortalecer o alinhamento com o Princípio da Inversão de Dependência (DIP), aumentando a testabilidade e reduzindo o acoplamento rígido entre os componentes.