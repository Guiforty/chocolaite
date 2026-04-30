document.addEventListener('DOMContentLoaded', () => {
    const btnFinish = document.querySelector('.btn-finish');
    const overlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');

    if (btnFinish) {
        btnFinish.addEventListener('click', () => {
            // 1. Pegamos os dados atuais da tela de pedido
            const total = document.querySelector('.summary div:nth-child(3) span:last-child').innerText;
            const quantidade = document.querySelector('.quantity-selector span').innerText;
            const dataAtual = new Date().toLocaleDateString('pt-BR');

            // 2. Criamos o card idêntico ao da tela de perfil (estilo address-card)
            modalBody.innerHTML = `
                <div class="address-card" style="text-align: left; border: 2px solid #4a362d;">
                    <strong>✅ Pedido Confirmado</strong>
                    <div style="margin-top:10px; font-size:14px; color:#555;">
                        <p><strong>Itens:</strong> ${quantidade}x Chokko Melt Tradicional</p>
                        <p><strong>Total Pago:</strong> ${total}</p>
                        <p><strong>Data:</strong> ${dataAtual}</p>
                        <p><strong>Status:</strong> Em preparação 🍫</p>
                    </div>
                </div>
                <p style="margin-top: 15px; font-size: 13px; color: #777;">
                    Acompanhe os detalhes na sua aba de pedidos.
                </p>
            `;

            // 3. Mostramos o Modal
            overlay.style.display = 'flex';
        });
    }

    // --- Lógica de Quantidade (mantendo o que você já tinha) ---
    const btnMinus = document.querySelector('.quantity-selector button:first-child');
    const btnPlus = document.querySelector('.quantity-selector button:last-child');
    const quantityDisplay = document.querySelector('.quantity-selector span');
    
    if (btnMinus && btnPlus) {
        let q = 1;
        btnPlus.onclick = () => { q++; quantityDisplay.innerText = q; atualizarTotal(q); };
        btnMinus.onclick = () => { if(q > 1) { q--; quantityDisplay.innerText = q; atualizarTotal(q); } };
    }
});

function atualizarTotal(qtd) {
    const subtotal = qtd * 25.00;
    const total = subtotal + 5.00;
    document.querySelector('.summary div:nth-child(1) span:last-child').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.querySelector('.summary div:nth-child(3) span:last-child').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}