/* ============================================
   SISTEMA DE PRONTUÁRIOS - POSTO DE SAÚDE
   Nossa Senhora De Lourdes
   JavaScript Profissional v2.0 - Parte 1
   ============================================ */

// ============================================
// CONFIGURAÇÃO E INICIALIZAÇÃO
// ============================================

const CONFIG = {
    VERSAO: '2.0',
    STORAGE_KEYS: {
        FUNCIONARIOS: 'funcionarios',
        PRONTUARIOS: 'prontuarios',
        TRIAGENS: 'triagens',
        CIDADE: 'cidade',
        SESSAO: 'usuarioLogado',
        PRONTUARIO_VISUALIZANDO: 'prontuarioVisualizando',
        PRONTUARIO_EDITANDO: 'prontuarioEditando'
    },
    CREDENCIAIS_PADRAO: {
        admin: { senha: 'admin123', tipo: 'gerente', profissao: 'admin' },
        gerente: { senha: 'gerente123', tipo: 'gerente', profissao: 'gerente' }
    }
};

// Inicialização do sistema
function inicializarSistema() {
    console.log(`🏥 Sistema de Prontuários v${CONFIG.VERSAO} - Iniciando...`);
    
    let funcionarios = getFuncionarios();
    let modificou = false;
    
    // Cria admin se não existe
    if (!funcionarios.some(f => f.usuario === 'admin')) {
        funcionarios.push({
            id: gerarId(),
            nome: 'Administrador do Sistema',
            cpf: '000.000.000-00',
            profissao: 'admin',
            registro: 'ADMIN001',
            usuario: 'admin',
            senha: hashSenha(CONFIG.CREDENCIAIS_PADRAO.admin.senha),
            tipo: 'gerente',
            dataCadastro: new Date().toISOString(),
            ativo: true
        });
        console.log('✅ Admin criado: admin / admin123');
        modificou = true;
    }
    
    // Cria gerente se não existe
    if (!funcionarios.some(f => f.usuario === 'gerente')) {
        funcionarios.push({
            id: gerarId(),
            nome: 'Gerente do Posto',
            cpf: '111.111.111-11',
            profissao: 'gerente',
            registro: 'GER001',
            usuario: 'gerente',
            senha: hashSenha(CONFIG.CREDENCIAIS_PADRAO.gerente.senha),
            tipo: 'gerente',
            dataCadastro: new Date().toISOString(),
            ativo: true
        });
        console.log('✅ Gerente criado: gerente / gerente123');
        modificou = true;
    }
    
    if (modificou) {
        saveFuncionarios(funcionarios);
    }
    
    // Configura cidade padrão
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.CIDADE)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CIDADE, 'Nossa Senhora De Lourdes');
    }
    
    console.log('✅ Sistema inicializado');
}

// Hash simples de senha
function hashSenha(senha) {
    let hash = 0;
    for (let i = 0; i < senha.length; i++) {
        const char = senha.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

function verificarSenha(senhaDigitada, senhaArmazenada) {
    if (senhaArmazenada.startsWith('hash_')) {
        return hashSenha(senhaDigitada) === senhaArmazenada;
    }
    return senhaDigitada === senhaArmazenada;
}

// ============================================
// UTILITÁRIOS
// ============================================

function getFuncionarios() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FUNCIONARIOS)) || [];
}

function saveFuncionarios(funcionarios) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.FUNCIONARIOS, JSON.stringify(funcionarios));
}

function getProntuarios() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PRONTUARIOS)) || [];
}

function saveProntuarios(prontuarios) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PRONTUARIOS, JSON.stringify(prontuarios));
}

function getTriagens() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TRIAGENS)) || [];
}

function saveTriagens(triagens) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.TRIAGENS, JSON.stringify(triagens));
}

function gerarId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatarData(data) {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' + 
           d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
}

function formatarProfissao(profissao) {
    const map = {
        'medico': 'Médico(a)',
        'enfermeiro': 'Enfermeiro(a)',
        'nutricionista': 'Nutricionista',
        'fisioterapeuta': 'Fisioterapeuta',
        'dentista': 'Dentista',
        'recepcionista': 'Recepcionista',
        'admin': 'Administrador',
        'gerente': 'Gerente'
    };
    return map[profissao] || profissao;
}

function getProfissionalPorId(id) {
    const funcionarios = getFuncionarios();
    return funcionarios.find(f => f.id === id);
}

// ============================================
// NOTIFICAÇÕES MODERNAS
// ============================================

function showToast(mensagem, tipo = 'success', duracao = 3000) {
    const toastsAnteriores = document.querySelectorAll('.toast-notification');
    toastsAnteriores.forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    
    const icones = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icones[tipo]}"></i>
        <span>${mensagem}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : tipo === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duracao);
}

function showConfirm(titulo, mensagem, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            ">
                <h3 style="margin-bottom: 1rem; color: #1f2937; font-size: 1.25rem; font-weight: 700;">
                    <i class="fas fa-question-circle" style="color: #f59e0b; margin-right: 0.5rem;"></i>
                    ${titulo}
                </h3>
                <p style="color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6;">${mensagem}</p>
                <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                    <button class="btn-cancel" style="
                        padding: 0.625rem 1.25rem;
                        border: 1px solid #e5e7eb;
                        background: white;
                        border-radius: 0.5rem;
                        color: #6b7280;
                        font-weight: 500;
                        cursor: pointer;
                    ">Cancelar</button>
                    <button class="btn-confirm" style="
                        padding: 0.625rem 1.25rem;
                        border: none;
                        background: #ef4444;
                        border-radius: 0.5rem;
                        color: white;
                        font-weight: 500;
                        cursor: pointer;
                    ">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        modal.remove();
        if (onCancel) onCancel();
    });
    
    modal.querySelector('.btn-confirm').addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });
}

// ============================================
// VALIDAÇÃO DE CPF
// ============================================

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

// ============================================
// LOGIN E AUTENTICAÇÃO
// ============================================

let tentativasLogin = 0;
const MAX_TENTATIVAS = 3;

function mostrarSenha() {
    const senhaInput = document.getElementById('senha');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

function fazerLogin(event) {
    event.preventDefault();
    
    if (tentativasLogin >= MAX_TENTATIVAS) {
        showToast('Muitas tentativas. Tente novamente em 5 minutos.', 'error', 5000);
        return false;
    }
    
    const usuario = document.getElementById('usuario').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    
    const funcionarios = getFuncionarios();
    const funcionario = funcionarios.find(f => 
        f.usuario.toLowerCase() === usuario && f.ativo !== false
    );
    
    if (!funcionario || !verificarSenha(senha, funcionario.senha)) {
        tentativasLogin++;
        mostrarErro('mensagemErro', `Usuário ou senha incorretos! (${tentativasLogin}/${MAX_TENTATIVAS})`);
        return false;
    }
    
    tentativasLogin = 0;
    
    const tipoAcesso = funcionario.tipo || 'profissional';
    
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.SESSAO, JSON.stringify({
        id: funcionario.id,
        nome: funcionario.nome,
        profissao: funcionario.profissao,
        usuario: funcionario.usuario,
        tipo: tipoAcesso,
        loginTime: new Date().toISOString()
    }));
    
    showToast(`Bem-vindo, ${funcionario.nome}!`, 'success');
    
    setTimeout(() => {
        if (tipoAcesso === 'gerente' || funcionario.profissao === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else if (funcionario.profissao === 'recepcionista') {
            window.location.href = 'prontuarios/recepcionista.html';
        } else {
            const destinos = {
                'medico': 'prontuarios/medico.html',
                'enfermeiro': 'prontuarios/enfermeiro.html',
                'nutricionista': 'prontuarios/nutricionista.html',
                'fisioterapeuta': 'prontuarios/fisioterapeuta.html',
                'dentista': 'prontuarios/dentista.html'
            };
            
            const destino = destinos[funcionario.profissao];
            if (destino) {
                window.location.href = destino;
            } else {
                mostrarErro('mensagemErro', 'Erro: Profissão não configurada!');
            }
        }
    }, 500);
    
    return false;
}

function mostrarErro(elementoId, mensagem) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${mensagem}</span>`;
        elemento.style.display = 'flex';
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

function fazerLogout() {
    showConfirm('Sair do sistema', 'Deseja realmente sair?', () => {
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.SESSAO);
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO);
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.PRONTUARIO_EDITANDO);
        window.location.href = '../index.html';
    });
}

// ============================================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// ============================================

function verificarAutenticacao(profissaoRequerida) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    if (!usuarioLogado) {
        showToast('Sessão expirada. Faça login novamente.', 'error');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        return null;
    }
    
    if (usuarioLogado.tipo === 'gerente' && profissaoRequerida !== 'gerente') {
        showToast('Gerentes não têm acesso à criação de prontuários.', 'warning');
        setTimeout(() => {
            window.location.href = '../admin/dashboard.html';
        }, 1500);
        return null;
    }
    
    if (profissaoRequerida && usuarioLogado.profissao !== profissaoRequerida) {
        showToast('Você não tem permissão para acessar esta área!', 'error');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        return null;
    }
    
    return usuarioLogado;
}

function verificarGerente() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return null;
    }
    
    if (usuarioLogado.tipo !== 'gerente' && usuarioLogado.profissao !== 'admin') {
        showToast('Acesso restrito a gerentes!', 'error');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        return null;
    }
    
    return usuarioLogado;
}

// ============================================
// ADMIN / CADASTRO DE FUNCIONÁRIOS
// ============================================

function autenticarAdmin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('adminUser').value.trim();
    const senha = document.getElementById('adminPass').value;
    
    const funcionarios = getFuncionarios();
    const admin = funcionarios.find(f => 
        f.usuario === usuario && 
        (f.profissao === 'admin' || f.tipo === 'gerente') &&
        verificarSenha(senha, f.senha)
    );
    
    if (admin) {
        document.getElementById('authAdmin').style.display = 'none';
        document.getElementById('cadastroSection').style.display = 'block';
        
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.SESSAO, JSON.stringify({
            id: admin.id,
            nome: admin.nome,
            profissao: admin.profissao,
            usuario: admin.usuario,
            tipo: admin.tipo || 'gerente'
        }));
        
        atualizarListaFuncionarios();
        showToast('Acesso concedido!', 'success');
    } else {
        mostrarErro('erroAdmin', 'Credenciais incorretas ou sem permissão!');
    }
    
    return false;
}

function mostrarSenhaCadastro() {
    const senhaInput = document.getElementById('senhaFuncionario');
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function gerarSugestaoUsuario() {
    const nome = document.getElementById('nomeFuncionario').value;
    const profissao = document.getElementById('profissaoFuncionario').value;
    const usuarioField = document.getElementById('usuarioFuncionario');
    const tipoField = document.getElementById('tipoFuncionario');
    
    if (nome && !usuarioField.value) {
        const partes = nome.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z\s]/g, '')
            .trim()
            .split(/\s+/);
        
        if (partes.length >= 2) {
            const sugestao = partes[0] + '.' + partes[partes.length - 1];
            usuarioField.value = sugestao;
        }
    }
    
    if (profissao === 'gerente' || profissao === 'admin') {
        if (tipoField) tipoField.value = 'gerente';
    } else if (profissao === 'recepcionista') {
        if (tipoField) tipoField.value = 'profissional';
    }
}

function cadastrarFuncionario(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nomeFuncionario').value.trim();
    const cpf = document.getElementById('cpfFuncionario').value.trim();
    const profissao = document.getElementById('profissaoFuncionario').value;
    const registro = document.getElementById('registroProfissional').value.trim();
    const usuario = document.getElementById('usuarioFuncionario').value.trim().toLowerCase();
    const senha = document.getElementById('senhaFuncionario').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const tipo = document.getElementById('tipoFuncionario')?.value || 'profissional';
    
    if (!nome || !cpf || !profissao || !usuario || !senha) {
        mostrarErro('erroCadastro', 'Preencha todos os campos obrigatórios!');
        return false;
    }
    
    if (!validarCPF(cpf)) {
        mostrarErro('erroCadastro', 'CPF inválido!');
        return false;
    }
    
    if (senha.length < 6) {
        mostrarErro('erroCadastro', 'A senha deve ter no mínimo 6 caracteres!');
        return false;
    }
    
    if (senha !== confirmarSenha) {
        mostrarErro('erroCadastro', 'As senhas não conferem!');
        return false;
    }
    
    const funcionarios = getFuncionarios();
    if (funcionarios.some(f => f.usuario.toLowerCase() === usuario)) {
        mostrarErro('erroCadastro', 'Este nome de usuário já está em uso!');
        return false;
    }
    
    const novoFuncionario = {
        id: gerarId(),
        nome,
        cpf: formatarCPF(cpf),
        profissao,
        registro,
        usuario,
        senha: hashSenha(senha),
        tipo,
        dataCadastro: new Date().toISOString(),
        ativo: true
    };
    
    funcionarios.push(novoFuncionario);
    saveFuncionarios(funcionarios);
    
    document.getElementById('formCadastro').reset();
    
    const sucessoDiv = document.getElementById('sucessoCadastro');
    sucessoDiv.innerHTML = `<i class="fas fa-check-circle"></i> Funcionário <strong>${nome}</strong> cadastrado com sucesso!`;
    sucessoDiv.style.display = 'flex';
    setTimeout(() => sucessoDiv.style.display = 'none', 3000);
    
    atualizarListaFuncionarios();
    showToast('Funcionário cadastrado!', 'success');
    
    return false;
}

function atualizarListaFuncionarios() {
    const tbody = document.getElementById('tabelaFuncionarios');
    const semFuncionarios = document.getElementById('semFuncionarios');
    
    if (!tbody) return;
    
    const funcionarios = getFuncionarios();
    
    if (funcionarios.length === 0) {
        tbody.innerHTML = '';
        semFuncionarios.style.display = 'block';
        return;
    }
    
    semFuncionarios.style.display = 'none';
    
    tbody.innerHTML = funcionarios.map(f => {
        const isInativo = f.ativo === false;
        return `
        <tr style="${isInativo ? 'opacity: 0.5;' : ''}">
            <td>
                <strong>${f.nome}</strong>
                ${isInativo ? '<br><small style="color: #ef4444;"><i class="fas fa-ban"></i> Inativo</small>' : ''}
                <br><small style="color: #6b7280;">${f.cpf}</small>
            </td>
            <td>
                <span class="badge badge-${f.profissao}">${formatarProfissao(f.profissao)}</span>
                ${f.tipo === 'gerente' ? '<br><small style="color: #f59e0b;"><i class="fas fa-crown"></i> Gerente</small>' : ''}
                ${f.registro ? `<br><small style="color: #6b7280;">Reg: ${f.registro}</small>` : ''}
            </td>
            <td><code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">${f.usuario}</code></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-acao ${isInativo ? 'ativar' : 'excluir'}" 
                            onclick="${isInativo ? `ativarFuncionario('${f.id}')` : `desativarFuncionario('${f.id}')`}" 
                            title="${isInativo ? 'Reativar' : 'Desativar'}">
                        <i class="fas ${isInativo ? 'fa-check' : 'fa-ban'}"></i>
                    </button>
                    <button class="btn-acao excluir" onclick="excluirFuncionario('${f.id}')" title="Excluir permanentemente">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function desativarFuncionario(id) {
    showConfirm('Desativar funcionário', 'Tem certeza que deseja desativar este funcionário? Ele não poderá mais acessar o sistema.', () => {
        let funcionarios = getFuncionarios();
        const index = funcionarios.findIndex(f => f.id === id);
        if (index !== -1) {
            funcionarios[index].ativo = false;
            saveFuncionarios(funcionarios);
            atualizarListaFuncionarios();
            showToast('Funcionário desativado', 'warning');
        }
    });
}

function ativarFuncionario(id) {
    let funcionarios = getFuncionarios();
    const index = funcionarios.findIndex(f => f.id === id);
    if (index !== -1) {
        funcionarios[index].ativo = true;
        saveFuncionarios(funcionarios);
        atualizarListaFuncionarios();
        showToast('Funcionário reativado', 'success');
    }
}

function excluirFuncionario(id) {
    showConfirm('Excluir permanentemente', 'ATENÇÃO: Esta ação não pode ser desfeita! Deseja realmente excluir?', () => {
        let funcionarios = getFuncionarios().filter(f => f.id !== id);
        saveFuncionarios(funcionarios);
        atualizarListaFuncionarios();
        showToast('Funcionário excluído', 'success');
    });
}

function voltarLogin() {
    window.location.href = '../index.html';
}
// ============================================
// DASHBOARD GERENTE
// ============================================

function initDashboardGerente() {
    const usuarioLogado = verificarGerente();
    if (!usuarioLogado) return;
    
    const nomeEl = document.getElementById('nomeGerente');
    if (nomeEl) nomeEl.textContent = usuarioLogado.nome;
    
    carregarEstatisticas();
    carregarProntuariosGeral();
    carregarProfissionais();
    carregarTriagensPendentes();
}

function carregarEstatisticas() {
    const prontuarios = getProntuarios();
    const hoje = new Date().toDateString();
    
    const stats = {
        total: prontuarios.length,
        hoje: prontuarios.filter(p => new Date(p.data).toDateString() === hoje).length,
        porProfissao: {}
    };
    
    prontuarios.forEach(p => {
        stats.porProfissao[p.profissao] = (stats.porProfissao[p.profissao] || 0) + 1;
    });
    
    const elementos = {
        'statTotal': stats.total,
        'statHoje': stats.hoje,
        'statMedicos': stats.porProfissao['medico'] || 0,
        'statEnfermeiros': stats.porProfissao['enfermeiro'] || 0,
        'statNutricionistas': stats.porProfissao['nutricionista'] || 0,
        'statFisios': stats.porProfissao['fisioterapeuta'] || 0,
        'statDentistas': stats.porProfissao['dentista'] || 0,
        'statRecepcionistas': stats.porProfissao['recepcionista'] || 0
    };
    
    Object.entries(elementos).forEach(([id, valor]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    });
}

function carregarProntuariosGeral() {
    const tbody = document.getElementById('tabelaProntuariosGeral');
    if (!tbody) return;
    
    const prontuarios = getProntuarios().sort((a, b) => new Date(b.data) - new Date(a.data));
    
    if (prontuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #9ca3af; padding: 3rem;"><i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>Nenhum prontuário registrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = prontuarios.map(p => {
        const profissional = getProfissionalPorId(p.idProfissional);
        return `
        <tr>
            <td style="white-space: nowrap;">${formatarData(p.data)}</td>
            <td><strong>${p.paciente}</strong></td>
            <td><span class="badge badge-${p.profissao}">${formatarProfissao(p.profissao)}</span></td>
            <td>
                <i class="fas fa-user-md" style="color: #9ca3af; margin-right: 0.5rem;"></i>
                ${p.nomeProfissional}
                ${p.origemTriagem ? '<br><small style="color: #8b5cf6;"><i class="fas fa-clipboard-check"></i> Via Triagem</small>' : ''}
            </td>
            <td>
                <button class="btn-acao visualizar" onclick="visualizarProntuarioCompleto('${p.id}')" title="Visualizar prontuário completo">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

function carregarProfissionais() {
    const tbody = document.getElementById('tabelaProfissionais');
    if (!tbody) return;
    
    const funcionarios = getFuncionarios().filter(f => f.profissao !== 'admin' && f.ativo !== false);
    const prontuarios = getProntuarios();
    const triagens = getTriagens();
    
    tbody.innerHTML = funcionarios.map(f => {
        const atendimentos = prontuarios.filter(p => p.idProfissional === f.id).length;
        const triagensFeitas = f.profissao === 'recepcionista' 
            ? triagens.filter(t => t.idRecepcionista === f.id).length 
            : null;
        
        return `
        <tr>
            <td><strong>${f.nome}</strong></td>
            <td><span class="badge badge-${f.profissao}">${formatarProfissao(f.profissao)}</span></td>
            <td>${f.tipo === 'gerente' ? '<i class="fas fa-crown" style="color: #f59e0b;"></i> Gerente' : 'Profissional'}</td>
            <td style="text-align: center;">
                ${f.profissao === 'recepcionista' 
                    ? `<span title="Triagens realizadas"><i class="fas fa-clipboard-check" style="color: #8b5cf6;"></i> ${triagensFeitas}</span>` 
                    : atendimentos}
            </td>
            <td><code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${f.usuario}</code></td>
        </tr>
    `}).join('');
}

function carregarTriagensPendentes() {
    const container = document.getElementById('triagensPendentes');
    if (!container) return;
    
    const triagens = getTriagens().filter(t => !t.encaminhada).sort((a, b) => new Date(b.data) - new Date(a.data));
    
    if (triagens.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 2rem;"><i class="fas fa-check-circle" style="color: #10b981; margin-right: 0.5rem;"></i>Nenhuma triagem pendente</p>';
        return;
    }
    
    container.innerHTML = triagens.map(t => `
        <div class="paciente-triagem ${t.prioridade}">
            <div class="paciente-info-triagem">
                <h4>${t.nomePaciente}</h4>
                <p>${t.queixaPrincipal || 'Sem queixa registrada'}</p>
                <div class="paciente-tags">
                    <span class="tag-triagem ${t.prioridade}">${t.prioridade.toUpperCase()}</span>
                    <span class="tag-triagem" style="background: #e0e7ff; color: #3730a3;">${formatarProfissao(t.profissaoDestino)}</span>
                </div>
            </div>
            <div class="paciente-acoes">
                <button class="btn-acao visualizar" onclick="visualizarTriagem('${t.id}')" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filtrarPorProfissao(profissao) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const tbody = document.getElementById('tabelaProntuariosGeral');
    let prontuarios = getProntuarios();
    
    if (profissao !== 'todos') {
        prontuarios = prontuarios.filter(p => p.profissao === profissao);
    }
    
    const recentes = prontuarios.sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 50);
    
    if (recentes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #9ca3af; padding: 3rem;">Nenhum prontuário encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = recentes.map(p => `
        <tr>
            <td style="white-space: nowrap;">${formatarData(p.data)}</td>
            <td><strong>${p.paciente}</strong></td>
            <td><span class="badge badge-${p.profissao}">${formatarProfissao(p.profissao)}</span></td>
            <td><i class="fas fa-user-md" style="color: #9ca3af; margin-right: 0.5rem;"></i>${p.nomeProfissional}</td>
            <td>
                <button class="btn-acao visualizar" onclick="visualizarProntuarioCompleto('${p.id}')" title="Visualizar prontuário completo">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// VISUALIZAÇÃO E EDIÇÃO DE PRONTUÁRIOS
// ============================================

function visualizarProntuarioCompleto(id) {
    const prontuarios = getProntuarios();
    const prontuario = prontuarios.find(p => p.id === id);
    
    if (!prontuario) {
        showToast('Prontuário não encontrado!', 'error');
        return;
    }
    
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO, JSON.stringify({
        id: prontuario.id,
        modo: 'visualizar',
        dados: prontuario
    }));
    
    const urlMap = {
        'medico': '../prontuarios/medico.html?modo=visualizar&id=' + id,
        'enfermeiro': '../prontuarios/enfermeiro.html?modo=visualizar&id=' + id,
        'nutricionista': '../prontuarios/nutricionista.html?modo=visualizar&id=' + id,
        'fisioterapeuta': '../prontuarios/fisioterapeuta.html?modo=visualizar&id=' + id,
        'dentista': '../prontuarios/dentista.html?modo=visualizar&id=' + id,
        'recepcionista': '../prontuarios/recepcionista.html?modo=visualizar&id=' + id
    };
    
    const destino = urlMap[prontuario.profissao];
    if (destino) {
        window.location.href = destino;
    } else {
        showToast('Tipo de prontuário não reconhecido!', 'error');
    }
}

function editarProntuarioCompleto(id) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    if (usuarioLogado?.tipo === 'gerente') {
        showToast('Gerentes não podem editar prontuários!', 'error');
        return;
    }
    
    const prontuarios = getProntuarios();
    const prontuario = prontuarios.find(p => p.id === id);
    
    if (!prontuario) {
        showToast('Prontuário não encontrado!', 'error');
        return;
    }
    
    if (prontuario.idProfissional !== usuarioLogado?.id) {
        showToast('Você só pode editar seus próprios prontuários!', 'error');
        return;
    }
    
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO, JSON.stringify({
        id: prontuario.id,
        modo: 'editar',
        dados: prontuario
    }));
    
    const urlMap = {
        'medico': '../prontuarios/medico.html?modo=editar&id=' + id,
        'enfermeiro': '../prontuarios/enfermeiro.html?modo=editar&id=' + id,
        'nutricionista': '../prontuarios/nutricionista.html?modo=editar&id=' + id,
        'fisioterapeuta': '../prontuarios/fisioterapeuta.html?modo=editar&id=' + id,
        'dentista': '../prontuarios/dentista.html?modo=editar&id=' + id
    };
    
    const destino = urlMap[prontuario.profissao];
    if (destino) {
        window.location.href = destino;
    }
}

function carregarProntuarioNaPagina() {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get('modo');
    const id = urlParams.get('id');
    
    if (!modo || !id) return false;
    
    const prontuarioGuardado = sessionStorage.getItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO);
    if (!prontuarioGuardado) return false;
    
    const { modo: modoGuardado, dados: prontuario } = JSON.parse(prontuarioGuardado);
    
    if (prontuario.id !== id) return false;
    
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    // Preenche dados do paciente
    const nomePacienteEl = document.getElementById('nomePaciente');
    if (nomePacienteEl) nomePacienteEl.value = prontuario.paciente || '';
    
    const camposPadrao = ['dataNascimento', 'cartaoSUS', 'sexo', 'tipoAtendimento'];
    camposPadrao.forEach(campo => {
        const el = document.getElementById(campo);
        if (el && prontuario.dados[campo]) el.value = prontuario.dados[campo];
    });
    
    // Preenche todos os campos do formulário
    Object.keys(prontuario.dados).forEach(key => {
        const campos = document.querySelectorAll(`[name="${key}"]`);
        
        campos.forEach(campo => {
            const valor = prontuario.dados[key];
            
            if (campo.type === 'checkbox') {
                if (Array.isArray(valor)) {
                    campo.checked = valor.includes(campo.value);
                } else {
                    campo.checked = valor === 'on' || valor === true || valor === campo.value;
                }
            } else if (campo.tagName === 'SELECT' && campo.multiple) {
                const valores = Array.isArray(valor) ? valor : [valor];
                Array.from(campo.options).forEach(opt => {
                    opt.selected = valores.includes(opt.value);
                });
            } else if (campo.type === 'radio') {
                campo.checked = campo.value === valor;
            } else {
                campo.value = valor || '';
            }
        });
    });
    
    atualizarInterfaceModo(modo, prontuario, usuarioLogado);
    
    setTimeout(() => {
        if (typeof calcularIMC === 'function') calcularIMC();
        if (typeof calcularIMCNutri === 'function') calcularIMCNutri();
    }, 100);
    
    return true;
}

function atualizarInterfaceModo(modo, prontuario, usuarioLogado) {
    const titulo = document.querySelector('.section-title');
    const btnSalvar = document.querySelector('.btn-primary');
    const form = document.getElementById('form-prontuario');
    const content = document.querySelector('.prontuario-content');
    
    document.querySelectorAll('.visualizacao-banner, .edicao-banner').forEach(b => b.remove());
    
    if (modo === 'visualizar') {
        if (titulo) {
            titulo.innerHTML = `<i class="fas fa-eye"></i> Visualizando Prontuário - ${prontuario.paciente}`;
        }
        
        if (form) {
            form.querySelectorAll('input, textarea, select').forEach(campo => {
                campo.disabled = true;
            });
        }
        
        if (btnSalvar) btnSalvar.style.display = 'none';
        
        const acoes = document.querySelector('.form-actions');
        if (acoes) {
            acoes.innerHTML = `
                <button type="button" class="btn btn-secondary" onclick="voltarParaDashboard()">
                    <i class="fas fa-arrow-left"></i> Voltar
                </button>
                ${usuarioLogado?.tipo !== 'gerente' && prontuario.idProfissional === usuarioLogado?.id ? `
                <button type="button" class="btn btn-primary" onclick="habilitarEdicao('${prontuario.id}')">
                    <i class="fas fa-edit"></i> Editar Prontuário
                </button>
                ` : ''}
            `;
        }
        
        const banner = document.createElement('div');
        banner.className = 'visualizacao-banner';
        banner.innerHTML = `
            <i class="fas fa-eye"></i>
            <div>
                <strong>MODO VISUALIZAÇÃO</strong>
                <span>Este prontuário está em modo apenas leitura. 
                Profissional: ${prontuario.nomeProfissional} | 
                Criado em: ${formatarData(prontuario.data)}
                ${prontuario.dataModificacao ? ` | Última edição: ${formatarData(prontuario.dataModificacao)}` : ''}</span>
            </div>
        `;
        
        if (content) content.insertBefore(banner, content.firstChild);
        
    } else if (modo === 'editar') {
        if (titulo) {
            titulo.innerHTML = `<i class="fas fa-edit"></i> Editando Prontuário - ${prontuario.paciente}`;
        }
        
        if (btnSalvar) {
            btnSalvar.innerHTML = '<i class="fas fa-save"></i> Atualizar Prontuário';
            btnSalvar.onclick = function() {
                atualizarProntuarioExistente(prontuario.id);
            };
        }
        
        const acoes = document.querySelector('.form-actions');
        if (acoes && !document.getElementById('btnCancelarEdicao')) {
            const btnCancelar = document.createElement('button');
            btnCancelar.type = 'button';
            btnCancelar.className = 'btn btn-secondary';
            btnCancelar.id = 'btnCancelarEdicao';
            btnCancelar.innerHTML = '<i class="fas fa-times"></i> Cancelar Edição';
            btnCancelar.onclick = () => {
                showConfirm('Cancelar edição', 'Descartar alterações?', () => {
                    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO);
                    window.location.href = window.location.pathname.split('?')[0];
                });
            };
            acoes.insertBefore(btnCancelar, acoes.firstChild);
        }
        
        const banner = document.createElement('div');
        banner.className = 'edicao-banner';
        banner.innerHTML = `
            <i class="fas fa-edit"></i>
            <div>
                <strong>MODO EDIÇÃO</strong>
                <span>Você está editando um prontuário existente. 
                Criado em: ${formatarData(prontuario.data)}</span>
            </div>
        `;
        
        if (content) content.insertBefore(banner, content.firstChild);
    }
}

function habilitarEdicao(id) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    const prontuarios = getProntuarios();
    const prontuario = prontuarios.find(p => p.id === id);
    
    if (!prontuario || prontuario.idProfissional !== usuarioLogado?.id) {
        showToast('Você não tem permissão para editar este prontuário!', 'error');
        return;
    }
    
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO, JSON.stringify({
        id: prontuario.id,
        modo: 'editar',
        dados: prontuario
    }));
    
    window.location.href = window.location.pathname + '?modo=editar&id=' + id;
}

function voltarParaDashboard() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO);
    
    if (usuarioLogado?.tipo === 'gerente') {
        window.location.href = '../admin/dashboard.html';
    } else {
        window.location.href = window.location.pathname.split('?')[0];
    }
}

function atualizarProntuarioExistente(id) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    if (usuarioLogado?.tipo === 'gerente') {
        showToast('Gerentes não podem editar prontuários!', 'error');
        return;
    }
    
    const prontuarios = getProntuarios();
    const index = prontuarios.findIndex(p => p.id === id);
    
    if (index === -1) {
        showToast('Erro: Prontuário não encontrado!', 'error');
        return;
    }
    
    if (prontuarios[index].idProfissional !== usuarioLogado?.id) {
        showToast('Você só pode editar seus próprios prontuários!', 'error');
        return;
    }
    
    const form = document.getElementById('form-prontuario');
    const formData = new FormData(form);
    const dados = {};
    
    formData.forEach((value, key) => {
        if (dados[key]) {
            if (!Array.isArray(dados[key])) {
                dados[key] = [dados[key]];
            }
            dados[key].push(value);
        } else {
            dados[key] = value;
        }
    });
    
    prontuarios[index] = {
        ...prontuarios[index],
        paciente: document.getElementById('nomePaciente')?.value || 'Não informado',
        dados: dados,
        dataModificacao: new Date().toISOString()
    };
    
    saveProntuarios(prontuarios);
    
    showToast('Prontuário atualizado com sucesso!', 'success');
    
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO);
    setTimeout(() => {
        window.location.href = window.location.pathname + '?modo=visualizar&id=' + id;
    }, 1000);
}

// ============================================
// OPERAÇÕES BÁSICAS DE PRONTUÁRIOS
// ============================================

function salvarProntuario() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    if (usuarioLogado?.tipo === 'gerente') {
        showToast('Gerentes não podem criar prontuários!', 'error');
        return;
    }
    
    const prontuarioEditando = sessionStorage.getItem(CONFIG.STORAGE_KEYS.PRONTUARIO_VISUALIZANDO);
    
    if (prontuarioEditando) {
        const { id } = JSON.parse(prontuarioEditando);
        atualizarProntuarioExistente(id);
        return;
    }
    
    const form = document.getElementById('form-prontuario');
    const formData = new FormData(form);
    const dados = {};
    
    formData.forEach((value, key) => {
        if (dados[key]) {
            if (!Array.isArray(dados[key])) {
                dados[key] = [dados[key]];
            }
            dados[key].push(value);
        } else {
            dados[key] = value;
        }
    });
    
    const novoProntuario = {
        id: gerarId(),
        data: new Date().toISOString(),
        idProfissional: usuarioLogado.id,
        nomeProfissional: usuarioLogado.nome,
        profissao: usuarioLogado.profissao,
        paciente: document.getElementById('nomePaciente')?.value || 'Não informado',
        dados: dados
    };
    
    const triagemId = sessionStorage.getItem('triagemAtual');
    if (triagemId) {
        novoProntuario.origemTriagem = triagemId;
        let triagens = getTriagens();
        const triIndex = triagens.findIndex(t => t.id === triagemId);
        if (triIndex !== -1) {
            triagens[triIndex].encaminhada = true;
            triagens[triIndex].dataAtendimento = new Date().toISOString();
            saveTriagens(triagens);
        }
        sessionStorage.removeItem('triagemAtual');
    }
    
    const prontuarios = getProntuarios();
    prontuarios.push(novoProntuario);
    saveProntuarios(prontuarios);
    
    showToast('Prontuário salvo com sucesso!', 'success');
    
    form.reset();
    atualizarHistorico();
}

function limparFormulario() {
    showConfirm('Limpar formulário', 'Deseja realmente limpar todos os campos?', () => {
        document.getElementById('form-prontuario')?.reset();
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.PRONTUARIO_EDITANDO);
        sessionStorage.removeItem('triagemAtual');
        
        const btnSalvar = document.querySelector('.btn-primary');
        if (btnSalvar) {
            btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar Prontuário';
            btnSalvar.onclick = salvarProntuario;
        }
        
        showToast('Formulário limpo', 'info');
    });
}

function mudarAba(abaId) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    
    const conteudo = document.getElementById(abaId);
    if (conteudo) {
        conteudo.classList.add('active');
    }
}

// ============================================
// HISTÓRICO DE ATENDIMENTOS
// ============================================

function atualizarHistorico() {
    const tbody = document.getElementById('lista-atendimentos');
    if (!tbody) return;
    
    const prontuarios = getProntuarios();
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    if (!usuarioLogado) return;
    
    const meusProntuarios = prontuarios
        .filter(p => p.idProfissional === usuarioLogado.id)
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 20);
    
    if (meusProntuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #9ca3af; padding: 3rem;"><i class="fas fa-folder-open" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>Nenhum atendimento registrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = meusProntuarios.map(p => `
        <tr>
            <td style="white-space: nowrap;">${formatarData(p.data)}</td>
            <td><strong>${p.paciente}</strong></td>
            <td>
                ${p.origemTriagem ? '<span class="status-badge status-triagem"><i class="fas fa-clipboard-check"></i> Triagem</span>' : 
                  p.dataModificacao ? '<span class="status-badge status-editado"><i class="fas fa-edit"></i> Editado</span>' : 
                  '<span class="status-badge status-novo"><i class="fas fa-plus"></i> Novo</span>'}
            </td>
            <td style="text-align: center;">
                <button class="btn-acao editar" onclick="editarProntuarioCompleto('${p.id}')" title="Editar prontuário">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-acao visualizar" onclick="visualizarProntuarioCompleto('${p.id}')" title="Visualizar prontuário">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// RECEPCIONISTA / TRIAGEM
// ============================================

function initTriagem() {
    const usuarioLogado = verificarAutenticacao('recepcionista');
    if (!usuarioLogado) return;
    
    const nomeEl = document.getElementById('nomeProfissionalLogado');
    if (nomeEl) nomeEl.textContent = usuarioLogado.nome;
    
    carregarFilaTriagem();
    carregarProfissionaisDisponiveis();
}

function carregarProfissionaisDisponiveis() {
    const select = document.getElementById('profissionalDestino');
    if (!select) return;
    
    const funcionarios = getFuncionarios().filter(f => 
        f.ativo !== false && 
        f.profissao !== 'admin' && 
        f.profissao !== 'gerente' &&
        f.profissao !== 'recepcionista'
    );
    
    select.innerHTML = '<option value="">Selecione o profissional...</option>' +
        funcionarios.map(f => `
            <option value="${f.profissao}" data-id="${f.id}">
                ${formatarProfissao(f.profissao)} - ${f.nome}
            </option>
        `).join('');
}

function salvarTriagem(event) {
    event.preventDefault();
    
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    
    const nomePaciente = document.getElementById('nomePacienteTriagem')?.value.trim();
    const cpf = document.getElementById('cpfTriagem')?.value.trim();
    const queixaPrincipal = document.getElementById('queixaPrincipal')?.value.trim();
    const profissaoDestino = document.getElementById('profissionalDestino')?.value;
    const prioridade = document.getElementById('prioridadeTriagem')?.value || 'normal';
    
    if (!nomePaciente || !queixaPrincipal || !profissaoDestino) {
        showToast('Preencha todos os campos obrigatórios!', 'error');
        return false;
    }
    
    if (cpf && !validarCPF(cpf)) {
        showToast('CPF inválido!', 'error');
        return false;
    }
    
    const novaTriagem = {
        id: gerarId(),
        data: new Date().toISOString(),
        idRecepcionista: usuarioLogado.id,
        nomeRecepcionista: usuarioLogado.nome,
        nomePaciente,
        cpf: cpf ? formatarCPF(cpf) : '',
        queixaPrincipal,
        profissaoDestino,
        prioridade,
        encaminhada: false,
        dadosAdicionais: coletarDadosTriagem()
    };
    
    const triagens = getTriagens();
    triagens.push(novaTriagem);
    saveTriagens(triagens);
    
    showToast('Triagem registrada com sucesso!', 'success');
    document.getElementById('formTriagem')?.reset();
    carregarFilaTriagem();
    
    return false;
}

function coletarDadosTriagem() {
    const dados = {};
    const campos = document.querySelectorAll('#formTriagem [name]');
    campos.forEach(campo => {
        if (campo.type === 'checkbox') {
            if (campo.checked) {
                if (!dados[campo.name]) dados[campo.name] = [];
                dados[campo.name].push(campo.value);
            }
        } else if (campo.value) {
            dados[campo.name] = campo.value;
        }
    });
    return dados;
}

function carregarFilaTriagem() {
    const container = document.getElementById('filaTriagem');
    if (!container) return;
    
    const triagens = getTriagens()
        .filter(t => !t.encaminhada)
        .sort((a, b) => {
            const prioridades = { urgente: 0, prioritario: 1, normal: 2 };
            if (prioridades[a.prioridade] !== prioridades[b.prioridade]) {
                return prioridades[a.prioridade] - prioridades[b.prioridade];
            }
            return new Date(a.data) - new Date(b.data);
        });
    
    if (triagens.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #9ca3af;">
                <i class="fas fa-clipboard-check" style="font-size: 3rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                <p>Nenhum paciente na fila de triagem</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = triagens.map(t => `
        <div class="paciente-triagem ${t.prioridade}">
            <div class="paciente-info-triagem">
                <h4>${t.nomePaciente}</h4>
                <p><i class="fas fa-stethoscope" style="color: #8b5cf6; margin-right: 0.5rem;"></i>${t.queixaPrincipal}</p>
                <div class="paciente-tags">
                    <span class="tag-triagem ${t.prioridade}">${t.prioridade.toUpperCase()}</span>
                    <span class="tag-triagem" style="background: #e0e7ff; color: #3730a3;">
                        <i class="fas fa-user-md"></i> ${formatarProfissao(t.profissaoDestino)}
                    </span>
                    <span class="tag-triagem" style="background: #f3f4f6; color: #6b7280;">
                        <i class="fas fa-clock"></i> ${formatarData(t.data)}
                    </span>
                </div>
            </div>
            <div class="paciente-acoes">
                <button class="btn-acao visualizar" onclick="visualizarTriagem('${t.id}')" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-acao excluir" onclick="cancelarTriagem('${t.id}')" title="Cancelar triagem">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function visualizarTriagem(id) {
    const triagens = getTriagens();
    const triagem = triagens.find(t => t.id === id);
    
    if (!triagem) {
        showToast('Triagem não encontrada!', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
        ">
            <div style="
                background: white;
                border-radius: 1rem;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            ">
                <div style="padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
                    <h3 style="margin: 0; color: #1f2937; display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-clipboard-list" style="color: #8b5cf6;"></i>
                        Detalhes da Triagem
                    </h3>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Paciente</label>
                        <p style="margin: 0.25rem 0 0; font-size: 1.125rem; font-weight: 600; color: #1f2937;">${triagem.nomePaciente}</p>
                        ${triagem.cpf ? `<p style="margin: 0.25rem 0 0; color: #6b7280; font-size: 0.875rem;">CPF: ${triagem.cpf}</p>` : ''}
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Prioridade</label>
                            <span class="tag-triagem ${triagem.prioridade}" style="display: inline-block; margin-top: 0.25rem;">
                                ${triagem.prioridade.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <label style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Destino</label>
                            <p style="margin: 0.25rem 0 0; color: #1f2937; font-weight: 500;">
                                <i class="fas fa-user-md" style="color: #8b5cf6; margin-right: 0.5rem;"></i>
                                ${formatarProfissao(triagem.profissaoDestino)}
                            </p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Queixa Principal</label>
                        <p style="margin: 0.25rem 0 0; color: #1f2937; line-height: 1.5;">${triagem.queixaPrincipal}</p>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">Recepcionista</label>
                        <p style="margin: 0.25rem 0 0; color: #6b7280; font-size: 0.875rem;">
                            ${triagem.nomeRecepcionista} em ${formatarData(triagem.data)}
                        </p>
                    </div>
                    
                    ${Object.keys(triagem.dadosAdicionais).length > 0 ? `
                    <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <label style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">Informações Adicionais</label>
                        ${Object.entries(triagem.dadosAdicionais).map(([key, val]) => `
                            <p style="margin: 0.25rem 0; font-size: 0.875rem;">
                                <strong>${key}:</strong> ${Array.isArray(val) ? val.join(', ') : val}
                            </p>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                <div style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.75rem;">
                    <button onclick="this.closest('.modal-triagem').remove()" style="
                        padding: 0.625rem 1.25rem;
                        border: 1px solid #e5e7eb;
                        background: white;
                        border-radius: 0.5rem;
                        color: #6b7280;
                        font-weight: 500;
                        cursor: pointer;
                    ">Fechar</button>
                </div>
            </div>
        </div>
    `;
    
    modal.className = 'modal-triagem';
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal.firstElementChild) {
            modal.remove();
        }
    });
}

function cancelarTriagem(id) {
    showConfirm('Cancelar triagem', 'Tem certeza que deseja cancelar esta triagem?', () => {
        let triagens = getTriagens().filter(t => t.id !== id);
        saveTriagens(triagens);
        carregarFilaTriagem();
        showToast('Triagem cancelada', 'success');
    });
}

// ============================================
// PROFISSIONAIS - VER TRIAGENS PENDENTES
// ============================================

function carregarTriagensParaProfissional() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    if (!usuarioLogado) return;
    
    const container = document.getElementById('triagensPendentesProfissional');
    if (!container) return;
    
    const triagens = getTriagens()
        .filter(t => !t.encaminhada && t.profissaoDestino === usuarioLogado.profissao)
        .sort((a, b) => {
            const prioridades = { urgente: 0, prioritario: 1, normal: 2 };
            return prioridades[a.prioridade] - prioridades[b.prioridade];
        });
    
    if (triagens.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    container.innerHTML = `
        <div class="triagem-banner" style="margin-bottom: 1.5rem;">
            <i class="fas fa-clipboard-check"></i>
            <div>
                <strong>PACIENTES AGUARDANDO ATENDIMENTO</strong>
                <span>Existem ${triagens.length} paciente(s) da triagem aguardando atendimento</span>
            </div>
        </div>
        <div class="fila-triagem" style="margin-bottom: 1.5rem;">
            ${triagens.map(t => `
                <div class="paciente-triagem ${t.prioridade}" style="cursor: pointer;" onclick="iniciarAtendimentoTriagem('${t.id}')">
                    <div class="paciente-info-triagem">
                        <h4>${t.nomePaciente}</h4>
                        <p>${t.queixaPrincipal}</p>
                        <div class="paciente-tags">
                            <span class="tag-triagem ${t.prioridade}">${t.prioridade.toUpperCase()}</span>
                            <span class="tag-triagem" style="background: #f3f4f6; color: #6b7280;">
                                <i class="fas fa-clock"></i> ${formatarData(t.data)}
                            </span>
                        </div>
                    </div>
                    <div class="paciente-acoes">
                        <button class="btn-acao enviar" title="Iniciar atendimento">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function iniciarAtendimentoTriagem(triagemId) {
    const triagens = getTriagens();
    const triagem = triagens.find(t => t.id === triagemId);
    
    if (!triagem) {
        showToast('Triagem não encontrada!', 'error');
        return;
    }
    
    // Preenche dados do paciente no formulário
    const nomePacienteEl = document.getElementById('nomePaciente');
    if (nomePacienteEl) nomePacienteEl.value = triagem.nomePaciente;
    
    const cpfEl = document.getElementById('cartaoSUS') || document.getElementById('cpf');
    if (cpfEl && triagem.cpf) cpfEl.value = triagem.cpf;
    
    // Salva ID da triagem na sessão para marcar como atendida ao salvar prontuário
    sessionStorage.setItem('triagemAtual', triagemId);
    
    // Adiciona banner indicando que veio da triagem
    const content = document.querySelector('.prontuario-content');
    if (content && !document.querySelector('.triagem-banner')) {
        const banner = document.createElement('div');
        banner.className = 'triagem-banner';
        banner.innerHTML = `
            <i class="fas fa-clipboard-check"></i>
            <div>
                <strong>ATENDIMENTO VIA TRIAGEM</strong>
                <span>Paciente: ${triagem.nomePaciente} | Queixa: ${triagem.queixaPrincipal} | Recepcionista: ${triagem.nomeRecepcionista}</span>
            </div>
        `;
        content.insertBefore(banner, content.firstChild);
    }
    
    showToast('Dados da triagem carregados. Complete o atendimento.', 'info');
    
    // Remove da lista visual
    carregarTriagensParaProfissional();
}

// ============================================
// INICIALIZAÇÃO GERAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    // Inicializa sistema se necessário
    if (!path.includes('cadastro.html') || path.includes('admin')) {
        inicializarSistema();
    }
    
    // Configura máscaras e eventos
    setupMascaras();
    
    // Roteamento por página
    if (path.includes('cadastro.html')) {
        atualizarListaFuncionarios();
    } else if (path.includes('dashboard.html')) {
        initDashboardGerente();
    } else if (path.includes('recepcionista.html')) {
        initTriagem();
    } else if (path.includes('prontuarios/')) {
        const profissoes = {
            'medico.html': 'medico',
            'enfermeiro.html': 'enfermeiro',
            'nutricionista.html': 'nutricionista',
            'fisioterapeuta.html': 'fisioterapeuta',
            'dentista.html': 'dentista'
        };
        
        const profissao = profissoes[path.split('/').pop()];
        if (profissao) {
            const usuario = verificarAutenticacao(profissao);
            if (usuario) {
                initProntuario();
                carregarTriagensParaProfissional();
            }
        }
    }
});

function setupMascaras() {
    // Máscara CPF
    const cpfInputs = document.querySelectorAll('input[data-mask="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });
    
    // Máscara telefone
    const telInputs = document.querySelectorAll('input[data-mask="telefone"]');
    telInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
            }
            
            e.target.value = value;
        });
    });
}

function initProntuario() {
    // Atualiza nome da cidade
    document.querySelectorAll('.cidade-nome').forEach(el => {
        el.textContent = localStorage.getItem(CONFIG.STORAGE_KEYS.CIDADE) || 'Nossa Senhora De Lourdes';
    });
    
    // Atualiza nome do profissional
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSAO));
    if (usuarioLogado) {
        const nomeElement = document.getElementById('nomeProfissionalLogado');
        if (nomeElement) {
            nomeElement.textContent = usuarioLogado.nome;
        }
    }
    
    // Verifica se está em modo visualização/edição
    const carregou = carregarProntuarioNaPagina();
    
    // Se não carregou modo especial, carrega histórico normal
    if (!carregou) {
        atualizarHistorico();
    }
    
    // Confirmação ao sair com alterações
    setupConfirmacaoSaida();
}

function setupConfirmacaoSaida() {
    let formAlterado = false;
    const form = document.getElementById('form-prontuario');
    
    if (form) {
        form.addEventListener('input', () => {
            formAlterado = true;
        });
        
        window.addEventListener('beforeunload', (e) => {
            if (formAlterado && !window.location.href.includes('modo=')) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }
}

// Inicializa imediatamente se já estiver carregado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    inicializarSistema();
}