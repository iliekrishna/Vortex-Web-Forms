document.addEventListener('DOMContentLoaded', () => {
  // === Troca de abas ===
  const tablinks = document.querySelectorAll('.tablinks');
  const tabcontents = document.querySelectorAll('.tabcontent');

  tablinks.forEach(tab => {
    tab.addEventListener('click', () => {
      tablinks.forEach(t => t.classList.remove('active'));
      tabcontents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

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

  // === Aplicar máscara nos dois campos ===
  aplicarMascaraCPF('cpf');       // campo da aba Enviar Ticket
  tablinks.forEach(tab => {
  tab.addEventListener('click', () => {
    tablinks.forEach(t => t.classList.remove('active'));
    tabcontents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const tabId = tab.dataset.tab;
    document.getElementById(tabId).classList.add('active');

    // Aplica a máscara ao campo cpfBuscar quando a aba é ativada
    if (tabId === 'tabBuscar') {
      aplicarMascaraCPF('cpfBuscar');
    }
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
              <strong>Assunto:</strong> ${ultima.assunto}<br>
              <strong>Resposta:</strong> ${ultima.resposta || '<em>Sem resposta ainda.</em>'}
            `;

            let htmlHistorico = '';
            data.historico.forEach(item => {
              htmlHistorico += `
                <p><strong>Assunto:</strong> ${item.assunto}<br>
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

  // === FAQ toggle ===
  const perguntas = document.querySelectorAll('.faq-item .pergunta');
  perguntas.forEach(p => {
    p.addEventListener('click', () => {
      const resposta = p.nextElementSibling;
      if (resposta.style.display === 'block') {
        resposta.style.display = 'none';
      } else {
        resposta.style.display = 'block';
      }
    });
  });

    // === Envio do requerimento ===
    const formRequerimento = document.getElementById('formRequerimento');


    if (formRequerimento) {
        formRequerimento.addEventListener('submit', function (e) {
            e.preventDefault();
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
});
