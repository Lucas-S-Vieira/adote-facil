# Code Smells e Refatorações — Adote Fácil

## 1. Code Smell: Verbosidade Excessiva no uso de `.bind()`

No arquivo `routes.ts`, observa-se repetição frequente do padrão:

```ts
createAnimalControllerInstance.handle.bind(createAnimalControllerInstance)

```

Esse padrão aparece em diversas rotas.

Problema identificado

Repetição de código.

Redução da legibilidade.

Maior chance de erro humano.

Refatoração sugerida

Uma alternativa é utilizar arrow functions ou garantir que o método já esteja corretamente vinculado no construtor da classe.

Exemplo de refatoração:

```ts
router.post('/animals', (req, res) =>
  createAnimalControllerInstance.handle(req, res)
)

```

Essa abordagem elimina a necessidade do uso repetitivo de `.bind()`, tornando o código mais limpo.

## 2. Code Smell: Método com múltiplas responsabilidades

No arquivo `create-animal.ts`, o método `handle` executa diversas responsabilidades:

* Extração de dados da requisição
* Transformação de arquivos (map de buffers)
* Chamada da regra de negócio
* Definição de status HTTP
* Tratamento de erro

Trecho original:

```ts
async handle(request: Request, response: Response): Promise<Response> {
  const { name, type, gender, race, description } = request.body
  const { user } = request
  const pictures = request.files as Express.Multer.File[]

  try {
    const pictureBuffers = pictures.map((file) => file.buffer)

    const result = await this.createAnimal.execute({
      name,
      type,
      gender,
      race,
      description,
      userId: user?.id || '',
      pictures: pictureBuffers,
    })

    const statusCode = result.isFailure() ? 400 : 201

    return response.status(statusCode).json(result.value)
  } catch (err) {
    const error = err as Error
    console.error('Error creating animal:', error)
    return response.status(500).json({ error: error.message })
  }
}

```

Problema identificado:

O método está acumulando múltiplas responsabilidades, o que pode dificultar manutenção e testes.

Refatoração sugerida:

Extrair a lógica de transformação de imagens para um método auxiliar:

```ts
private extractPictureBuffers(files: Express.Multer.File[]) {
  return files.map((file) => file.buffer)
}

```

E utilizar no método principal:

```ts
const pictureBuffers = this.extractPictureBuffers(pictures)

```

Essa separação melhora legibilidade e mantém o princípio da responsabilidade única.

## 3. Code Smell: Uso inseguro de valor padrão vazio para ID

Trecho original identificado no controller:

```ts
userId: user?.id || '',

```

Problema identificado:

O uso de string vazia como valor padrão pode mascarar falhas de autenticação e gerar inconsistências no banco de dados.

Caso "user" esteja indefinido, o código ainda continuará executando, enviando um ID inválido para a camada de serviço.

Isso pode:

Gerar registros inconsistentes

Dificultar rastreamento de erros

Esconder problemas de autenticação

Refatoração sugerida:

Realizar validação explícita antes de chamar o service:

```ts
if (!user?.id) {
  return response.status(401).json({ error: 'User not authenticated' })
}

```

E então passar o ID de forma segura:

```ts
const result = await this.createAnimal.execute({
  name,
  type,
  gender,
  race,
  description,
  userId: user.id,
  pictures: pictureBuffers,
})

```

Essa abordagem torna o fluxo mais seguro, explícito e evita persistência de dados inválidos.