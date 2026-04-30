/* ==========================================================
   PERFIL.JS - VERSÃO COMPLETA (MODAL + CEP + UPLOAD)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Seletores do Modal
    const overlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    const btnSalvar = document.getElementById('btn-salvar-modal');

    // --- FUNÇÃO PARA ABRIR O MODAL (MOTOR DO SISTEMA) ---
    window.abrirModal = (titulo, campos, acaoSalvar) => {
        if (!overlay || !modalBody) {
            console.error("Erro: Verifique se o HTML do modal existe!");
            return;
        }
        
        modalTitle.innerText = titulo;
        modalBody.innerHTML = ''; 
        
        campos.forEach(campo => {
            const input = document.createElement('input');
            input.type = campo.type || 'text'; 
            input.placeholder = campo.label;
            input.value = campo.valor || '';
            input.id = campo.id;
            input.className = "modal-input"; // Para você estilizar no CSS
            
            // Lógica de busca de CEP automática
            if (campo.id.includes('cep')) {
                input.maxLength = 8;
                input.addEventListener('blur', () => buscarCEP(input.value));
            }
            modalBody.appendChild(input);
        });

        overlay.style.display = 'flex';
        btnSalvar.onclick = () => { acaoSalvar(); fecharModal(); };
    };

    // --- LÓGICA DE BUSCA DE CEP (API VIACEP) ---
    async function buscarCEP(cep) {
        const valorCep = cep.replace(/\D/g, '');
        if (valorCep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
                const dados = await response.json();
                if (!dados.erro) {
                    const inputRua = document.getElementById('add-rua') || document.getElementById('edit-rua');
                    const inputBairro = document.getElementById('add-bairro') || document.getElementById('edit-bairro');
                    if (inputRua) inputRua.value = dados.logradouro;
                    if (inputBairro) inputBairro.value = dados.bairro;
                }
            } catch (e) { console.error("Erro na API de CEP"); }
        }
    }

    // --- 1. EDITAR PERFIL (NOME, EMAIL, TEL, FOTO PC) ---
    const btnEditProfile = document.querySelector('.btn-edit-info');
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
            const elNome = document.querySelector('.user-details h2');
            const elFoto = document.querySelector('.avatar');
            const rows = document.querySelectorAll('.contact-row');

            const campos = [
                { id: 'p-nome', label: 'Nome Completo', valor: elNome.innerText },
                { id: 'p-email', label: 'E-mail', valor: rows[0].innerText.replace(/[✉\s]/g, '') },
                { id: 'p-tel', label: 'Telefone', valor: rows[1].innerText.replace(/[📞\s]/g, '') },
                { id: 'p-foto-upload', label: 'Trocar foto (Escolha um arquivo)', type: 'file' }
            ];

            abrirModal("Editar Perfil", campos, () => {
                const nNome = document.getElementById('p-nome').value;
                const nEmail = document.getElementById('p-email').value;
                const nTel = document.getElementById('p-tel').value;
                const inputFoto = document.getElementById('p-foto-upload');

                if (nNome) elNome.innerText = nNome;
                if (rows[0] && nEmail) rows[0].innerHTML = `<span>✉</span> ${nEmail}`;
                if (rows[1] && nTel) rows[1].innerHTML = `<span>📞</span> ${nTel}`;

                // Processa a foto do PC
                if (inputFoto.files && inputFoto.files[0]) {
                    const leitor = new FileReader();
                    leitor.onload = (e) => elFoto.src = e.target.result;
                    leitor.readAsDataURL(inputFoto.files[0]);
                }
            });
        });
    }

    // --- 2. ADICIONAR ENDEREÇO ---
    const btnAddAddress = document.querySelector('.btn-add-address');
    if (btnAddAddress) {
        btnAddAddress.addEventListener('click', () => {
            const campos = [
                { id: 'add-titulo', label: 'Apelido (Ex: Casa)', valor: '' },
                { id: 'add-cep', label: 'CEP', valor: '' },
                { id: 'add-rua', label: 'Rua', valor: '' },
                { id: 'add-numero', label: 'Número', valor: '' },
                { id: 'add-bairro', label: 'Bairro', valor: '' }
            ];

            abrirModal("Novo Endereço", campos, () => {
                const t = document.getElementById('add-titulo').value;
                const c = document.getElementById('add-cep').value;
                const r = document.getElementById('add-rua').value;
                const n = document.getElementById('add-numero').value;
                const b = document.getElementById('add-bairro').value;

                if (t && r) {
                    const container = document.querySelector('.addresses-section');
                    const div = document.createElement('div');
                    div.className = 'address-card';
                    div.innerHTML = `
                        <strong>📍 ${t}</strong>
                        <div style="margin-top:10px; font-size:14px;">
                            <p><strong>Rua:</strong> <span class="rua-text">${r}</span>, <span class="num-text">${n}</span></p>
                            <p><strong>Bairro:</strong> <span class="bairro-text">${b}</span></p>
                            <p><strong>CEP:</strong> <span class="cep-text">${c}</span></p>
                        </div>
                        <div class="address-footer" style="margin-top:10px; display:flex; gap:10px;">
                            <button class="btn-outline" onclick="editarEndereco(this)">Editar</button>
                            <button class="btn-outline-danger" onclick="excluirEndereco(this)">Excluir</button>
                        </div>`;
                    container.appendChild(div);
                }
            });
        });
    }
});

/* ==========================================================
   FUNÇÕES GLOBAIS (FORA DO DOMCONTENTLOADED)
   ========================================================== */

function fecharModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.style.display = 'none';
}

function editarEndereco(botao) {
    const card = botao.closest('.address-card');
    const campos = [
        { id: 'edit-cep', label: 'CEP', valor: card.querySelector('.cep-text').innerText },
        { id: 'edit-rua', label: 'Rua', valor: card.querySelector('.rua-text').innerText },
        { id: 'edit-num', label: 'Número', valor: card.querySelector('.num-text').innerText },
        { id: 'edit-bairro', label: 'Bairro', valor: card.querySelector('.bairro-text').innerText }
    ];
    
    abrirModal("Editar Endereço", campos, () => {
        card.querySelector('.cep-text').innerText = document.getElementById('edit-cep').value;
        card.querySelector('.rua-text').innerText = document.getElementById('edit-rua').value;
        card.querySelector('.num-text').innerText = document.getElementById('edit-num').value;
        card.querySelector('.bairro-text').innerText = document.getElementById('edit-bairro').value;
    });
}

function excluirEndereco(botao) {
    if (confirm("Excluir endereço?")) botao.closest('.address-card').remove();
}