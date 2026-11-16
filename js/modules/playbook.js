/**
 * =========================================================================
 * ADESP / CDHU 3.0 — MÓDULO PLAYBOOK
 * Arquivo: js/modules/playbook.js
 * Descrição: filtros por gênero/categoria/equipe/situação, detalhe da jogada,
 *            carregamento na quadra (quadros animáveis), favoritos e
 *            importação/exportação em JSON. Depende de data/plays.js.
 * =========================================================================
 */
(function (window) {
  'use strict';

  const FAV_KEY = 'cdhu_playbook_fav';
  const CUSTOM_KEY = 'cdhu_playbook_custom';
  const SIT = {
    ataque_posicionado: 'Ataque posicionado',
    superioridade_7x6: '7×6',
    contra_ataque: 'Contra-ataque',
    bola_parada: 'Bola parada',
    defesa: 'Defesa',
  };
  const GEN = { M: 'Masculino', F: 'Feminino' };

  const esc = s =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const resolveId = k => (String(k).indexOf('_') > -1 ? k : 'a_' + k);
  const TOOL_COLOR = { move: '#ffffff', pass: '#F4C542', dribble: '#7dd3fc', shot: '#ef4444', block: '#ffffff' };

  function readLS(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage indisponível */ }
  }

  /* ── Constrói os quadros a partir do modelo ── */
  function build(model, basePlayers, opts) {
    opts = opts || {};
    const F33 = window.PLAYS_DB.F33;
    const pos = {};
    basePlayers.forEach(p => { pos[p.id] = [p.x, p.y]; });
    Object.keys(F33).forEach(k => {
      pos['a_' + k] = (model.ini && model.ini[k]) ? model.ini[k].slice() : F33[k].slice();
    });
    if (model.defPos) Object.keys(model.defPos).forEach(id => { pos[id] = model.defPos[id].slice(); });

    let holder = resolveId(model.bola || 'ac');
    let uid = Date.now();

    const snap = (drawings, label) => {
      const hp = pos[holder] || [28, 10];
      return {
        players: basePlayers.map(p => Object.assign({}, p, { x: pos[p.id][0], y: pos[p.id][1] })),
        drawings: drawings,
        ball: { x: hp[0], y: hp[1], visible: true, heldBy: holder },
        label: label,
      };
    };

    const toDrawing = spec => {
      const tool = spec[0];
      const fromId = resolveId(spec[1]);
      const to = spec[2];
      const start = pos[fromId];
      const end = Array.isArray(to) ? to : pos[resolveId(to)];
      if (!start || !end) return null;
      const isB = fromId.indexOf('b_') === 0;
      const pts = tool === 'block' ? [{ x: end[0], y: end[1] }, { x: end[0], y: end[1] }]
                                   : [{ x: start[0], y: start[1] }, { x: end[0], y: end[1] }];
      return {
        id: ++uid, tool: tool, points: pts,
        color: isB ? '#ef4444' : (TOOL_COLOR[tool] || '#ffffff'),
        teamId: isB ? 'B' : 'A',
        teamLabel: isB ? (opts.nameB || 'ADV') : (opts.nameA || 'ADESP'),
        lineWidth: 2,
      };
    };

    const frames = [];
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    model.passos.forEach((step, i) => {
      // setas da defesa: só para deslocamentos relevantes (>= 0,8 m), evitando poluir a quadra
      const defArrows = Object.keys(step.d || {})
        .filter(id => pos[id] && Math.hypot(step.d[id][0] - pos[id][0], step.d[id][1] - pos[id][1]) >= 0.8)
        .map(id => ['move', id, step.d[id]]);
      const drawings = step.s.concat(defArrows).map(toDrawing).filter(Boolean);
      const label = (i + 1) + '. ' + step.t + (step.dt ? ' | Defesa: ' + step.dt : '');
      frames.push(snap(drawings, label));

      if (step.p) Object.keys(step.p).forEach(k => { pos[resolveId(k)] = step.p[k].slice(); });
      if (step.b) holder = resolveId(step.b);
      if (step.d) Object.keys(step.d).forEach(k => { pos[k] = step.d[k].slice(); });

      // goleiro adversário: acompanha a bola e vai ao canto do arremesso
      if (!(step.d && step.d.b_gk) && pos.b_gk) {
        const shot = step.s.find(a => a[0] === 'shot');
        const hp = pos[holder] || [30, 10];
        const gy = shot ? clamp(shot[2][1], 8.9, 11.1) : clamp(10 + (hp[1] - 10) * 0.2, 8.9, 11.1);
        pos.b_gk = [shot ? 39 : 38, gy];
      }
    });
    frames.push(snap([], 'Final da jogada'));
    return frames;
  }

  /* ── UI ── */
  const Playbook = {
    build: build,
    selected: null,
    filters: { g: '', c: '', t: '', s: '', i: '', q: '', fav: false },

    all: function () {
      const db = window.PLAYS_DB;
      if (!db) return [];
      // Sugestões de IA aparecem primeiro (Claude → ChatGPT → Gemini), depois o restante
      const ordem = { Claude: 0, ChatGPT: 1, Gemini: 2 };
      const ia = db.jogadas.filter(p => p.ia).sort((a, b) => (ordem[a.ia] - ordem[b.ia]));
      const resto = db.jogadas.filter(p => !p.ia);
      return ia.concat(resto, readLS(CUSTOM_KEY, []));
    },
    favs: function () { return readLS(FAV_KEY, []); },

    init: function () {
      const pane = document.getElementById('pane-playbook');
      if (!pane || !window.PLAYS_DB) return;
      const db = window.PLAYS_DB;
      const opt = (v, l) => `<option value="${esc(v)}">${esc(l)}</option>`;
      const teamOpts = Object.keys(db.equipes).map(k => opt(k, db.equipes[k].flag + ' ' + db.equipes[k].nome)).join('');
      pane.innerHTML = `
        <div class="sys-title"><i class="fas fa-book-open"></i> Playbook de Seleções</div>
        <div class="pb-note"><i class="fas fa-info-circle"></i> Geometria didática. Equipe→jogada é tendência/hipótese a validar em vídeo.</div>
        <div class="pb-filters">
          <select id="pbG"><option value="">Gênero: todos</option>${opt('M', 'Masculino')}${opt('F', 'Feminino')}</select>
          <select id="pbC"><option value="">Categoria: todas</option>${db.categorias.map(c => opt(c.id, c.nome)).join('')}</select>
          <select id="pbT"><option value="">Equipe: todas</option>${teamOpts}</select>
          <select id="pbS"><option value="">Situação: todas</option>${Object.keys(SIT).map(k => opt(k, SIT[k])).join('')}</select>
          <select id="pbI" class="pb-ia-select"><option value="">Origem: todas</option>${opt('Claude', '✨ Sugestão Claude')}${opt('ChatGPT', '💬 Sugestão ChatGPT')}${opt('Gemini', '♊ Sugestão Gemini')}${opt('base', '📚 Base (modelos)')}</select>
          <input id="pbQ" type="search" placeholder="Buscar jogada ou tag…">
          <label class="pb-fav-only"><input type="checkbox" id="pbF"> Só favoritas</label>
        </div>
        <div id="pbCount" class="pb-count"></div>
        <div id="pbList" class="pb-list"></div>
        <div id="pbDetail" class="pb-detail" hidden></div>
        <div class="pb-io">
          <button class="sys-btn" id="pbExport"><i class="fas fa-file-export"></i> Exportar JSON</button>
          <label class="sys-btn pb-import"><i class="fas fa-file-import"></i> Importar JSON
            <input type="file" id="pbImport" accept="application/json" hidden></label>
        </div>`;
      const bind = (id, key, ev) => pane.querySelector(id).addEventListener(ev || 'change', e => {
        this.filters[key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.renderList();
      });
      bind('#pbG', 'g'); bind('#pbC', 'c'); bind('#pbT', 't'); bind('#pbS', 's'); bind('#pbI', 'i');
      bind('#pbQ', 'q', 'input'); bind('#pbF', 'fav');
      pane.querySelector('#pbExport').addEventListener('click', () => this.exportJSON());
      pane.querySelector('#pbImport').addEventListener('change', e => this.importJSON(e.target.files[0]));
      this.renderList();
    },

    filtered: function () {
      const f = this.filters, favs = this.favs();
      const q = f.q.trim().toLowerCase();
      return this.all().filter(p =>
        (!f.g || p.genero === f.g) && (!f.c || p.categoria === f.c) &&
        (!f.t || p.equipe === f.t) && (!f.s || p.situacao === f.s) &&
        (!f.i || (f.i === 'base' ? !p.ia : p.ia === f.i)) &&
        (!f.fav || favs.indexOf(p.id) > -1) &&
        (!q || (p.nome + ' ' + (p.tags || []).join(' ') + ' ' + (p.equipeNome || '')).toLowerCase().indexOf(q) > -1));
    },

    renderList: function () {
      const list = document.getElementById('pbList');
      if (!list) return;
      const items = this.filtered();
      const favs = this.favs();
      document.getElementById('pbCount').textContent = items.length + ' jogada(s)';
      list.innerHTML = '';
      items.slice(0, 160).forEach(p => {
        const b = document.createElement('button');
        b.className = 'pb-item' + (this.selected && this.selected.id === p.id ? ' active' : '');
        b.innerHTML = `<span class="pb-flag">${esc(p.flag || '🏐')}</span>
          <span class="pb-main"><strong>${esc(p.nome)}</strong>
          <small>${esc(p.equipeNome || p.equipe)} · ${esc(p.categoria)} · ${esc(GEN[p.genero] || '')}${p.complexidade ? ' · ' + esc(p.complexidade) + '/10' : ''}</small></span>
          ${p.ia ? `<span class="pb-ia-chip pb-ia-${esc(p.ia)}">${esc(p.ia)}</span>` : ''}
          <span class="pb-badge pb-${esc(p.conf)}" title="${esc(window.PLAYS_DB.meta.niveis[p.conf] || '')}"></span>
          ${favs.indexOf(p.id) > -1 ? '<i class="fas fa-star pb-star"></i>' : ''}`;
        b.addEventListener('click', () => this.select(p));
        list.appendChild(b);
      });
      if (items.length > 160) {
        const m = document.createElement('div');
        m.className = 'pb-count';
        m.textContent = 'Mostrando 160 — refine os filtros.';
        list.appendChild(m);
      }
    },

    select: function (p) {
      this.selected = p;
      this.renderList();
      const box = document.getElementById('pbDetail');
      const db = window.PLAYS_DB;
      const li = a => (a && a.length ? '<ul>' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p>—</p>');
      const isFav = this.favs().indexOf(p.id) > -1;
      const src = p.fonte ? `<a href="${esc(p.fonte)}" target="_blank" rel="noopener noreferrer">fonte</a>` : 'sem fonte (a validar)';
      box.hidden = false;
      box.innerHTML = `
        <div class="pb-d-head"><strong>${esc(p.flag || '')} ${esc(p.nome)}</strong>
          <span class="pb-badge-txt pb-${esc(p.conf)}">${esc(db.meta.niveis[p.conf] || p.conf)}</span></div>
        <div class="pb-d-meta">${esc(p.equipeNome || '')} · ${esc(p.categoria)} · ${esc(GEN[p.genero] || '')} · ${esc(SIT[p.situacao] || p.situacao)} · ataque ${esc(p.atk)} × defesa ${esc(p.def)}</div>
        ${p.ia ? `<div class="pb-ia-box pb-ia-${esc(p.ia)}"><i class="fas fa-wand-magic-sparkles"></i> <b>Sugestão da IA (${esc(p.ia)})</b>${p.complexidade ? ' · complexidade ' + esc(p.complexidade) + '/10' : ''}<br><small>${esc((db.meta.iaFontes || {})[p.ia] || 'Sugestão de IA — a validar.')}</small></div>` : ''}
        ${p.referencia ? `<p class="pb-ref"><b>Referência citada pela IA (não verificada):</b> ${esc(p.referencia)}</p>` : ''}
        ${p.obsEquipe ? `<p class="pb-ref">${esc(p.obsEquipe)}</p>` : ''}
        ${p.contexto ? `<div class="pb-ctx"><i class="fas fa-check-circle"></i> ${esc(p.contexto)}</div>` : ''}
        ${p.estilo && !p.ia ? `<p><b>Identidade (tendência):</b> ${esc(p.estilo)}</p>` : ''}
        <p><b>Objetivo:</b> ${esc(p.objetivo)}</p>
        <b>Variações</b>${li(p.variacoes)}
        <b>Contra-medidas</b>${li(p.contra)}
        ${p.leituras ? '<b>Leituras (se → então)</b>' + li(p.leituras) : ''}
        <div class="pb-d-meta">Fonte: ${src}</div>
        <div class="pb-d-actions">
          <button class="sys-btn pb-load"><i class="fas fa-play"></i> Carregar na quadra</button>
          <button class="sys-btn pb-favbtn"><i class="fas fa-star"></i> ${isFav ? 'Remover favorita' : 'Favoritar'}</button>
        </div>`;
      box.querySelector('.pb-load').addEventListener('click', () => this.load(p));
      box.querySelector('.pb-favbtn').addEventListener('click', () => this.toggleFav(p));
    },

    load: function (p) {
      const model = window.PLAYS_DB.modelos[p.modelo];
      if (!model || typeof window.loadPlayFromBook !== 'function') return;
      window.loadPlayFromBook(p, model);
      if (typeof window.showPlayToast === 'function') {
        window.showPlayToast('Jogada "' + p.nome + '" carregada: use ← → ou Play.', 'goal', '📋', 3000);
      }
    },

    toggleFav: function (p) {
      const favs = this.favs();
      const i = favs.indexOf(p.id);
      if (i > -1) favs.splice(i, 1); else favs.push(p.id);
      writeLS(FAV_KEY, favs);
      this.select(p);
    },

    exportJSON: function () {
      const payload = { meta: window.PLAYS_DB.meta, favoritas: this.favs(), personalizadas: readLS(CUSTOM_KEY, []), jogadas: window.PLAYS_DB.jogadas };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'playbook-cdhu.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },

    importJSON: function (file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          const valid = (Array.isArray(data.personalizadas) ? data.personalizadas : [])
            .filter(p => p && typeof p.id === 'string' && typeof p.nome === 'string' && window.PLAYS_DB.modelos[p.modelo])
            .map(p => Object.assign({}, p, { conf: p.conf || 'hipotese' }));
          if (Array.isArray(data.favoritas)) writeLS(FAV_KEY, data.favoritas.filter(x => typeof x === 'string'));
          if (valid.length) writeLS(CUSTOM_KEY, valid);
          this.renderList();
          if (typeof window.showPlayToast === 'function') {
            window.showPlayToast('Importação concluída: ' + valid.length + ' jogada(s) personalizada(s).', 'goal', '📥', 3000);
          }
        } catch (e) {
          alert('Arquivo JSON inválido.');
        }
      };
      reader.readAsText(file);
    },
  };

  window.Playbook = Playbook;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Playbook.init());
  else Playbook.init();
})(window);
