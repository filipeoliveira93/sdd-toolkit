const { renderDashboard } = require('../lib/dashboard');
const { spinner } = require('@clack/prompts');
const pc = require('picocolors');

async function view() {
    const s = spinner();
    s.start('Carregando Dashboard...');
    
    try {
        await renderDashboard();
        s.stop('Dashboard atualizado.');
    } catch (e) {
        s.stop(pc.red('Erro ao carregar dashboard.'));
        console.error(e);
    }
}

module.exports = { view };
