# Context — Avaliação de Usabilidade GYM GAIN

> **Como usar este documento:** Este é um log vivo do projeto de avaliação de IHC. Ele complementa o `planejamento.md` (entregável formal da disciplina) registrando decisões de design, estado atual, histórico de sessões e questões em aberto. Sempre que uma decisão for tomada ou um documento for alterado, registre aqui na seção correspondente. O `planejamento.md` é a fonte de verdade — este arquivo responde *por que*, *quando* e *o que ainda está pendente*.

---

## 1. Identidade do Projeto

| Campo | Valor |
|---|---|
| **Sistema avaliado** | GYM GAIN — Aplicativo mobile de gerenciamento de treinos de academia |
| **Plataforma** | Android (mobile) |
| **Repositório** | https://github.com/felipecass15122/gym |
| **Disciplina** | Interação Humano-Computador |
| **Instituição** | [Nome da Instituição — preencher] |
| **Equipe** | [Nomes dos integrantes — preencher] |
| **Data de início** | 08/04/2026 |
| **Framework adotado** | DECIDE (Preece, Rogers & Sharp, 2002) — estrutura pedagógica estabelecida na disciplina que cobre todo o ciclo de planejamento e análise de uma avaliação de IHC |
| **Arquivo principal** | `c:\dev\gym\planejamento.md` |

---

## 2. Decisões de Design da Avaliação

### Decisão: 5 participantes no teste de usabilidade
**O que foi decidido:** Recrutar exatamente 5 participantes para as sessões de Think-Aloud.
**Por que:** Nielsen (1994) demonstrou empiricamente que 5 participantes detectam aproximadamente 85% dos problemas de usabilidade. Aumentar a amostra traz retorno marginal decrescente e custo crescente de recrutamento e análise.
**Alternativas consideradas:** 3 participantes (menor custo, menor cobertura) ou 8 participantes (maior cobertura, inviável no contexto acadêmico).
**Data:** 08/04/2026

---

### Decisão: Framework DECIDE como estrutura do planejamento
**O que foi decidido:** Usar o framework DECIDE como estrutura organizadora de todo o planejamento.
**Por que:** Adotado pela disciplina de IHC como padrão pedagógico. Preece, Rogers & Sharp (2002) estruturam o DECIDE para cobrir desde a definição de objetivos até a interpretação dos dados, garantindo que nenhuma etapa crítica seja omitida.
**Alternativas consideradas:** GQM (Goal-Question-Metric), PACT analysis. Descartadas por não serem o padrão da disciplina.
**Data:** 08/04/2026

---

### Decisão: Combinação de Avaliação Heurística + Teste de Usabilidade Think-Aloud
**O que foi decidido:** Utilizar dois métodos complementares: um sem usuários (Avaliação Heurística) e um com usuários (Think-Aloud + SUS).
**Por que:** A cobertura dos métodos é complementar. As perguntas P13 (conformidade heurística) e P14 (inconsistências entre módulos) só podem ser respondidas pela Avaliação Heurística. As perguntas P10–P12 (satisfação e intenção de uso) só podem ser respondidas com usuários reais. A combinação garante cobertura de todas as 14 perguntas definidas.
**Alternativas consideradas:** Apenas teste com usuários (não cobre P13/P14); apenas heurística (não captura experiência real nem satisfação).
**Data:** 08/04/2026

---

### Decisão: SUS (System Usability Scale) como questionário pós-teste
**O que foi decidido:** Aplicar o questionário SUS de 10 itens após cada sessão de Think-Aloud.
**Por que:** O SUS é um instrumento validado, de domínio público, com benchmarks consolidados (Bangor et al., 2009) que permitem comparar o score do GYM GAIN com médias da indústria. Os 10 itens são rápidos de responder (< 5 min), adequados para o contexto acadêmico.
**Alternativas consideradas:** UMUX (4 itens — muito curto, menos informação), AttrakDiff (diferencial semântico — mais complexo, focado em percepção de qualidade hedônica).
**Data:** 08/04/2026

---

### Decisão: 3 avaliadores na Avaliação Heurística
**O que foi decidido:** Realizar a avaliação heurística com 3 avaliadores membros da equipe.
**Por que:** Nielsen recomenda entre 3 e 5 avaliadores para detectar a maioria dos problemas com custo razoável. Com 3 avaliadores, a cobertura é satisfatória (~65–75% dos problemas) e viável dentro dos recursos da equipe acadêmica.
**Alternativas consideradas:** 1 avaliador (detecta apenas ~35% dos problemas), 5 avaliadores (maior cobertura, mas custo de coordenação elevado para um projeto acadêmico).
**Data:** 08/04/2026

---

### Decisão: Teste-piloto 3 dias antes das sessões reais
**O que foi decidido:** Realizar 1 sessão piloto com um participante que não integrará a amostra final, pelo menos 3 dias antes do início dos testes reais.
**Por que:** O piloto permite identificar ambiguidades no roteiro de tarefas, falhas técnicas no dispositivo e problemas nos instrumentos de coleta (formulário SUS, folha de observação) sem comprometer os dados da amostra real. O intervalo de 3 dias garante tempo suficiente para ajustes.
**Alternativas consideradas:** Piloto no mesmo dia dos testes reais (sem tempo para ajustes), sem piloto (risco elevado de problemas não detectados).
**Data:** 08/04/2026

---

## 3. Estado Atual do Projeto

**Última atualização:** 13/04/2026
**Fase atual:** Planejamento
**Próxima ação:** Apresentação do planejamento para a turma (14/04–23/04/2026)
**Responsável:** Equipe

### Checklist do Cronograma

```
Abril 2026
[x] 08/04 → Elaboração do planejamento DECIDE
[x] 09/04 → Entrega do planejamento DECIDE
[ ] 10/04 → Apresentação p/ professora — ajustes no planejamento
[ ] 14/04–23/04 → Apresentação do planejamento para a turma
[ ] 24/04–27/04 → Ajustes finais no planejamento

Maio–Junho 2026
[ ] 30/04–07/05 → Semana 1: Avaliação Heurística individual (3 avaliadores)
[ ] 08/05 → Semana 2: Consolidação da Avaliação Heurística
[ ] 09/05 → Semana 3: Teste-Piloto (1 participante)
[ ] 12/05–21/05 → Semanas 4–5: Testes de Usabilidade (5 participantes)
[ ] até 26/05 → Análise e consolidação dos dados
[ ] 02/06–09/06 → Apresentação dos resultados para a turma
```

---

## 4. Histórico de Conversas e Decisões

### Sessão 08/04/2026 — Elaboração inicial
**Decisões tomadas:**
- Estrutura completa do planejamento DECIDE definida
- Seleção dos dois métodos de avaliação (heurística + think-aloud)
- Definição das 14 perguntas de avaliação e 5 objetivos
- Roteiro de 8 tarefas para o think-aloud
- TCLE elaborado

**Documentos criados/alterados:**
- `planejamento.md`: criação do documento completo

**Pendências levantadas:**
- Nome da instituição (campo em branco no TCLE)
- E-mail de contato da equipe (campo em branco no TCLE)
- Nomes dos integrantes da equipe

---

### Sessão 13/04/2026 — Enriquecimento do contexto avaliativo
**Decisões tomadas:**
- Adição da seção "Contexto Avaliativo Enriquecido" ao `planejamento.md`, posicionada entre a Visão Geral do Sistema e o Framework DECIDE
- Definição de 6 hipóteses de usabilidade testáveis (H1–H6)
- Mapeamento explícito das 5 dimensões de Nielsen aos 3 módulos do app
- Criação de critérios quantitativos de sucesso e falha por dimensão
- Adição da subseção de contexto de uso do usuário-alvo (ambiente de academia)
- Criação deste arquivo `context.md` como log vivo do projeto

**Documentos criados/alterados:**
- `planejamento.md`: inserção da seção 2 (Contexto Avaliativo Enriquecido) com subseções 2.1–2.5
- `context.md`: criação deste arquivo

**Pendências levantadas:**
- Nenhuma nova pendência além das já registradas em Q1–Q5 abaixo

---

## 5. Questões em Aberto

| # | Questão | Levantada em | Status | Responsável |
|---|---|---|---|---|
| Q1 | Nome da instituição (campo em branco no TCLE do `planejamento.md`) | 08/04/2026 | Pendente | Equipe |
| Q2 | E-mail de contato da equipe (campo em branco no TCLE do `planejamento.md`) | 08/04/2026 | Pendente | Equipe |
| Q3 | Definição do ambiente presencial — sala específica na universidade | 08/04/2026 | Pendente | Equipe |
| Q4 | Nomes dos 3 avaliadores heurísticos (membros da equipe) | 08/04/2026 | Pendente | Equipe |
| Q5 | Confirmação do recrutamento dos 5 participantes para o teste de usabilidade | 08/04/2026 | Pendente | Equipe |

---

## 6. Arquivos Relacionados

| Arquivo | Descrição | Caminho | Status |
|---|---|---|---|
| `planejamento.md` | Documento principal DECIDE — entregável da disciplina | `c:\dev\gym\planejamento.md` | Ativo |
| `context.md` | Log de contexto vivo do projeto (este arquivo) | `c:\dev\gym\context.md` | Ativo |
| Planilha heurística | Instrumento de coleta para avaliação heurística | A definir | A criar |
| Formulário SUS | Questionário SUS digital (Google Forms) | A definir | A criar |
| TCLE digital | Termo de Consentimento digital (Google Forms) | A definir | A criar |
| Formulário de triagem | Triagem de participantes para o teste (Google Forms) | A definir | A criar |