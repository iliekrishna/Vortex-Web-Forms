document.addEventListener('DOMContentLoaded', () => {
  // === Troca de abas ===
  const tablinks = document.querySelectorAll('.tablinks');
  const tabcontents = document.querySelectorAll('.tabcontent');

  // === Função para aplicar máscara de CPF ===
  function aplicarMascaraCPF(id) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', () => {
      let valor = input.value.replace(/\D/g, '');

      if (valor.length > 3 && valor.length <= 6) {
        valor = valor.replace(/(\d{3})(\d+)/, '$1.$2');
      } else if (valor.length > 6 && valor.length <= 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
      } else if (valor.length > 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
      }

      if (valor.length > 14) valor = valor.substring(0, 14);

      input.value = valor;
    });
  }

  // Aplica máscara em todos os campos CPF
  aplicarMascaraCPF('cpf');       // campo da aba Enviar Ticket
  aplicarMascaraCPF('cpfBuscar'); // campo da aba Buscar
  aplicarMascaraCPF('cpfDoc');    // campo da aba Solicitar Documentos

  tablinks.forEach(tab => {
    tab.addEventListener('click', () => {
      tablinks.forEach(t => t.classList.remove('active'));
      tabcontents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });

  // === Validação de CPF ===
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;

    return cpf.charAt(9) == digito1 && cpf.charAt(10) == digito2;
  }

  // === Envio do ticket ===
  const formTicket = document.getElementById('formTicket');
  const cpfInput = document.getElementById('cpf');

  if (formTicket) {
    formTicket.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(formTicket);

      const cpfValido = validarCPF(cpfInput.value);
      if (!cpfValido) {
        alert('❌ CPF inválido. Verifique os números digitados.');
        return;
      }

      fetch('enviar_ticket.php', {
        method: 'POST',
        body: formData
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.sucesso) {
            alert('✅ Ticket enviado com sucesso!');
            formTicket.reset();
            document.getElementById('assunto').disabled = true;
            document.getElementById('faq-container').innerHTML = '';
          } else {
            alert('❌ Erro ao enviar ticket: ' + data.mensagem);
          }
        })
        .catch(() => alert('❌ Ocorreu um erro ao tentar enviar o formulário.'));
    });
  }

  // === Busca por CPF ===
  const btnBuscar = document.getElementById('btnBuscar');
  const cpfBuscarInput = document.getElementById('cpfBuscar');

  if (btnBuscar) {
    btnBuscar.addEventListener('click', () => {
      const cpf = cpfBuscarInput.value.trim();
      const cpfLimpo = cpf.replace(/\D/g, '');

      if (!validarCPF(cpf)) {
        alert('Por favor, digite um CPF válido.');
        return;
      }

      document.getElementById('respostaResultado').innerHTML = 'Carregando...';
      document.getElementById('historicoResultado').innerHTML = '';

      fetch(`buscar_resposta.php?cpf=${encodeURIComponent(cpfLimpo)}`)
        .then(resp => {
          if (!resp.ok) throw new Error('Erro na comunicação com o servidor.');
          return resp.json();
        })
        .then(data => {
          if (data.sucesso) {
            if (data.historico.length === 0) {
              document.getElementById('respostaResultado').innerHTML = 'Nenhuma resposta encontrada para este CPF.';
              return;
            }

            // Mostra o container com os resultados
            document.getElementById('resultadoContainer').style.display = 'block';

            const ultima = data.historico[data.historico.length - 1];
            document.getElementById('respostaResultado').innerHTML = `
              <strong>Assunto:</strong> ${ultima.titulo}<br>
              <strong>Resposta:</strong> ${ultima.resposta || '<em>Sem resposta ainda.</em>'}
            `;

            let htmlHistorico = '';
            data.historico.forEach(item => {
              htmlHistorico += `
                <p><strong>Assunto:</strong> ${item.titulo}<br>
                <strong>Resposta:</strong> ${item.resposta || '<em>Sem resposta.</em>'}</p>
                <hr>
              `;
            });
            document.getElementById('historicoResultado').innerHTML = htmlHistorico;
          } else {
            document.getElementById('respostaResultado').innerHTML = 'Erro: ' + data.mensagem;
          }
        })
        .catch(err => {
          document.getElementById('respostaResultado').innerHTML = err.message;
        });
    });
  }

  // === Envio do requerimento ===
  const formRequerimento = document.getElementById('formRequerimento');
  const cpfDocInput = document.getElementById('cpfDoc');

  if (formRequerimento) {
    formRequerimento.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validação do CPF
      const cpfValido = validarCPF(cpfDocInput.value);
      if (!cpfValido) {
        alert('❌ CPF inválido. Verifique os números digitados.');
        return;
      }
      
      const formData = new FormData(formRequerimento);

      fetch('enviar_requerimento.php', {
        method: 'POST',
        body: formData
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.sucesso) {
            alert('✅ Requerimento enviado com sucesso!');
            formRequerimento.reset();
          } else {
            alert('❌ Erro ao enviar requerimento: ' + data.mensagem);
          }
        })
        .catch(() => alert('❌ Ocorreu um erro ao tentar enviar o formulário.'));
    });
  }

  // === FAQ toggle ===
  const faqContainer = document.getElementById("faq-container");
  const radios = document.querySelectorAll('input[name="categoria"]');
  const textareaAssunto = document.getElementById("assunto");

  const faqsPorCategoria = {
    documentos_emissao: [
      {
        pergunta: "Como faço para solicitar o atestado de matrícula?",
        resposta: "Solicitar o documento pelo Siga. Prazo para deferimento do pedido: 3 dias úteis."
      },
      {
        pergunta: "Como faço para solicitar a 2ª via da carteirinha?",
        resposta: "Em caso de roubo: realizar B.O (Boletim de Ocorrência), entregar na Secretaria e preencher a solicitação. Em caso de perda ou furto: realizar B.O, pagar a taxa de emissão da 2ª via, entregar na Secretaria junto com comprovante de pagamento, B.O e preencher a solicitação."
      }
    ],
    matricula_trancamento: [
      {
        pergunta: "Tenho direito a quantos trancamentos?",
        resposta: `De acordo com o Regulamento das Fatec´s – Trancamento de Matrícula:<br>
        Art. 35 - O aluno tem direito, mediante solicitação, a 2 (dois) trancamentos de matrícula consecutivos ou não.<br>
        § 1º - Cada trancamento tem duração de um período letivo regular.<br>
        § 2º - A solicitação pode ser feita desde o início da pré-matrícula até 2/3 do período letivo.<br>
        § 3º - Durante o trancamento o aluno não pode cursar disciplinas de Graduação em qualquer Faculdade do Centro Paula Souza.<br>
        § 4º - É vedado trancamento no período letivo de ingresso no curso.`
      }
    ],
    passe_escolar: [
      {
        pergunta: "Como faço para solicitar o passe escolar de Guarulhos?",
        resposta: `Imprimir o formulário de Solicitação de Carteirinha Municipal disponível no site da Guarupass e preencher.<br>
        Deixar na secretaria para assinatura junto com um comprovante de endereço. Prazo para retirada: 3 dias úteis.<br>
        Solicitar um atestado de matrícula no Siga, disponível em até 3 dias úteis para baixar em PDF.<br>
        Fazer agendamento na Guarupass e apresentar a documentação solicitada.`
      },
      {
        pergunta: "Como faço para solicitar o passe escolar SPTrans ou EMTU?",
        resposta: "Você deve acessar o site: https://secretaria.fatecguarulhos.edu.br/safire-web/php/ , e preencher o requerimento. A analise ocorrerá em até 3 dias úteis."
      }
    ],
    estagio: [
      {
        pergunta: "Como faço para ter meu Termo de Compromisso de Estágio?",
        resposta: `O Termo de Compromisso de Estágio (TCE) deve ser entregue na Secretaria da Fatec Guarulhos, já assinado pelas partes, em 3 vias.<br>
        Deve também acompanhar 3 vias do Plano de Atividade e 3 vias da apólice de seguros.<br>
        Os modelos estão disponíveis em: <a href="https://www.fatecguarulhos.edu.br/alunos/estagio/" target="_blank">fatecguarulhos.edu.br/alunos/estagio/</a>`
      },
      {
        pergunta: "Posso usar o modelo da empresa?",
        resposta: "Sim."
      },
      {
        pergunta: "Quanto tempo demora para o Termo de Compromisso ser assinado?",
        resposta: "5 dias úteis."
      }
    ],
    gerenciamento_curso: [
      {
        pergunta: "Como faço para realizar transferência de curso?",
        resposta: "Existem dois tipos de transferência na fatec, interna e externa. A transferência é feita mediante edital de remanejamento da Fatec para qual deseja ir, que é publicado no site da instituição duas vezes no ano. Nele estarão listados todos os documentos e procedimentos necessários, variando de Fatec para Fatec."
      },
      {
        pergunta: "Como faço para ter abono de faltas?",
        resposta: "O abono de faltas só é realizado nos seguintes casos: 1.Convocação para cumprimento de serviços obrigatórios por lei; 2.Exercício de representação estudantil em órgãos colegiados, nos horários em que estes se reúnem; 3.Falecimento de cônjuge, filho, pais ou padrastos e irmãos, 3 (três) dias; 4.Falecimento de avós, sogros e cunhados, 2 (dois) dias. São considerados merecedores de tratamento excepcional os alunos em condição de incapacidade física temporária de frequência às aulas, mas com conservação das condições intelectuais e emocionais necessárias ao prosseguimento dos estudos. Para tanto, é necessário que possuam atestados médicos não inferiores a 15 dias, com a especificação da natureza do impedimento e informações de que as condições intelectuais e emocionais necessárias para o desenvolvimento das atividades de estudo estão preservadas;"
      },
      {
        pergunta: "Como faço para solicitar o aproveitamento de matérias?",
        resposta: "A solicitação deverá ser realizada no sistema Siga no prazo estabelecido em calendário, sendo obrigatório anexar os documentos: Histórico escolar da instituição e conteúdo programático."
      }
    ],
    outros: [
      {
        pergunta: "Qual o horário de atendimento da Secretaria?",
        resposta: "De 2ª a 6ª feira, das 8h às 22h."
      },
      {
        pergunta: "Como faço para me inscrever no vestibular?",
        resposta: "A seleção de novos ingressantes acontece semestralmente. As inscrições devem ser realizadas no site: https://vestibular.fatec.sp.gov.br/home/, e realizar a inscrição, seguindo as informações do Manual do Candidato."
      }
    ]
  };

  radios.forEach(radio => {
    radio.addEventListener("change", function() {
      const categoriaSelecionada = this.value;
      const faqs = faqsPorCategoria[categoriaSelecionada] || [];

      faqContainer.innerHTML = faqs.map(faq => `
        <div class="faq-item">
          <p class="pergunta"><strong>${faq.pergunta}</strong></p>
          <p class="resposta">${faq.resposta}</p>
        </div>
      `).join("");

      // Destrava a textarea assunto
      textareaAssunto.disabled = false;
    });
  });
});