# Planejamento da Avaliação de IHC — GYM GAIN
**Disciplina:** Interação Humano-Computador  
**Framework:** DECIDE (Preece, Rogers & Sharp, 2002)  
**Data de elaboração:** 08/04/2026  
**Sistema avaliado:** GYM GAIN — Aplicativo mobile de gerenciamento de treinos de academia  
**Repositório:** https://github.com/felipecass15122/gym  

---

## Visão Geral do Sistema

O **GYM GAIN** é um aplicativo mobile para Android desenvolvido para auxiliar praticantes de musculação no planejamento, registro e acompanhamento de treinos. O app possui três módulos principais:

| Módulo | Função |
|---|---|
| **Treinos** | Registro de exercícios, séries, cargas (kg) e repetições por plano de treino (A1, B1, A2, B2, A3, B3, Extras) |
| **Calendário** | Planejamento mensal de treinos com atribuição de dias e gerador de ciclos automáticos |
| **Progresso** | Painel de evolução com ranking de força (1RM estimado), volume total, integração com wearable (Galaxy Fit 3) e registro de peso corporal |

---

## Contexto Avaliativo Enriquecido

### 2.1 — Estado Atual de Usabilidade

Com base na inspeção direta do aplicativo antes da avaliação formal, foram identificadas as seguintes características que orientam as hipóteses e os critérios de avaliação:

- **Ausência de onboarding e ajuda contextual:** O app não possui tela de boas-vindas, tutoriais ou tooltips. A única exceção é um `tipBox` na tela de adição de exercícios que exemplifica o formato do campo "Protocolo/Séries". Todos os demais módulos carecem de texto explicativo.
- **Terminologia especializada sem legenda:** A coluna "TIPO" nos cards de exercício exibe rótulos como "Feeder", "Top Set", "Working" e "Back-off", derivados do protocolo cadastrado. Esses termos são convenções do universo do treinamento de força e não possuem qualquer legenda ou explicação na interface.
- **Ação destrutiva de baixa visibilidade:** O botão "Limpar Mês Atual" está aninhado dois níveis abaixo do calendário principal (acesso via modal de dia → submenu do Gerador de Ciclo), tornando-o difícil de encontrar mas também difícil de acionar acidentalmente.
- **Métricas sem contextualização:** O label "1RM Est." (Estimativa de 1 Rep Max) é exibido como título de seção no painel de Progresso sem indicar a fórmula utilizada (Epley: `carga × (1 + reps / 30)`) nem o que o valor representa para usuários não familiarizados com o conceito.
- **Navegação de peso visual uniforme:** A barra de navegação inferior apresenta as três abas (TREINOS, CALENDÁRIO, PROGRESSO) com mesmo destaque visual, sem indicação de hierarquia ou fluxo recomendado de uso.

---

### 2.2 — Dimensões de Usabilidade de Nielsen Mapeadas aos Módulos

| Dimensão | Módulo Treinos | Módulo Calendário | Módulo Progresso |
|---|---|---|---|
| **Aprendizagem** | Campo "Protocolo/Séries" exige formato textual com barra (`2 Feeder \| 1 Top Set`) — convenção interna não padronizada, sem modelo visual além do `tipBox` | Gerador de Ciclo é acessado somente via modal de dia — função não visível no nível superior do módulo | Cálculo de 1RM não explicado; "Ranking de Força" não possui legenda ou escala de referência |
| **Eficiência** | Registro KG/REPS em linha por série é eficiente; botões de + e − estão próximos do campo | Atribuição de treino a um dia requer 2 toques (selecionar dia → escolher tipo) | Abas "Cargas" e "Peso Corporal" claramente separadas; botão de sincronização wearable disponível |
| **Memorabilidade** | Siglas FS/WS em protocolos pré-cadastrados vs. linguagem livre em novos exercícios gera inconsistência no rótulo "TIPO" | Ciclo de 12 dias: o dia de início do ciclo depende de qual célula foi clicada — lógica não memorável sem uso frequente | Ranking persiste entre sessões, mas não indica a data do último registro de cada exercício |
| **Erros** | Botão Trash (excluir exercício) na barra flutuante, ao lado de "Baixar Planilha", sem confirmação via `Alert` | "Limpar Mês Atual" possui `Alert.alert` de confirmação implementado; "Remover Marcação do Dia" não possui | Exclusão de registro de peso por `onLongPress` — padrão de interação não sinalizado na interface |
| **Satisfação** | Tema escuro com paleta laranja/azul; layout em tabela coerente com os dados; ícone `X` para remover sem confirmação | Células do calendário coloridas por tipo de treino — boa sinalização do estado mensal | Gráfico de linha com curva bezier; integração Galaxy Fit 3 representa diferencial de valor percebido |

---

### 2.3 — Hipóteses de Usabilidade

As hipóteses a seguir são testáveis pelos métodos definidos e rastreáveis a comportamentos observados no app:

**H1 — Aprendizagem / Campo de Protocolo:**
A maioria dos participantes não conseguirá preencher corretamente o campo "Protocolo/Séries" ao adicionar um exercício novo sem ler o `tipBox`, pois o formato `"2 Feeder | 1 Top Set"` é uma convenção interna sem equivalente em outros apps de treino.

**H2 — Aprendizagem / Gerador de Ciclo:**
O Gerador de Ciclo terá baixa taxa de descoberta espontânea na primeira sessão, pois o acesso à função só é possível após tocar em um dia do calendário — a funcionalidade não está visível no nível superior do módulo.

**H3 — Erros / Ação Destrutiva no Módulo Treinos:**
O botão flutuante de exclusão (Trash) no módulo Treinos causará hesitação ou cliques acidentais, pois está posicionado adjacente ao botão "Baixar Planilha" sem separação visual adequada e sem `Alert.alert` de confirmação (diferente do "Limpar Mês" que possui confirmação implementada).

**H4 — Terminologia / 1RM Estimado:**
Participantes com menos de 1 ano de experiência em musculação não compreenderão o significado de "1RM Est." nem saberão interpretar os valores exibidos no Ranking de Força sem explicação externa.

**H5 — Memorabilidade / Classificação de Séries:**
A variação entre protocolos pré-cadastrados (que exibem "FS"/"WS" na coluna TIPO) e protocolos criados pelo usuário (que exibem texto livre) gerará inconsistência visual que reduz a memorabilidade e a confiança no sistema de classificação.

**H6 — Satisfação / Integração Wearable:**
A integração com o Galaxy Fit 3 gerará expectativa positiva, mas potencial frustração caso o botão "Sincronizar" não retorne dados imediatamente — o estado de carregamento (`isSyncing`) não informa o motivo de falha nem oferece alternativa manual de entrada.

---

### 2.4 — Critérios de Sucesso e Falha por Dimensão

| Dimensão | Indicador | Critério de Sucesso | Critério de Falha |
|---|---|---|---|
| Aprendizagem | % de participantes que completam T3 (adicionar exercício) sem ajuda | ≥ 80% completam sem auxílio | < 60% completam sem auxílio |
| Aprendizagem | Taxa de descoberta espontânea do Gerador de Ciclo (T6) | ≥ 3 de 5 participantes encontram sem dica | ≤ 1 de 5 encontra sem dica |
| Eficiência | Tempo médio para completar T2 (registrar carga de 15 kg) | ≤ 45 segundos | > 90 segundos |
| Erros | Nº de cliques acidentais no Trash ou "Limpar Mês" | 0 cliques não-intencionais | ≥ 2 participantes clicam acidentalmente |
| Satisfação | Score SUS médio do grupo | ≥ 68 — acima da média (Bangor et al., 2009) | < 51 — inaceitável |
| Satisfação | Resposta à P12 (intenção de uso contínuo) | ≥ 4 de 5 participantes respondem positivamente | ≤ 2 de 5 respondem positivamente |
| Heurísticas | Nº de problemas com severidade 3 ou 4 identificados | ≤ 3 problemas graves | ≥ 6 problemas graves |

---

### 2.5 — Contexto de Uso do Usuário-Alvo

O GYM GAIN é projetado para uso **dentro ou imediatamente após séries de musculação**. Este contexto impõe restrições específicas que a avaliação deve considerar:

- **Ambiente físico:** academias de musculação apresentam alto nível de ruído (música, equipamentos), iluminação variável e superfícies sem apoio adequado para o celular. Usuários podem estar com mãos suadas ou usando luvas de treino, reduzindo a precisão em alvos de toque pequenos.
- **Estado físico do usuário:** durante o treino, o usuário opera sob fadiga muscular progressiva e elevação da frequência cardíaca. A coordenação motora fina é reduzida, tornando campos numéricos pequenos (KG, REPS) mais suscetíveis a erros de entrada.
- **Pressão de tempo:** o intervalo entre séries típico varia de 60 a 120 segundos. Qualquer fluxo de registro que exija mais de 2–3 toques representa um custo de usabilidade relevante neste contexto.
- **Postura de uso:** o app é frequentemente operado com uma mão enquanto a outra segura equipamento ou repousa. Elementos interativos posicionados nas bordas superiores da tela são mais difíceis de alcançar com o polegar.
- **Conectividade:** academias podem ter sinal instável. A sincronização em tempo real com o Firebase pode apresentar latência perceptível, gerando incerteza sobre o estado de salvamento dos dados.
- **Carga cognitiva:** o usuário está com atenção dividida entre o treino e o registro. Termos ambíguos, fluxos de múltiplos passos ou feedbacks de sistema pouco claros aumentam significativamente a probabilidade de erro ou abandono da tarefa.

---

## Framework DECIDE

```
D → Determine os objetivos
E → Explore as perguntas
C → Choose os métodos
I → Identifique questões práticas
D → Decida sobre questões éticas
E → Evaluate, interprete e apresente os dados
```

---

## D — Determinar os Objetivos da Avaliação

### Objetivo Geral
Avaliar a usabilidade e a experiência do usuário (UX) do aplicativo GYM GAIN, identificando problemas de interação que possam dificultar o uso eficiente do sistema por praticantes de musculação com diferentes níveis de experiência tecnológica.

### Objetivos Específicos

**OBJ-1 — Eficácia da interface de registro de treinos**  
Verificar se os usuários conseguem registrar corretamente seus treinos (exercícios, cargas e repetições) sem erros e sem necessidade de ajuda externa.

**OBJ-2 — Compreensibilidade da terminologia**  
Avaliar se termos técnicos exibidos no app (ex.: "FS", "WS", "Rest Pause", "1RM Est.", "Gerador de Ciclo", "Ciclo 12 Dias") são compreendidos pelos usuários-alvo.

**OBJ-3 — Usabilidade do módulo Calendário**  
Identificar se o fluxo de planejamento mensal de treinos (atribuição de dias e uso do gerador de ciclos) é intuitivo e eficiente.

**OBJ-4 — Satisfação geral com a interface**  
Medir o grau de satisfação dos usuários com o design visual, organização das informações e facilidade de uso geral do aplicativo.

**OBJ-5 — Conformidade com heurísticas de usabilidade**  
Identificar violações das heurísticas de Nielsen presentes na interface, sem a participação de usuários.

---

## E — Explorar as Perguntas da Avaliação

As perguntas abaixo foram derivadas dos objetivos e consideram o perfil dos usuários-alvo (praticantes de musculação, jovens adultos, com variados níveis de familiaridade com aplicativos).

### Relacionadas ao OBJ-1 (Eficácia no registro)
- **P1:** Os usuários conseguem localizar e registrar um exercício com carga e repetições na primeira tentativa?
- **P2:** O fluxo para adicionar um novo exercício a um treino é claro e sem ambiguidades?
- **P3:** Os campos de entrada de dados (KG e REPS) são fáceis de identificar e preencher?

### Relacionadas ao OBJ-2 (Terminologia)
- **P4:** Os usuários entendem o que significam as siglas "FS" (Feeder Sets), "WS" (Working Sets) e "Rest Pause" sem auxílio externo?
- **P5:** O termo "1RM Est." no painel de progresso é compreensível para usuários não iniciados no universo do treinamento de força?
- **P6:** A nomenclatura dos planos de treino (A1, B1, A2, B2, A3, B3) é intuitiva?

### Relacionadas ao OBJ-3 (Calendário)
- **P7:** Os usuários conseguem atribuir um tipo de treino a um dia no calendário sem dificuldade?
- **P8:** A função "Gerador de Ciclo" é compreendida e utilizada corretamente sem explicação prévia?
- **P9:** O botão "Limpar Mês Atual" (ação destrutiva) é suficientemente diferenciado visualmente para evitar cliques acidentais?

### Relacionadas ao OBJ-4 (Satisfação)
- **P10:** Os usuários avaliam positivamente o design visual do aplicativo (tema escuro, paleta laranja/azul)?
- **P11:** O aplicativo causa sensação de controle e confiança durante o uso?
- **P12:** Os usuários voltariam a usar o aplicativo no dia a dia de seus treinos?

### Relacionadas ao OBJ-5 (Heurísticas)
- **P13:** A interface respeita as 10 heurísticas de usabilidade de Nielsen?
- **P14:** Existem inconsistências visuais ou de interação entre os três módulos do app?

---

## C — Escolher os Métodos de Avaliação

Foram selecionados **dois métodos complementares**: um sem participação de usuários e outro com participação de usuários.

### Método 1 — Avaliação Heurística (sem usuários)
> Método de inspeção onde avaliadores especialistas percorrem a interface julgando cada elemento com base em um conjunto de heurísticas estabelecidas.

- **Base:** 10 Heurísticas de Nielsen (1994)
- **Avaliadores:** Membros da equipe do projeto (mínimo 3 avaliadores)
- **Cobertura:** Todos os três módulos do app (Treinos, Calendário, Progresso)

### Método 2 — Teste de Usabilidade com Protocolo Think-Aloud (com usuários)
> Técnica em que participantes realizam tarefas definidas no sistema enquanto verbalizam seus pensamentos em voz alta.

- **Complementado por:** Questionário SUS (System Usability Scale) pós-teste
- **Participantes:** 5 usuários (número recomendado por Nielsen para detectar ~85% dos problemas)

### Análise de Cobertura dos Métodos

| Pergunta | Avaliação Heurística | Teste de Usabilidade |
|---|:---:|:---:|
| P1 — Registro de exercício | ✓ | ✓ |
| P2 — Fluxo de adicionar exercício | ✓ | ✓ |
| P3 — Campos KG e REPS | ✓ | ✓ |
| P4 — Siglas FS/WS/Rest Pause | ✓ | ✓ |
| P5 — Termo 1RM Est. | ✓ | ✓ |
| P6 — Nomenclatura A1/B1... | ✓ | ✓ |
| P7 — Atribuição de dia no calendário | ✓ | ✓ |
| P8 — Gerador de Ciclo | ✓ | ✓ |
| P9 — Botão "Limpar Mês" (destrutivo) | ✓ | ✓ |
| P10 — Satisfação visual | — | ✓ |
| P11 — Sensação de controle | — | ✓ |
| P12 — Intenção de uso contínuo | — | ✓ |
| P13 — Conformidade heurística | ✓ | — |
| P14 — Inconsistências entre módulos | ✓ | — |

> **Conclusão:** A combinação dos dois métodos cobre todas as 14 perguntas definidas, sendo complementares entre si. A avaliação heurística é mais eficaz para problemas estruturais e de consistência; o teste de usabilidade capta a experiência real e a satisfação dos usuários.

---

## I — Identificar e Administrar Questões Práticas

### 4. Aplicação da Técnica SEM Participação de Usuários — Avaliação Heurística

#### Quem vai executar
- 3 avaliadores membros da equipe, cada um individualmente, sem comunicação entre si durante a avaliação individual.

#### Partes do sistema avaliadas
Todos os fluxos visíveis nas telas:
1. Tela de Treinos (listagem de exercícios, séries, campos de entrada, botão "Adicionar Exercício", "Baixar Planilha", botão excluir)
2. Tela de Calendário (visualização mensal, modal de atribuição de treino, gerador de ciclo, limpar mês)
3. Tela de Progresso — Cargas (volume total, maior carga, ranking de força)
4. Tela de Progresso — Peso Corporal (integração Galaxy Fit 3, registro de peso, gráfico de evolução)

#### Instrumento utilizado
Planilha de registro de problemas heurísticos com os campos:

| Campo | Descrição |
|---|---|
| ID | Identificador único do problema |
| Tela/Componente | Onde o problema foi encontrado |
| Heurística violada | Qual das 10 heurísticas de Nielsen foi violada |
| Descrição do problema | Descrição objetiva |
| Severidade | Escala 0–4 de Nielsen |
| Evidência (print) | Captura de tela indicando o problema |
| Sugestão de melhoria | Proposta do avaliador |

**Escala de severidade (Nielsen):**
- 0 — Não é um problema
- 1 — Cosmético (corrigir se houver tempo)
- 2 — Pequeno (baixa prioridade)
- 3 — Grande (alta prioridade)
- 4 — Catastrófico (deve ser corrigido antes do lançamento)

#### Onde e como será realizado
- Cada avaliador acessa o aplicativo instalado em um dispositivo Android físico ou emulador
- A avaliação individual tem duração estimada de **60 a 90 minutos por avaliador**
- Após a avaliação individual, o grupo se reúne para consolidar os problemas (sessão de consolidação: ~60 minutos)

#### Tempo total previsto
- Avaliação individual: 3 × 90 min = 270 min
- Consolidação em grupo: 60 min
- **Total: ~5,5 horas**

---

### 5. Aplicação da Técnica COM Participação de Usuários — Teste de Usabilidade (Think-Aloud + SUS)

#### Perfil e quantidade de participantes

| Grupo | Perfil | Quantidade |
|---|---|---|
| Iniciantes em apps de treino | Praticantes de musculação que nunca usaram app de treino | 2 |
| Usuários experientes em apps | Praticantes que já usam algum app de treino (ex: Hevy, Strong) | 2 |
| Perfil intermediário | Praticam musculação e usam apps esporadicamente | 1 |

**Total: 5 participantes** (Nielsen, 1994 — número ideal para detectar a maioria dos problemas)

#### Recrutamento dos participantes
- Recrutamento por conveniência (conhecidos, colegas, frequentadores de academia)
- Critério de inclusão: ser praticante de musculação, ter smartphone Android
- Critério de exclusão: nunca ter praticado musculação
- Contato via WhatsApp/Instagram com breve formulário de triagem

#### Roteiro de Tarefas (Think-Aloud)

Os participantes deverão realizar as seguintes tarefas, em sequência, sem receber instruções além do enunciado:

| # | Tarefa | Objetivo avaliado |
|---|---|---|
| T1 | "Identifique qual treino está selecionado atualmente." | Orientação/navegação (P1, P6) |
| T2 | "Registre sua carga para o primeiro exercício do treino." | Registro de dados (P1, P3) |
| T3 | "Adicione um novo exercício ao treino" | Fluxo de adição (P2) |
| T4 | "O que significam os termos 'x3-5 (FS)' e 'x8-12 (WS)' que aparecem no aplicativo?" | Terminologia (P4) |
| T5 | "Atribua o treino B1 ao dia 15 de abril." | Calendário (P7) |
| T6 | "Preencha o mês de abril com os treinos programados." | Gerador de Ciclo (P8) |
| T7 | "Encontre qual é a sua maior carga registrada no app." | Progresso (P5) |
| T8 | "Registre seu peso corporal de hoje como 75 kg." | Peso Corporal (P3) |

#### Formulário de Observação por Tarefa

Para cada tarefa executada, o moderador preenche um registro com os campos abaixo. Este formulário deve constar no documento de avaliação (formulário de avaliação .docx).

| Campo | Tipo | Descrição |
|---|---|---|
| Participante | ID (P1–P5) | Identificação do participante |
| Tarefa | ID (T1–T8) | Número da tarefa executada |
| Horário de início | HH:MM:SS | Momento em que a tarefa foi iniciada |
| Horário de término | HH:MM:SS | Momento em que a tarefa foi concluída ou abandonada |
| Duração | Calculado | Tempo total de execução (término − início) |
| Quantidade de erros | Inteiro | Número de erros observados durante a execução |
| Tarefa concluída | Sim / Não | Indica se o participante completou a tarefa |
| Precisou de ajuda | Sim / Não | Indica se o participante solicitou ou recebeu auxílio |
| Observações | Texto livre | Verbalizações relevantes, hesitações, comportamentos notáveis |

#### Condução das sessões
- **Local:** Presencial (sala da universidade ou ambiente controlado) ou remoto (Google Meet com compartilhamento de tela)
- **Equipamentos necessários:**
  - Smartphone Android com o GYM GAIN instalado
  - Celular ou caderno para as anotações
  - Formulário SUS impresso ou digital (Google Forms)
- **Moderador:** 1 membro da equipe conduz a sessão
- **Duração por sessão:** Janela de treino do participante

#### Questionário SUS (System Usability Scale)
O SUS é composto por 10 afirmações com escala Likert de 1 a 5. A pontuação final varia de 0 a 100. Pontuações acima de 68 são consideradas acima da média.

| # | Afirmação |
|---|---|
| 1 | Eu acho que gostaria de usar esse sistema frequentemente |
| 2 | Eu acho o sistema desnecessariamente complexo |
| 3 | Eu achei o sistema fácil de usar |
| 4 | Eu acho que precisaria de ajuda de uma pessoa técnica para usar esse sistema |
| 5 | Eu acho que as várias funções do sistema estão bem integradas |
| 6 | Eu acho que há muita inconsistência nesse sistema |
| 7 | Eu imagino que a maioria das pessoas aprenderia a usar esse sistema rapidamente |
| 8 | Eu achei o sistema muito difícil de usar |
| 9 | Eu me senti muito confiante usando o sistema |
| 10 | Eu precisei aprender muitas coisas antes de conseguir usar esse sistema |

#### Teste-Piloto
- **Quando:** Pelo menos 3 dias antes do início das sessões reais
- **Com quem:** 1 participante que não integrará a amostra final (colega da equipe ou familiar)
- **Objetivo:** Verificar se as tarefas são claras, se os instrumentos funcionam, se o tempo estimado é adequado e se há problemas técnicos com o dispositivo/app
- **Ajustes:** Após o piloto, o roteiro de tarefas e o formulário de observação podem ser revisados

#### Custos previstos
- Deslocamento dos participantes: zero (aplicação presencial na universidade ou remota)
- Treino em academia: não previsto (aplicação em academia onde participante esta matriculado)
- Incentivo aos participantes: não previsto (participação voluntária)
- **Custo total estimado: R$ 0,00**

---

## D — Decidir sobre as Questões Éticas

### 6. Termo de Consentimento Livre e Esclarecido (TCLE)

---

> **TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO**
>
> **Título da pesquisa:** Avaliação de Usabilidade do Aplicativo GYM GAIN  
> **Disciplina:** Interação Humano-Computador  
> **Instituição:** [Nome da Instituição]  
> **Equipe responsável:** [Nomes dos integrantes]  
>
> ---
>
> Você está sendo convidado(a) a participar de uma avaliação de usabilidade do aplicativo mobile GYM GAIN, desenvolvido como projeto da disciplina de Interação Humano-Computador.
>
> **O que será feito:**  
> Você realizará um conjunto de tarefas no aplicativo enquanto verbaliza seus pensamentos em voz alta ("pensar em voz alta"). A sessão terá duração aproximada de 30 a 45 minutos. Com sua autorização, a tela do dispositivo poderá ser gravada para análise posterior. Após as tarefas, você responderá a um breve questionário de satisfação (SUS).
>
> **Riscos:**  
> Não há riscos físicos, psicológicos ou financeiros envolvidos. Você pode interromper sua participação a qualquer momento, sem qualquer prejuízo.
>
> **Benefícios:**  
> Sua participação contribuirá para a melhoria da interface do aplicativo e para o aprendizado dos pesquisadores sobre avaliação de sistemas interativos.
>
> **Confidencialidade:**  
> Seus dados serão utilizados exclusivamente para fins acadêmicos. Nenhum dado de identificação pessoal (nome, imagem, voz) será divulgado publicamente. Os dados coletados serão anonimizados.
>
> **Voluntariedade:**  
> Sua participação é completamente voluntária. Você tem o direito de recusar ou retirar seu consentimento a qualquer momento, sem nenhuma consequência.
>
> ---
>
> **Opções de resposta do participante:**
>
> ☐ **CONCORDO** em participar da avaliação conforme descrito acima.  
> ☐ **CONCORDO** e autorizo a gravação da tela durante a sessão.  
> ☐ **NÃO CONCORDO** em participar desta avaliação.
>
> ---
>
> Nome do participante: _________________________________  
> Assinatura: _________________________________  
> Data: _____ / _____ / _______
>
> Contato da equipe: [e-mail do grupo]

---

### 7. Como os Participantes Terão Acesso e Responderão o TCLE

- **Formato:** Google Forms com versão digital do TCLE (link enviado previamente por WhatsApp/e-mail)
- **Sessões presenciais:** Versão impressa assinada antes do início da sessão + cópia digital arquivada pela equipe
- **Sessões remotas:** Preenchimento via Google Forms com campo de nome completo como assinatura digital
- **Armazenamento:** Respostas arquivadas no Google Drive da equipe, com acesso restrito

---

## E — Avaliar, Interpretar e Apresentar os Dados

### 8. Análise, Interpretação e Apresentação dos Dados

#### Como os dados serão analisados

**Avaliação Heurística:**
- Consolidação dos problemas identificados pelos 3 avaliadores em uma planilha unificada
- Eliminação de duplicatas e classificação por heurística violada
- Cálculo da frequência de cada problema (quantos avaliadores o identificaram)
- Priorização por severidade (escala 0–4 de Nielsen)
- Apresentação em tabela consolidada com prints das telas problemáticas

**Teste de Usabilidade (Think-Aloud):**
- Transcrição ou análise direta das gravações de tela
- Categorização dos problemas observados por tarefa
- Registro de: número de erros, tempo por tarefa, necessidade de ajuda, abandono de tarefa
- Análise qualitativa dos comentários verbalizados

**Questionário SUS:**
- Cálculo do score SUS individual e médio do grupo (escala 0–100)
- Classificação com base nos benchmarks de Bangor et al. (2009):
  - < 51: Inaceitável
  - 51–68: Abaixo da média
  - 68–80,3: Acima da média (OK)
  - > 80,3: Excelente

#### Forma de apresentação dos resultados
- Tabela de problemas heurísticos consolidados (ID, heurística, severidade, tela)
- Gráficos de barras: distribuição de problemas por heurística violada
- Score SUS médio com comparação ao benchmark
- Prints anotados das telas com os principais problemas identificados
- Lista priorizada de problemas com propostas de solução


### Análise Crítica da Avaliação

#### Confiabilidade dos dados
- **Avaliação heurística:** A confiabilidade é moderada. Com apenas 3 avaliadores (o recomendado é 3–5), há risco de não identificar todos os problemas. A consolidação em grupo minimiza vieses individuais.
- **Teste de usabilidade:** Com 5 participantes, é possível identificar a maioria dos problemas de usabilidade, mas a amostra reduzida limita a representatividade. O perfil dos participantes recrutados por conveniência pode não representar fielmente todos os usuários do app.

#### Validade interna
- O roteiro de tarefas foi elaborado para cobrir os principais fluxos do app, o que favorece a validade interna. Contudo, o efeito de aprendizado entre tarefas pode influenciar o desempenho nas tarefas posteriores (ex.: após aprender a usar o calendário, tarefas seguintes ficam mais fáceis).

#### Validade externa
- A generalização dos resultados é limitada pelo tamanho da amostra (5 participantes) e pelo contexto acadêmico. Os resultados indicam tendências, mas não podem ser generalizados para toda a população de praticantes de musculação.

#### Validade ecológica
- Sessões presenciais em ambiente controlado podem não refletir o uso real do app (ex.: dentro da academia, com barulho, cansaço físico, pressa). Sessões remotas aproximam mais do contexto real.
- A interação simulada com dados de treino fictícios pode não capturar problemas que surgem apenas com uso longitudinal (ex.: visualização de evolução de progresso ao longo de semanas).

#### A avaliação responde às perguntas e atinge os objetivos?
- **Sim**, para a maioria das perguntas definidas. A avaliação heurística responde às perguntas sobre conformidade com princípios de design (P13, P14) e auxilia nas demais. O teste de usabilidade com think-aloud é capaz de responder diretamente P1 a P12.
- **Limitação identificada:** As perguntas P11 ("sensação de controle") e P12 ("intenção de uso contínuo") requerem uso prolongado do app para serem respondidas com maior profundidade — o teste de usabilidade pontual pode apenas indicar tendências.
- **Recomendação:** Caso o tempo permita, um diário de uso (diary study) por 1–2 semanas com 2–3 participantes complementaria bem a avaliação para P11 e P12.

---

## Cronograma da Avaliação

```
Abril 2026
├── 09/04 → Entrega do planejamento DECIDE (este documento)
├── 10/04 → Apresentação p/ professora — ajustes no planejamento
├── 14/04–23/04 → Apresentação do planejamento para a turma
├── 24/04–27/04 → Ajustes finais no planejamento

Maio–Junho 2026
├── 30/04–21/05 → Aplicação da avaliação
│   ├── Semana 1 (30/04–07/05): Avaliação Heurística (3 avaliadores individuais)
│   ├── Semana 2 (08/05): Consolidação da Avaliação Heurística
│   ├── Semana 3 (09/05): Teste-Piloto com 1 participante
│   └── Semanas 4–5 (12/05–21/05): Testes de Usabilidade (5 participantes)
├── até 26/05 → Análise e consolidação dos dados coletados
└── 02/06–09/06 → Apresentação dos resultados para a turma
```

---

## Referências

- NIELSEN, J. **Usability Engineering**. Academic Press, 1994.
- PREECE, J.; ROGERS, Y.; SHARP, H. **Interaction Design: Beyond Human-Computer Interaction**. 1ª ed. John Wiley & Sons, 2002.
- BARBOSA, S. D. J.; SILVA, B. S. **Interação Humano-Computador**. Elsevier, 2010.
- BANGOR, A.; KORTUM, P.; MILLER, J. Determining what individual SUS scores mean: Adding an adjective rating scale. **Journal of Usability Studies**, v. 4, n. 3, p. 114–123, 2009.
- BROOKE, J. SUS: A quick and dirty usability scale. **Usability Evaluation in Industry**, 1996.

---

*Documento elaborado conforme o framework DECIDE (Preece, Rogers & Sharp, 2002) para a disciplina de Interação Humano-Computador.*