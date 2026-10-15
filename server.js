const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '2468'; // Troque antes de usar em público.
app.use(express.static(path.join(__dirname, 'public')));

const questions = [
  {
    "difficulty": "Fácil",
    "text": "Qual é o objetivo da acessibilidade?",
    "options": [
      "Garantir acesso e participação com autonomia",
      "Separar pessoas com deficiência",
      "Dificultar o uso de espaços",
      "Atender apenas pessoas idosas"
    ],
    "answer": 0,
    "explanation": "A acessibilidade reduz barreiras e promove autonomia."
  },
  {
    "difficulty": "Fácil",
    "text": "Qual recurso ajuda uma pessoa cega a ler textos digitais?",
    "options": [
      "Alarme visual",
      "Leitor de tela",
      "Piso escorregadio",
      "Luz colorida"
    ],
    "answer": 1,
    "explanation": "Leitores de tela transformam conteúdo digital em fala ou Braille."
  },
  {
    "difficulty": "Fácil",
    "text": "Qual recurso ajuda uma pessoa que usa cadeira de rodas?",
    "options": [
      "Escada sem corrimão",
      "Porta estreita",
      "Rampa adequada",
      "Calçada bloqueada"
    ],
    "answer": 2,
    "explanation": "Rampas acessíveis ajudam a vencer desníveis."
  },
  {
    "difficulty": "Fácil",
    "text": "A acessibilidade beneficia quem?",
    "options": [
      "Somente pessoas com deficiência",
      "Somente crianças",
      "Somente turistas",
      "Muitas pessoas, em diferentes situações"
    ],
    "answer": 3,
    "explanation": "Ela também ajuda idosos, pessoas com lesões temporárias e famílias."
  },
  {
    "difficulty": "Fácil",
    "text": "Como agir antes de ajudar uma pessoa com deficiência?",
    "options": [
      "Perguntar se ela deseja ajuda",
      "Puxá-la sem avisar",
      "Falar por ela",
      "Ignorar sua resposta"
    ],
    "answer": 0,
    "explanation": "Pergunte e respeite a decisão da pessoa."
  },
  {
    "difficulty": "Fácil",
    "text": "O que é inclusão?",
    "options": [
      "Impedir diferenças",
      "Garantir participação e pertencimento",
      "Separar grupos",
      "Oferecer acesso só a alguns"
    ],
    "answer": 1,
    "explanation": "Inclusão significa que todos podem participar."
  },
  {
    "difficulty": "Fácil",
    "text": "O piso tátil serve principalmente para orientar pessoas com:",
    "options": [
      "Deficiência auditiva",
      "Alergia",
      "Deficiência visual",
      "Dificuldade de leitura"
    ],
    "answer": 2,
    "explanation": "O piso tátil oferece informação tátil para orientação e alerta."
  },
  {
    "difficulty": "Fácil",
    "text": "Libras é:",
    "options": [
      "Uma língua de sinais",
      "Um tipo de rampa",
      "Um aplicativo de mapas",
      "Um alfabeto universal falado"
    ],
    "answer": 0,
    "explanation": "Libras é a Língua Brasileira de Sinais."
  },
  {
    "difficulty": "Fácil",
    "text": "Uma atitude respeitosa é:",
    "options": [
      "Falar com o acompanhante em vez da pessoa",
      "Fazer piadas sobre deficiência",
      "Supor o que a pessoa consegue fazer",
      "Falar diretamente com a pessoa"
    ],
    "answer": 3,
    "explanation": "Trate a pessoa como interlocutora principal."
  },
  {
    "difficulty": "Fácil",
    "text": "Acessibilidade digital significa:",
    "options": [
      "Deixar sites apenas com imagens",
      "Criar conteúdos que diferentes pessoas consigam usar",
      "Bloquear leitores de tela",
      "Usar letras sempre pequenas"
    ],
    "answer": 1,
    "explanation": "Sites acessíveis funcionam com diferentes tecnologias e necessidades."
  },
  {
    "difficulty": "Fácil",
    "text": "Qual exemplo facilita a leitura para baixa visão?",
    "options": [
      "Texto minúsculo",
      "Pouco contraste",
      "Texto ampliável e bom contraste",
      "Informações apenas por cor"
    ],
    "answer": 2,
    "explanation": "Tamanho ajustável e contraste ajudam na leitura."
  },
  {
    "difficulty": "Fácil",
    "text": "Uma escola acessível deve:",
    "options": [
      "Permitir que todos circulem e aprendam",
      "Deixar materiais inacessíveis",
      "Separar alunos em todas as atividades",
      "Ignorar adaptações"
    ],
    "answer": 0,
    "explanation": "A escola deve remover barreiras de circulação e aprendizagem."
  },
  {
    "difficulty": "Fácil",
    "text": "Por que legendas são úteis em vídeos?",
    "options": [
      "Decoram a tela",
      "Substituem todas as imagens",
      "Servem apenas para propaganda",
      "Ajudam pessoas surdas e quem assiste sem áudio"
    ],
    "answer": 3,
    "explanation": "Legendas ampliam o acesso ao conteúdo falado."
  },
  {
    "difficulty": "Fácil",
    "text": "O que fazer se uma rampa estiver bloqueada?",
    "options": [
      "Deixar assim",
      "Avisar o responsável e ajudar a liberar a passagem",
      "Colocar mais objetos",
      "Dizer que não importa"
    ],
    "answer": 1,
    "explanation": "Rotas acessíveis precisam permanecer desobstruídas."
  },
  {
    "difficulty": "Fácil",
    "text": "A deficiência define tudo o que uma pessoa pode fazer?",
    "options": [
      "Sim, sempre",
      "Só na escola",
      "Não; cada pessoa tem habilidades e necessidades próprias",
      "Somente no trabalho"
    ],
    "answer": 2,
    "explanation": "Não se deve presumir capacidades apenas pela deficiência."
  },
  {
    "difficulty": "Fácil",
    "text": "Qual é um exemplo de barreira física?",
    "options": [
      "Escada sem alternativa acessível",
      "Legenda em vídeo",
      "Documento em Braille",
      "Intérprete de Libras"
    ],
    "answer": 0,
    "explanation": "Barreiras físicas dificultam a circulação e o uso dos espaços."
  },
  {
    "difficulty": "Fácil",
    "text": "O que significa autonomia?",
    "options": [
      "Nunca receber apoio",
      "Fazer escolhas e agir com o controle possível sobre a própria vida",
      "Ficar sempre sozinho",
      "Não participar de decisões"
    ],
    "answer": 1,
    "explanation": "Autonomia é poder escolher e controlar as próprias decisões."
  },
  {
    "difficulty": "Fácil",
    "text": "Uma apresentação acessível pode incluir:",
    "options": [
      "Som muito baixo sem texto",
      "Somente cores para explicar tudo",
      "Texto ilegível",
      "Descrição de imagens e materiais legíveis"
    ],
    "answer": 3,
    "explanation": "Descrições e materiais legíveis ajudam diferentes públicos."
  },
  {
    "difficulty": "Fácil",
    "text": "A acessibilidade deve ser pensada:",
    "options": [
      "Só depois de um acidente",
      "Apenas em eventos grandes",
      "Desde o planejamento",
      "Somente se alguém reclamar"
    ],
    "answer": 2,
    "explanation": "Planejar acessibilidade desde o início evita barreiras."
  },
  {
    "difficulty": "Fácil",
    "text": "Qual frase é mais inclusiva?",
    "options": [
      "Pessoa com deficiência",
      "Pessoa inválida",
      "Pessoa normal e pessoa anormal",
      "Coitadinho"
    ],
    "answer": 0,
    "explanation": "“Pessoa com deficiência” é uma forma respeitosa e amplamente adotada."
  },
  {
    "difficulty": "Médio",
    "text": "Qual combinação torna uma aula mais acessível?",
    "options": [
      "Só palestra oral",
      "Material digital compatível com leitor de tela e explicação oral das imagens",
      "Texto em imagem sem descrição",
      "Vídeo sem legenda"
    ],
    "answer": 1,
    "explanation": "Oferecer conteúdo em formatos acessíveis reduz barreiras."
  },
  {
    "difficulty": "Médio",
    "text": "O que é uma barreira atitudinal?",
    "options": [
      "Uma porta pesada",
      "Uma calçada alta",
      "Preconceito ou comportamento que exclui",
      "Um mapa tátil"
    ],
    "answer": 2,
    "explanation": "Atitudes discriminatórias também impedem a participação."
  },
  {
    "difficulty": "Médio",
    "text": "Qual recurso favorece pessoas surdas em um evento?",
    "options": [
      "Luzes apagadas",
      "Som mais alto sem apoio",
      "Folhetos sem informação",
      "Intérprete de Libras e/ou legendas, conforme o público"
    ],
    "answer": 3,
    "explanation": "A solução deve considerar as necessidades de comunicação."
  },
  {
    "difficulty": "Médio",
    "text": "Um site acessível deve permitir navegação por:",
    "options": [
      "Teclado, além do mouse",
      "Somente mouse",
      "Somente tela sensível ao toque",
      "Apenas voz"
    ],
    "answer": 0,
    "explanation": "A navegação por teclado é essencial para várias pessoas."
  },
  {
    "difficulty": "Médio",
    "text": "Por que não se deve transmitir informação apenas pela cor?",
    "options": [
      "Porque cores não existem",
      "Porque algumas pessoas não distinguem certas cores e faltará outro sinal",
      "Porque cor sempre distrai",
      "Porque telas não exibem cores"
    ],
    "answer": 1,
    "explanation": "Use texto, ícones ou padrões além das cores."
  },
  {
    "difficulty": "Médio",
    "text": "O que é texto alternativo em uma imagem?",
    "options": [
      "Uma legenda automática qualquer",
      "Um nome decorativo",
      "Uma descrição textual do conteúdo relevante da imagem",
      "Uma imagem duplicada"
    ],
    "answer": 2,
    "explanation": "O texto alternativo comunica informações importantes da imagem."
  },
  {
    "difficulty": "Médio",
    "text": "Como tornar uma reunião híbrida mais acessível?",
    "options": [
      "Falar sem microfone",
      "Compartilhar só documentos escaneados",
      "Não permitir perguntas por chat",
      "Usar microfone, legendas e documentos acessíveis"
    ],
    "answer": 3,
    "explanation": "Recursos variados ajudam pessoas presenciais e remotas."
  },
  {
    "difficulty": "Médio",
    "text": "Uma rota acessível deve ser:",
    "options": [
      "Contínua, sinalizada e sem obstáculos",
      "Usada como depósito",
      "Interrompida por degraus sem alternativa",
      "Aberta só com autorização especial"
    ],
    "answer": 0,
    "explanation": "A continuidade da rota é essencial para o acesso."
  },
  {
    "difficulty": "Médio",
    "text": "O desenho universal busca:",
    "options": [
      "Projetar para um único perfil",
      "Criar ambientes e produtos utilizáveis pelo maior número possível de pessoas",
      "Eliminar todas as escolhas",
      "Criar adaptações sempre improvisadas"
    ],
    "answer": 1,
    "explanation": "O desenho universal considera diversidade desde o projeto."
  },
  {
    "difficulty": "Médio",
    "text": "Qual prática melhora documentos digitais?",
    "options": [
      "Digitalizar como foto sem texto reconhecível",
      "Usar tabelas complexas sem cabeçalhos",
      "Usar títulos estruturados, texto selecionável e ordem lógica",
      "Escrever tudo em letras maiúsculas"
    ],
    "answer": 2,
    "explanation": "Estrutura semântica facilita navegação e leitura assistiva."
  },
  {
    "difficulty": "Médio",
    "text": "Uma pessoa com deficiência intelectual pode se beneficiar de:",
    "options": [
      "Instruções confusas",
      "Pressa e interrupções",
      "Somente texto técnico",
      "Linguagem clara, etapas e apoio visual quando útil"
    ],
    "answer": 3,
    "explanation": "Comunicação clara ajuda a compreender informações."
  },
  {
    "difficulty": "Médio",
    "text": "Como oferecer ajuda a uma pessoa com deficiência visual?",
    "options": [
      "Perguntar e descrever o ambiente quando necessário",
      "Segurar seu braço sem avisar",
      "Mover seus objetos sem explicar",
      "Falar apenas com outra pessoa"
    ],
    "answer": 0,
    "explanation": "Pergunte antes e ofereça orientação verbal respeitosa."
  },
  {
    "difficulty": "Médio",
    "text": "Qual situação demonstra capacitismo?",
    "options": [
      "Oferecer formatos acessíveis",
      "Presumir que uma pessoa não pode trabalhar por ter deficiência",
      "Perguntar qual apoio é necessário",
      "Remover barreiras arquitetônicas"
    ],
    "answer": 1,
    "explanation": "Capacitismo é discriminação baseada na deficiência."
  },
  {
    "difficulty": "Médio",
    "text": "Em um vídeo educativo, audiodescrição pode:",
    "options": [
      "Traduzir falas para outro idioma",
      "Aumentar o volume da música",
      "Descrever informações visuais importantes que não aparecem nas falas",
      "Substituir todas as legendas"
    ],
    "answer": 2,
    "explanation": "Audiodescrição comunica elementos visuais relevantes."
  },
  {
    "difficulty": "Médio",
    "text": "Por que consultar pessoas com deficiência no planejamento?",
    "options": [
      "Porque elas devem decidir por todos",
      "Só para cumprir formalidade",
      "Para evitar ouvir outras pessoas",
      "Porque a experiência delas ajuda a identificar barreiras reais"
    ],
    "answer": 3,
    "explanation": "Participação direta melhora as soluções."
  },
  {
    "difficulty": "Médio",
    "text": "Um balcão de atendimento acessível deve considerar:",
    "options": [
      "Altura, espaço de aproximação e comunicação",
      "Somente a decoração",
      "Apenas a cor do balcão",
      "Somente o tamanho do prédio"
    ],
    "answer": 0,
    "explanation": "Acesso envolve aproximação física e comunicação."
  },
  {
    "difficulty": "Médio",
    "text": "Qual exemplo é acessibilidade na comunicação?",
    "options": [
      "Informação disponível só em letra miúda",
      "Oferecer conteúdo em formatos adequados a diferentes necessidades",
      "Usar jargões sem explicação",
      "Recusar intérprete"
    ],
    "answer": 1,
    "explanation": "Formatos variados ampliam o acesso à informação."
  },
  {
    "difficulty": "Médio",
    "text": "Em um formulário on-line, cada campo deve ter:",
    "options": [
      "Apenas cor indicativa",
      "Rótulo ausente",
      "Rótulo claro associado ao campo",
      "Instrução somente em imagem"
    ],
    "answer": 2,
    "explanation": "Rótulos claros ajudam leitores de tela e todos os usuários."
  },
  {
    "difficulty": "Médio",
    "text": "Por que manter elevadores acessíveis funcionando?",
    "options": [
      "Porque substituem toda a equipe",
      "Só por aparência",
      "Somente em dias de evento",
      "Porque podem ser essenciais para acesso aos andares"
    ],
    "answer": 3,
    "explanation": "Falhas podem impedir que pessoas alcancem serviços e salas."
  },
  {
    "difficulty": "Médio",
    "text": "Qual é a melhor forma de avaliar acessibilidade?",
    "options": [
      "Testar com pessoas diversas e corrigir barreiras",
      "Supor que funciona",
      "Testar apenas com o desenvolvedor",
      "Avaliar só pela aparência"
    ],
    "answer": 0,
    "explanation": "Testes com usuários revelam problemas concretos."
  },
  {
    "difficulty": "Difícil",
    "text": "A Lei Brasileira de Inclusão é também conhecida como:",
    "options": [
      "Lei nº 8.069/1990",
      "Lei nº 13.146/2015",
      "Lei nº 9.394/1996",
      "Lei nº 12.527/2011"
    ],
    "answer": 1,
    "explanation": "A Lei nº 13.146/2015 institui a Lei Brasileira de Inclusão."
  },
  {
    "difficulty": "Difícil",
    "text": "Na LBI, acessibilidade se relaciona principalmente a:",
    "options": [
      "Apenas rampas em prédios públicos",
      "Somente serviços de saúde",
      "Condições de alcance e uso com segurança e autonomia de espaços, transportes, informação e serviços",
      "Apenas vagas de estacionamento"
    ],
    "answer": 2,
    "explanation": "O conceito abrange espaços, serviços, transportes, informação e comunicação."
  },
  {
    "difficulty": "Difícil",
    "text": "O que caracteriza uma adaptação razoável?",
    "options": [
      "Qualquer mudança sem considerar a pessoa",
      "Uma medida sempre proibida",
      "Uma mudança que elimina todos os custos",
      "Ajuste necessário e adequado que não imponha ônus desproporcional e indevido"
    ],
    "answer": 3,
    "explanation": "A definição jurídica considera necessidade e proporcionalidade do ônus."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual é a diferença entre acessibilidade e desenho universal?",
    "options": [
      "Acessibilidade remove barreiras; desenho universal busca conceber soluções utilizáveis por todos desde o início",
      "São termos sem relação",
      "Desenho universal trata apenas de rampas",
      "Acessibilidade vale só para tecnologia"
    ],
    "answer": 0,
    "explanation": "Os conceitos se complementam, mas enfatizam estratégias diferentes."
  },
  {
    "difficulty": "Difícil",
    "text": "Uma plataforma digital que não funciona com leitor de tela cria sobretudo uma barreira:",
    "options": [
      "Geográfica",
      "Tecnológica/digital",
      "Climática",
      "Financeira necessariamente"
    ],
    "answer": 1,
    "explanation": "Incompatibilidade com tecnologia assistiva é uma barreira digital."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual prática está mais alinhada à participação com igualdade de oportunidades?",
    "options": [
      "Decidir sem ouvir a pessoa",
      "Oferecer ajuda obrigatória em todas as tarefas",
      "Permitir que a pessoa escolha os apoios de que necessita",
      "Impedir que a pessoa assuma riscos cotidianos"
    ],
    "answer": 2,
    "explanation": "Respeitar escolhas e oferecer apoios adequados promove autonomia."
  },
  {
    "difficulty": "Difícil",
    "text": "Por que acessibilidade não deve depender apenas de pedido individual?",
    "options": [
      "Porque pedidos nunca são válidos",
      "Porque toda pessoa precisa da mesma solução",
      "Porque a acessibilidade é apenas opcional",
      "Porque planejamento preventivo reduz barreiras e beneficia mais pessoas"
    ],
    "answer": 3,
    "explanation": "Antecipar necessidades torna ambientes e serviços mais inclusivos."
  },
  {
    "difficulty": "Difícil",
    "text": "Em acessibilidade web, o que significa garantir foco visível?",
    "options": [
      "Mostrar claramente qual elemento recebe o foco do teclado",
      "Destacar apenas anúncios",
      "Ocultar o cursor do teclado",
      "Exigir o uso do mouse"
    ],
    "answer": 0,
    "explanation": "O foco visível permite acompanhar a navegação por teclado."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual é um risco de usar CAPTCHA apenas visual?",
    "options": [
      "Aumenta a autonomia de todos",
      "Pode bloquear pessoas cegas ou com outras dificuldades de percepção",
      "Garante acessibilidade automaticamente",
      "Substitui a autenticação segura"
    ],
    "answer": 1,
    "explanation": "Devem existir alternativas acessíveis de verificação."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual combinação é mais inclusiva para divulgar uma emergência?",
    "options": [
      "Somente sirene",
      "Somente mensagem em letras pequenas",
      "Alertas visuais e sonoros, com mensagens claras e acessíveis",
      "Somente publicação em rede social"
    ],
    "answer": 2,
    "explanation": "Múltiplos canais aumentam a chance de todos receberem o alerta."
  },
  {
    "difficulty": "Difícil",
    "text": "O que significa acessibilidade comunicacional?",
    "options": [
      "Apenas ter internet rápida",
      "Somente usar linguagem formal",
      "Usar uma única forma de comunicação",
      "Garantir que informações e mensagens sejam percebidas e compreendidas por diferentes públicos"
    ],
    "answer": 3,
    "explanation": "A comunicação precisa considerar formatos e necessidades diferentes."
  },
  {
    "difficulty": "Difícil",
    "text": "Ao planejar evacuação de um prédio, deve-se:",
    "options": [
      "Incluir rotas, alarmes e procedimentos que considerem pessoas com diferentes deficiências",
      "Presumir que todos descem escadas",
      "Deixar cada pessoa descobrir a saída",
      "Planejar apenas para quem corre rápido"
    ],
    "answer": 0,
    "explanation": "Planos de emergência devem prever diferentes necessidades e apoios."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual alternativa representa uma barreira programática ou institucional?",
    "options": [
      "Um texto ampliável",
      "Uma política que nega adaptações sem avaliar necessidades",
      "Um intérprete de Libras",
      "Uma rota livre de obstáculos"
    ],
    "answer": 1,
    "explanation": "Regras e procedimentos podem excluir quando não contemplam acessibilidade."
  },
  {
    "difficulty": "Difícil",
    "text": "Por que acessibilidade atitudinal precisa acompanhar adaptações físicas?",
    "options": [
      "Porque rampas são desnecessárias",
      "Porque atitudes não afetam inclusão",
      "Porque preconceito pode continuar excluindo mesmo em um espaço adaptado",
      "Porque acessibilidade é apenas comportamento"
    ],
    "answer": 2,
    "explanation": "Estrutura física acessível não elimina, sozinha, discriminação."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual critério é importante ao produzir PDFs acessíveis?",
    "options": [
      "Converter todas as páginas em imagens",
      "Usar ordem de leitura aleatória",
      "Remover títulos e idioma do documento",
      "Manter texto pesquisável, estrutura de títulos e ordem de leitura correta"
    ],
    "answer": 3,
    "explanation": "Estrutura e texto reconhecível ajudam tecnologias assistivas."
  },
  {
    "difficulty": "Difícil",
    "text": "O que significa consulta significativa a pessoas com deficiência?",
    "options": [
      "Envolvê-las de forma acessível e considerar suas contribuições nas decisões",
      "Convidá-las apenas depois que tudo estiver pronto",
      "Pedir opinião sem dar informações",
      "Usar uma única pessoa como representante de todas as experiências"
    ],
    "answer": 0,
    "explanation": "A participação deve ser acessível, real e considerada no processo."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual princípio orienta a oferta de informação acessível?",
    "options": [
      "Todos devem usar somente o mesmo formato",
      "Disponibilizar formatos e recursos adequados sem presumir uma necessidade única",
      "A informação acessível deve ser menos completa",
      "A pessoa deve pagar sempre por qualquer adaptação"
    ],
    "answer": 1,
    "explanation": "Formatos alternativos permitem acesso equivalente à informação."
  },
  {
    "difficulty": "Difícil",
    "text": "Em uma avaliação de acessibilidade, por que observar tarefas reais?",
    "options": [
      "Porque normas nunca importam",
      "Para avaliar só a velocidade",
      "Porque testes práticos mostram se as pessoas conseguem concluir tarefas com autonomia",
      "Para evitar ouvir usuários"
    ],
    "answer": 2,
    "explanation": "A avaliação prática identifica barreiras que uma inspeção superficial pode não encontrar."
  },
  {
    "difficulty": "Difícil",
    "text": "Qual é a melhor resposta quando uma pessoa aponta uma barreira de acesso?",
    "options": [
      "Dizer que ninguém mais reclamou",
      "Afirmar que a pessoa está exagerando",
      "Pedir que ela se adapte sem avaliar alternativas",
      "Ouvir, verificar o problema e buscar uma solução apropriada"
    ],
    "answer": 3,
    "explanation": "Escuta e correção das barreiras são passos fundamentais."
  },
  {
    "difficulty": "Difícil",
    "text": "A acessibilidade deve ser tratada como:",
    "options": [
      "Parte do direito à participação e do planejamento de serviços e ambientes",
      "Um favor opcional",
      "Um recurso apenas para eventos especiais",
      "Uma questão exclusivamente individual"
    ],
    "answer": 0,
    "explanation": "A acessibilidade é condição de participação e igualdade de oportunidades."
  }
];

let current = -1;
let open = false;
let finished = false;
let players = new Map();
let answers = new Map(); // socketId -> { choice, time, points }
let questionStartedAt = 0;
let timerEndsAt = 0;
const QUESTION_SECONDS = 20;

function leaderboard() {
  return [...players.values()].filter(p => !p.isAdmin).map(p => ({
    id: p.id, name: p.name, score: p.score, answered: answers.has(p.id),
    lastPoints: p.lastPoints || 0, connected: p.connected
  })).sort((a,b) => b.score - a.score || a.name.localeCompare(b.name, 'pt-BR'));
}
function publicState() {
  return { current, total: questions.length, open, finished, secondsLeft: open ? Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000)) : 0, leaderboard: leaderboard(), answeredCount: answers.size };
}
function broadcastState() { io.emit('state', publicState()); }
function sendQuestion(socket) {
  if (current < 0 || finished) return;
  const q = questions[current];
  socket.emit('question', { index: current, total: questions.length, difficulty: q.difficulty, secondsLeft: open ? Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000)) : 0, text: q.text, options: q.options, open, finished,
    // O gabarito não é enviado aos participantes antes do encerramento.
    explanation: finished ? q.explanation : undefined });
}
function broadcastQuestion() { for (const socket of io.sockets.sockets.values()) sendQuestion(socket); }
function adminPayload() {
  const q = current >= 0 ? questions[current] : null;
  return { ...publicState(), question: q ? { text: q.text, options: q.options, answer: q.answer, explanation: q.explanation, difficulty: q.difficulty } : null,
    answers: [...answers.entries()].map(([id,a]) => ({ id, name: players.get(id)?.name || 'Desconectado', choice: a.choice, choiceText: q?.options[a.choice] || '', points: a.points, seconds: a.seconds })) };
}
function broadcastAdmin() {
  const payload = adminPayload();
  for (const [id, p] of players) if (p.isAdmin) io.to(id).emit('adminData', payload);
}

io.on('connection', socket => {
  socket.on('join', ({ name, role, pin }) => {
    name = String(name || '').trim().slice(0, 24);
    if (role === 'admin') {
      if (String(pin || '') !== ADMIN_PIN) { socket.emit('joinError', 'PIN de administrador incorreto.'); return; }
      players.set(socket.id, { id: socket.id, name: 'Apresentador', score: 0, isAdmin: true, connected: true });
      socket.emit('joined', { role: 'admin' });
      socket.emit('adminData', adminPayload());
      broadcastState(); broadcastAdmin(); return;
    }
    if (!name) { socket.emit('joinError', 'Digite seu nome ou apelido.'); return; }
    const duplicate = [...players.values()].some(p => !p.isAdmin && p.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR') && p.connected);
    if (duplicate) { socket.emit('joinError', 'Esse nome já está em uso. Escolha outro.'); return; }
    players.set(socket.id, { id: socket.id, name, score: 0, isAdmin: false, connected: true, lastPoints: 0 });
    socket.emit('joined', { role: 'player', name });
    sendQuestion(socket); broadcastState(); broadcastAdmin();
  });

  socket.on('answer', choice => {
    const p = players.get(socket.id);
    if (!p || p.isAdmin || !open || finished || current < 0 || answers.has(socket.id)) return;
    choice = Number(choice);
    if (!Number.isInteger(choice) || choice < 0 || choice > 3) return;
    const elapsed = Math.max(0, (Date.now() - questionStartedAt) / 1000);
    const correct = choice === questions[current].answer;
    const points = correct ? Math.max(100, Math.round(1000 - Math.min(elapsed, 60) * 12)) : 0;
    answers.set(socket.id, { choice, points, seconds: Math.round(elapsed * 10) / 10 });
    p.score += points; p.lastPoints = points;
    socket.emit('answerAck', { accepted: true, message: correct ? `Resposta registrada! Você ganhou ${points} pontos.` : 'Resposta registrada! Aguarde o apresentador.' });
    broadcastState(); broadcastAdmin();
  });

  socket.on('adminAction', ({ action, pin }) => {
    const p = players.get(socket.id);
    if (!p?.isAdmin || String(pin || '') !== ADMIN_PIN) return;
    if (action === 'start' && current === -1 && !finished) {
      current = 0; open = true; answers = new Map(); questionStartedAt = Date.now(); timerEndsAt = questionStartedAt + QUESTION_SECONDS * 1000;
    } else if (action === 'close' && open && !finished) {
      open = false; timerEndsAt = 0;
    } else if (action === 'next' && !open && !finished) {
      if (current < questions.length - 1) { current++; answers = new Map(); open = true; questionStartedAt = Date.now(); timerEndsAt = questionStartedAt + QUESTION_SECONDS * 1000; }
      else { finished = true; open = false; }
    } else if (action === 'reveal' && current >= 0 && !finished) {
      open = false;
    } else if (action === 'restart') {
      current = -1; open = false; finished = false; answers = new Map(); questionStartedAt = 0; timerEndsAt = 0;
      for (const player of players.values()) if (!player.isAdmin) { player.score = 0; player.lastPoints = 0; }
    }
    broadcastQuestion(); broadcastState(); broadcastAdmin();
  });

  socket.on('disconnect', () => {
    const p = players.get(socket.id);
    if (p) {
      if (p.isAdmin) players.delete(socket.id);
      else { p.connected = false; }
      broadcastState(); broadcastAdmin();
    }
  });
});

setInterval(() => {
  if (open && !finished && Date.now() >= timerEndsAt) { open = false; timerEndsAt = 0; broadcastQuestion(); broadcastState(); broadcastAdmin(); }
  else if (open && !finished) { broadcastState(); broadcastAdmin(); }
}, 500);

server.listen(PORT, '0.0.0.0', () => console.log(`Quiz no ar: http://localhost:${PORT} | PIN admin: ${ADMIN_PIN}`));
