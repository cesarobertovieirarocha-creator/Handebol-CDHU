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
    model.passos.forEach((step, i) => {
      const drawings = step.s.map(toDrawing).filter(Boolean);
      frames.push(snap(drawings, (i + 1) + '. ' + step.t));
      if (step.p) Object.keys(step.p).forEach(k => { pos[resolveId(k)] = step.p[k].slice(); });
      if (step.b) holder = resolveId(step.b);
    });
    frames.push(snap([], 'Final da jogada'));
    return frames;
  }

  /* ── UI ── */
  const Playbook = {
    build: build,
    selected: null,
    filters: { g: '', c: '', t: '', s: '', q: '', fav: false },

    all: function () {
      const db = window.PLAYS_DB;
      if (!db) return [];
      return db.jogadas.concat(readLS(CUSTOM_KEY, []));
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
      bind('#pbG', 'g'); bind('#pbC', 'c'); bind('#pbT', 't'); bind('#pbS', 's');
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
      items.slice(0, 120).forEach(p => {
        const b = document.createElement('button');
        b.className = 'pb-item' + (this.selected && this.selected.id === p.id ? ' active' : '');
        b.innerHTML = `<span class="pb-flag">${esc(p.flag || '🏐')}</span>
          <span class="pb-main"><strong>${esc(p.nome)}</strong>
          <small>${esc(p.equipeNome || p.equipe)} · ${esc(p.categoria)} · ${esc(GEN[p.genero] || '')}</small></span>
          <span class="pb-badge pb-${esc(p.conf)}" title="${esc(window.PLAYS_DB.meta.niveis[p.conf] || '')}"></span>
          ${favs.indexOf(p.id) > -1 ? '<i class="fas fa-star pb-star"></i>' : ''}`;
        b.addEventListener('click', () => this.select(p));
        list.appendChild(b);
      });
      if (items.length > 120) {
        const m = document.createElement('div');
        m.className = 'pb-count';
        m.textContent = 'Mostrando 120 — refine os filtros.';
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
        ${p.contexto ? `<div class="pb-ctx"><i class="fas fa-check-circle"></i> ${esc(p.contexto)}</div>` : ''}
        ${p.estilo ? `<p><b>Identidade (tendência):</b> ${esc(p.estilo)}</p>` : ''}
        <p><b>Objetivo:</b> ${esc(p.objetivo)}</p>
        <b>Variações</b>${li(p.variacoes)}
        <b>Contra-medidas</b>${li(p.contra)}
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
