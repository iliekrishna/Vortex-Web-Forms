document.addEventListener('DOMContentLoaded', () => {
  
  // Mostrar ou esconder campos RA/Curso conforme o tipo de vínculo
  const tipoVinculoSelect = document.getElementById('tipo_vinculo_ticket');
  const grupoAluno = document.getElementById('grupoAluno'); // Seu grupo com RA, Curso etc
    const campoRA = document.getElementById('raEnviar');
    // --- Popula select de documentos via PHP ---
    const nomeDoc = document.getElementById('nome_doc');
    if (nomeDoc) {
        // Mensagem inicial
        nomeDoc.innerHTML = '<option value="">Carregando documentos...</option>';

        fetch('trazer_doc.php')
            .then(resp => resp.json())
            .then(data => {
                if (data.sucesso) {
                    // Limpa e adiciona a opção padrão
                    nomeDoc.innerHTML = '<option value="">Selecione um documento</option>';

                    // Adiciona os documentos do PHP
                    data.documentos.forEach(doc => {
                        const option = document.createElement('option');
                        option.value = doc.nome_doc; // mantém valor visível
                        option.dataset.disponibilidade = doc.id_disponibilidade; // armazena o ID
                        option.textContent = doc.nome_doc;
                        nomeDoc.appendChild(option);
                    });
                } else {
                    nomeDoc.innerHTML = '<option value="">Erro ao carregar documentos</option>';
                    console.error('Erro PHP:', data.mensagem);
                }
            })
            .catch(err => {
                nomeDoc.innerHTML = '<option value="">Erro ao conectar com o servidor</option>';
                console.error('Erro fetch:', err);
            });
    }

  tipoVinculoSelect.addEventListener('change', function () {
    const valor = this.value;

    if (valor === 'Aluno' || valor === 'Ex-aluno') {
      grupoAluno.classList.add('visible');  // mostra grupo RA, Curso...
      if (campoRA) {
        campoRA.required = (valor === 'Aluno'); // só obrigatório se for Aluno
        if (valor === 'Ex-aluno') campoRA.value = ''; // pode deixar vazio
      }
    } else if (valor === 'Comunidade externa') {
      grupoAluno.classList.remove('visible'); // esconde grupo RA, Curso...
      if (campoRA) {
        campoRA.required = false;   // RA não obrigatório
        campoRA.value = '';         // limpa valor
      }
    } else {
      grupoAluno.classList.remove('visible');
      if (campoRA) campoRA.required = false;
    }
  });

  // === Troca de abas ===
  const tablinks = document.querySelectorAll('.tablinks');
  const tabcontents = document.querySelectorAll('.tabcontent');

  tablinks.forEach(tab => {
    tab.addEventListener('click', () => {
      tablinks.forEach(t => t.classList.remove('active'));
      tabcontents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
    // === máscara no nome ===

    function aplicarMascaraNomeComValidacao(id) {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', () => {
            input.value = input.value
                .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ'\-\s]/g, '') // remove caracteres inválidos
                .replace(/\s{2,}/g, ' ')                // evita espaços duplos
                .trim(); // remove espaço em branco no começo e final;                           
        });
    }
    //aplicarMascaraNomeComValidacao('nome_aluno'); // Formulário de ticket
    // aplicarMascaraNomeComValidacao('nome');       // Formulário de requerimento


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

    // Aplicar mascara de RG

    function aplicarMascaraRG(id) {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', () => {
            let valor = input.value.replace(/\D/g, '');


            if (valor.length > 2 && valor.length <= 5) {
                valor = valor.replace(/(\d{2})(\d+)/, '$1.$2');
            } else if (valor.length > 5 && valor.length <= 8) {
                valor = valor.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
            } else if (valor.length > 8) {
                valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
            }

            if (valor.length > 12) valor = valor.substring(0, 12);
            input.value = valor;
        });
    }

    function validarRG(rg) {
        rg = rg.replace(/\D/g, ''); // remove pontos e hífen

        // Exige 9 dígitos numéricos
        if (!/^[0-9]{9}$/.test(rg)) return false;

        if (/(\d)\1{5,}/.test(rg)) return false;


        return true;
    }

    // Mascara de telefone

    function aplicarMascaraTelefone(id) {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', () => {
            let valor = input.value.replace(/\D/g, '');

            if (valor.length > 11) valor = valor.substring(0, 11);

            if (valor.length > 10) {
                // 9 dígitos
                valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (valor.length > 6) {
                valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (valor.length > 2) {
                valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                valor = valor.replace(/(\d*)/, '($1');
            }

            input.value = valor;
        });
    }

    //Validar telefone
    function validarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, ''); // remove tudo que não for número
        // 10 ou 11 digitos
        return telefone.length === 10 || telefone.length === 11;
    }

    function aplicarMascaraRA(id) {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, ''); // Remove letras e símbolos
        });
    }

    // validar ra
    function validarRA(ra) {
        ra = ra.replace(/\D/g, ''); // Remove tudo que não for número
        return ra.startsWith('167') && ra.length === 13;
    }
    // aplicar mascara de ra
    aplicarMascaraRA('ra');
    aplicarMascaraRA('raEnviar');

    // apliaca a mascar de telefone
    aplicarMascaraTelefone('telefone');

    // aplicar mascara de RG
    aplicarMascaraRG('rg');

    // Aplica máscara em todos os campos CPF
    aplicarMascaraCPF('cpf');
    aplicarMascaraCPF('cpfBuscar');
    aplicarMascaraCPF('cpfDoc');

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

    // === FAQ toggle ===
    fetch('trazer_faqs.php')
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                const faqCategoriasContainer = document.querySelector('.faq-categorias');
                faqCategoriasContainer.innerHTML = ''; // Limpa categorias hardcoded

                // data.faqs é um objeto com chave = categoria_id
                Object.values(data.faqs).forEach(categoria => {
                    const categoriaDiv = document.createElement('div');
                    categoriaDiv.classList.add('faq-categoria');

                    const h4 = document.createElement('h4');
                    h4.textContent = categoria.nome_categoria; // pega o nome atualizado
                    categoriaDiv.appendChild(h4);

                    const perguntasDiv = document.createElement('div');
                    perguntasDiv.classList.add('faq-perguntas');
                    perguntasDiv.style.display = 'none';

                    categoria.perguntas.forEach(faq => {
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('faq-item');

                        const perguntaP = document.createElement('p');
                        perguntaP.classList.add('pergunta');
                        perguntaP.innerHTML = faq.pergunta;

                        const respostaP = document.createElement('p');
                        respostaP.classList.add('resposta');
                        respostaP.innerHTML = faq.resposta;

                        itemDiv.appendChild(perguntaP);
                        itemDiv.appendChild(respostaP);
                        perguntasDiv.appendChild(itemDiv);
                    });

                    categoriaDiv.appendChild(perguntasDiv);
                    faqCategoriasContainer.appendChild(categoriaDiv);

                    categoriaDiv.addEventListener('click', function (e) {
                        if (e.target.closest('.faq-item')) return;
                        perguntasDiv.style.display = perguntasDiv.style.display === 'none' ? 'block' : 'none';
                    });
                });
            } else {
                console.error('Erro ao carregar FAQs:', data.error || data.mensagem);
            }
        })
        .catch(err => console.error('Erro fetch FAQs:', err));

        // === FAQ Search ===
        const searchInput = document.getElementById('faqSearch');
        if (searchInput) {
          searchInput.addEventListener('input', function () {
            const termo = this.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos

            document.querySelectorAll('.faq-categoria').forEach(categoria => {
              let temResultado = false;

              categoria.querySelectorAll('.faq-item').forEach(item => {
                const pergunta = item.querySelector('.pergunta');
                const resposta = item.querySelector('.resposta');

                // Texto original
                const originalPergunta = pergunta.textContent;
                const originalResposta = resposta.textContent;

                // Normaliza sem acento
                const normalizedPergunta = originalPergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const normalizedResposta = originalResposta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                // Limpa highlights antigos
                pergunta.innerHTML = originalPergunta;
                resposta.innerHTML = originalResposta;

                function highlight(original, normalized) {
                  if (termo === "") return original;

                  let result = "";
                  let i = 0;

                  while (i < normalized.length) {
                    if (normalized.substr(i, termo.length) === termo) {
                      // adiciona highlight usando índice do texto original
                      result += `<span class="highlight">${original.substr(i, termo.length)}</span>`;
                      i += termo.length;
                    } else {
                      result += original[i];
                      i++;
                    }
                  }
                  return result;
                }

                pergunta.innerHTML = highlight(originalPergunta, normalizedPergunta);
                resposta.innerHTML = highlight(originalResposta, normalizedResposta);

                // Mostrar ou esconder o item
                if (normalizedPergunta.includes(termo) || normalizedResposta.includes(termo) || termo === "") {
                  item.style.display = 'block';
                  temResultado = true;
                } else {
                  item.style.display = 'none';
                }
              });

              categoria.style.display = temResultado || termo === "" ? 'block' : 'none';
            });
          });
        }
        
  // === Controle do formulário de ticket ===
  const formTicket = document.getElementById('formTicket');
  const mostrarFormBtn = document.getElementById('mostrarFormularioTicket');
  const closeFormBtn = document.querySelector('.close-form');
  let formVisible = false;

  function toggleForm() {
    formVisible = !formVisible;
    const cta = document.querySelector('.ticket-cta');
    
    if (formVisible) {
      formTicket.classList.add('visible');
      cta.classList.add('hidden');
      formTicket.scrollIntoView({ behavior: 'smooth' });
    } else {
      formTicket.classList.remove('visible');
      cta.classList.remove('hidden');
    }
  }

  if(mostrarFormBtn) mostrarFormBtn.addEventListener('click', toggleForm);
  if(closeFormBtn) closeFormBtn.addEventListener('click', toggleForm);

  // Envio do formulário de TICKET
  if (formTicket) {
    formTicket.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const cpfInput = document.getElementById('cpf');
      if (!validarCPF(cpfInput.value)) {
        alert('❌ CPF inválido. Verifique os números digitados.');
        return;
      }
      
      const formData = new FormData(formTicket);
      const cpfLimpo = cpfInput.value.replace(/\D/g, '');
        formData.set('cpf', cpfLimpo);

        //Validação do nome
        const nome = document.getElementById('nome_aluno').value.trim();
        const nomeValido = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/.test(nome);

        if (!nomeValido) {
            alert('❌ Nome inválido. Verifique o nome digitado.');
            return;
        }

        //Validação de ra
        const tipoVinculo = document.getElementById('tipo_vinculo_ticket').value;
        const raValor = document.getElementById('raEnviar').value.trim();

        if (tipoVinculo === 'Aluno' || tipoVinculo === 'Ex-aluno') {
          if (!validarRA(raValor)) {
            alert('❌ RA inválido. Verifique os números digitados.');
            return;
          }
        } else if (tipoVinculo === 'Comunidade externa') {
          // RA pode ficar vazio, não valida
        }


      fetch('enviar_ticket.php', { // Este é o envio do ticket, não do requerimento
        method: 'POST',
        body: formData
      })
      .then(resp => resp.json())
      .then(data => {
        if (data.sucesso) {
          alert('✅ Ticket enviado com sucesso!');
          formTicket.reset();
          toggleForm();
          
          const ctaDiv = document.querySelector('.ticket-cta');
          ctaDiv.innerHTML = `
            <div class="ticket-success-message">
              <p>Após enviar a sua dúvida, você poderá ver o status na aba <a href="#" class="link-buscar-resposta">"Buscar Resposta"</a>.</p>
              <button id="novoTicket">Enviar outro ticket</button>
            </div>
          `;
          
          document.getElementById('novoTicket').addEventListener('click', function() {
            const ctaOriginal = `
              <p>Ainda não teve sua dúvida respondida?</p>
              <button id="mostrarFormularioTicket">Clique aqui para enviar um ticket de dúvidas para a secretaria</button>
            `;
            ctaDiv.innerHTML = ctaOriginal;
            document.getElementById('mostrarFormularioTicket').addEventListener('click', toggleForm);
          });

          document.querySelector('.link-buscar-resposta').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('[data-tab="tabBuscar"]').click();
          });
        } else {
          alert('❌ Erro ao enviar ticket: ' + data.mensagem);
        }
      })
      .catch(() => alert('❌ Ocorreu um erro ao tentar enviar o formulário.'));
    });

    

  }

  // === Busca por CPF ===
  const btnBuscar = document.getElementById('btnBuscar');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', () => {
      const cpf = document.getElementById('cpfBuscar').value.trim();
      
      if (!validarCPF(cpf)) {
        alert('Por favor, digite um CPF válido.');
        return;
      }
      const cpfLimpo = cpf.replace(/\D/g, '');

      const respostaContainer = document.getElementById('respostaResultado');
      const historicoContainer = document.getElementById('historicoResultado');
      const resultadoDiv = document.getElementById('resultadoContainer');

      respostaContainer.innerHTML = 'Carregando...';
      historicoContainer.innerHTML = '';
      resultadoDiv.style.display = 'none';

      fetch(`buscar_resposta.php?cpf=${encodeURIComponent(cpfLimpo)}`)
        .then(resp => {
          if (!resp.ok) throw new Error('Erro na comunicação com o servidor.');
          return resp.json();
        })
        .then(data => {
  if (data.sucesso) {
    if (!data.historico || data.historico.length === 0) {
      respostaContainer.innerHTML = 'Nenhum ticket ou solicitação de documento encontrado para este CPF.';
      resultadoDiv.style.display = 'block';
      return;
    }

    resultadoDiv.style.display = 'block';

  
    // === Última respondida ===
    const ultima = data.historico.find(item => item.resposta && item.resposta.trim() !== '' || item.status === "Cancelado");

    if (ultima) {
      const labelUltima = ultima.tipo === 'requerimento' ? 'Documento Solicitado' : 'Assunto';

      let respostaTexto;
      if (ultima.status === "Cancelado") {
        respostaTexto = `Pergunta invalidada. Justificativa: ${ultima.resposta || 'Sem justificativa informada'}`;
      } else {
        respostaTexto = ultima.resposta;
      }

      respostaContainer.innerHTML = `
        <div class="historico-item">
          <p><strong>${labelUltima}:</strong> ${ultima.titulo || 'Não especificado'}</p>
          <p><strong>Resposta:</strong> ${respostaTexto}</p>
        </div>
      `;
    } else {
      respostaContainer.innerHTML = '';
    }


    // === Histórico completo (inclusive sem resposta) ===
    let htmlHistorico = '';
    data.historico.forEach((item, idx) => {
      const label = item.tipo === 'requerimento' ? 'Documento Solicitado' : 'Assunto';

      let respostaTexto;
      if (item.status === "Cancelado") {
        respostaTexto = `Pergunta invalidada. Justificativa: ${item.resposta || 'Sem justificativa informada'}`;
      } else {
        respostaTexto = item.resposta || 'Ainda não respondido';
      }

      htmlHistorico += `
        <div class="historico-item">
          <p><strong>${label}:</strong> ${item.titulo || 'Não especificado'}</p>
          <p><strong>Resposta:</strong> ${respostaTexto}</p>
        </div>
        ${idx < data.historico.length - 1 ? '<hr>' : ''}
      `;
    });
    historicoContainer.innerHTML = htmlHistorico;


  } else {
    respostaContainer.innerHTML = 'Erro: ' + data.mensagem;
    resultadoDiv.style.display = 'block';
  }
})

        .catch(err => {
          respostaContainer.innerHTML = 'Ocorreu um erro: ' + err.message;
          resultadoDiv.style.display = 'block';
        });
    });
  }

  
  // === Envio do requerimento ===
      const formRequerimento = document.getElementById('formRequerimento');
      const tipoVinculo = document.getElementById('tipo_vinculo_req'); // novo ID
      const raInput = document.getElementById('ra');
      const grupoRA = document.getElementById('grupoAluno'); // container do RA/Curso

      // Mostrar RA sempre, obrigatoriedade apenas para aluno
      tipoVinculo.addEventListener('change', () => {
          // mostra sempre
          grupoRA.classList.add('visible');

          // RA obrigatório só se for Aluno
          raInput.required = tipoVinculo.value === 'Aluno';
      });

      if (formRequerimento) {
          formRequerimento.addEventListener('submit', function(e) {
              e.preventDefault();

        const cpfInput = document.getElementById('cpfDoc');
        if (!validarCPF(cpfInput.value)) {
            alert('❌ CPF inválido. Verifique os números digitados.');
            return;
        }

        const nomeReq = document.getElementById('nome').value.trim();
        const nomeValido = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/.test(nomeReq);
        if (!nomeValido) {
            alert('❌ Nome inválido. Verifique o nome digitado.');
            return;
        }

        if (!validarRG(document.getElementById('rg').value)) {
            alert('❌ RG inválido. Verifique os números digitados.');
            return;
        }

        if (!validarTelefone(document.getElementById('telefone').value)) {
            alert('❌ Telefone inválido. Verifique os números digitados.');
            return;
        }

        // Validação RA condicional
        const ra = raInput.value.trim();
        if (tipoVinculo.value === 'Aluno' && !validarRA(ra)) {
            alert('❌ RA inválido. Verifique os números digitados.');
            return;
        }



          // Seleciona motivo e arquivos
          const motivo = document.getElementById('motivo_segunda_via').value;
          const comprovanteInput = document.getElementById('comprovante');
          const boInput = document.getElementById('bo');

          

          // Verifica obrigatoriedade dos arquivos
          if (motivo === 'Perda' && (!comprovanteInput || comprovanteInput.files.length === 0)) {
            alert('❌ Por favor, envie o comprovante.');
            return;
          }
          if (motivo === 'Roubo/Furto') {
            if (!comprovanteInput || comprovanteInput.files.length === 0) {
              alert('❌ Por favor, envie o comprovante.');
              return;
            }
            if (!boInput || boInput.files.length === 0) {
              alert('❌ Por favor, envie o Boletim de Ocorrência.');
              return;
            }
          }

          //debug
          console.log('Motivo segunda via:', motivo);

          // --- Criar FormData ---
         const formData = new FormData();
          formData.append('tipo_vinculo', tipoVinculo.value); // <- ESSENCIAL
          formData.append('ra', ra);
          formData.append('telefone', document.getElementById('telefone').value.replace(/\D/g, ''));
          formData.append('curso', document.getElementById('cursoDoc').value);
          formData.append('nome', nomeReq);
          formData.append('rg', document.getElementById('rg').value.replace(/\D/g, ''));
          formData.append('email', document.getElementById('email_req').value);
          formData.append('nome_doc', document.getElementById('nome_doc').value);
          formData.append('cpf', cpfInput.value.replace(/\D/g, ''));
          formData.append('motivo_segunda_via', motivo);


          // Adiciona arquivos ao FormData
          if (comprovanteInput && comprovanteInput.files.length > 0) {
            formData.append('comprovante', comprovanteInput.files[0]);
          }
          if (boInput && boInput.files.length > 0) {
            formData.append('bo', boInput.files[0]);
          }

          const inputImagem = document.getElementById('imagem');
          if (inputImagem && inputImagem.files.length > 0) {
            formData.append('imagem', inputImagem.files[0]);
          }

            // --- Envio ---
            fetch('enviar_requerimento.php', {
              method: 'POST',
              body: formData
            })
              .then(resp => resp.json())
              .then(data => {
                if (data.sucesso) {
                  alert('✅ Requerimento enviado com sucesso!');
                  formRequerimento.reset();
                  // opcional: esconder campos que dependem de seleção
                  document.getElementById('blocoImagem').style.display = 'none';
                  document.getElementById('uploadComprovante').style.display = 'none';
                  document.getElementById('uploadBO').style.display = 'none';
                  document.querySelectorAll('.file-upload-filename').forEach(span => span.textContent = 'Nenhum arquivo selecionado');
                } else {
                  alert('❌ Erro ao enviar requerimento: ' + data.mensagem);
                }
              })
              .catch(() => alert('❌ Ocorreu um erro ao tentar enviar o formulário.'));
          });
      } 



        
        const blocoImagem = document.getElementById('blocoImagem'); // div que aparece só para RA
        const motivoSelect = document.getElementById('motivo_segunda_via'); // select do motivo
        const uploadComprovante = document.getElementById('uploadComprovante'); // div do comprovante
    const uploadBO = document.getElementById('uploadBO'); // div do BO

    

        // Inicializa estado inicial
    blocoImagem.style.display = nomeDoc.selectedOptions[0]?.dataset.disponibilidade === '5' ? 'block' : 'none';

        // Quando muda o documento
        nomeDoc.addEventListener('change', () => {
            if (nomeDoc.selectedOptions[0]?.dataset.disponibilidade === '5') {
            blocoImagem.style.display = 'block';
            motivoSelect.value = '';
            uploadComprovante.style.display = 'none';
            uploadBO.style.display = 'none';
            document.getElementById('comprovante').value = '';
            document.getElementById('bo').value = '';
            document.querySelectorAll('.file-upload-filename').forEach(span => span.textContent = 'Nenhum arquivo selecionado');
          } else {
            blocoImagem.style.display = 'none';
            uploadComprovante.style.display = 'none';
            uploadBO.style.display = 'none';
          }
        });

        // Quando muda o motivo
        motivoSelect.addEventListener('change', () => {
          const motivo = motivoSelect.value;
          if (motivo === 'Perda') {
            uploadComprovante.style.display = 'block';
            uploadBO.style.display = 'none';
          } else if (motivo === 'Roubo/Furto') {
            uploadComprovante.style.display = 'block';
            uploadBO.style.display = 'block';
          } else {
            uploadComprovante.style.display = 'none';
            uploadBO.style.display = 'none';
          }
        });

        // Função para atualizar o nome do arquivo selecionado
        function setupFileInput(fileInputId) {
          const input = document.getElementById(fileInputId);
          if (!input) return;

          const wrapper = input.closest('.file-upload-wrapper');
          if (!wrapper) return;

          const btn = wrapper.querySelector('.file-upload-btn');
          const span = wrapper.querySelector('.file-upload-filename');

          // Clique no botão dispara o input
          btn.addEventListener('click', () => input.click());

          // Atualiza o nome do arquivo quando selecionado
          input.addEventListener('change', () => {
            span.textContent = input.files.length > 0 ? input.files[0].name : 'Nenhum arquivo selecionado';
          });
        }

        // Chamadas para cada input de arquivo
        setupFileInput('comprovante'); // Comprovante
        setupFileInput('bo');          // BO
        setupFileInput('imagem');      // Imagem RA

      

  // === Mostrar/ocultar botões de ajuda ===
  const ajudaBotao = document.getElementById('ajudaBotao');
  const ajudaTexto = document.getElementById('ajudaTexto');
  
  if (ajudaBotao && ajudaTexto) {
    ajudaBotao.addEventListener('click', () => {
      ajudaTexto.classList.toggle('visible');

    });
  }

  const ajudaBotaoBuscar = document.getElementById('ajudaBotaoBuscar');
  const ajudaTextoBuscar = document.getElementById('ajudaTextoBuscar');

  if (ajudaBotaoBuscar && ajudaTextoBuscar) {
    ajudaBotaoBuscar.addEventListener('click', () => {
      ajudaTextoBuscar.classList.toggle('visible');
    });
  }

    const prazosContainer = document.getElementById('prazosContainer');

    fetch('prazo.php')
        .then(resp => resp.json())
        .then(data => {
            if (data.sucesso && data.documentos.length > 0) {
                prazosContainer.innerHTML = '';
                data.documentos.forEach(doc => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${doc.nome_doc}:</strong> ${doc.descricao}`;
                    prazosContainer.appendChild(p);
                });
            } else {
                prazosContainer.innerHTML = '<p>Nenhum documento encontrado.</p>';
            }
        })
        .catch(err => {
            console.error('Erro ao carregar documentos:', err);
            prazosContainer.innerHTML = '<p>Erro ao carregar os prazos.</p>';
        });




});