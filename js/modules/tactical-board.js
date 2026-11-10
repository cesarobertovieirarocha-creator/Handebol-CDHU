/**
 * =========================================================================
 * ADESP / CDHU 3.0 — MÓDULO DE PRANCHETA TÁTICA (TACTICAL BOARD ENGINE)
 * Arquivo: js/modules/tactical-board.js
 * Descrição: Gestão de abas, log de eventos sequencial, detecção de zonas de
 *            handebol, alertas de regras em tempo real (IHF), highlight interativo,
 *            persistência via CDHU_STORAGE e exportação de playbook.
 * =========================================================================
 */

(function (window) {
  'use strict';

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const TacticalBoard = {
    activeTab: 'sistemas',
    activeStepIndex: null,
    events: [],
    liveAlerts: [],
    presets: [],

    init: function () {
      this.initTabs();
      this.initPresets();
      this.initModalEscListener();
    },

    /* ── GERENCIAMENTO DE ABAS LATERAIS ── */
    initTabs: function () {
      const tabBtns = document.querySelectorAll('.tac-tab-btn[data-tab]');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchSideTab(btn.dataset.tab);
        });
      });
    },

    switchSideTab: function (tabName) {
      this.activeTab = tabName;
      document.querySelectorAll('.tac-tab-btn[data-tab]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });
      document.querySelectorAll('.tac-tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `pane-${tabName}`);
      });
    },

    /* ── MODAL DE REGRAS ── */
    openRulesModal: function () {
      const modal = document.getElementById('rulesModalBackdrop');
      if (modal) {
        modal.classList.add('show');
      }
    },

    closeRulesModal: function () {
      const modal = document.getElementById('rulesModalBackdrop');
      if (modal) {
        modal.classList.remove('show');
      }
    },

    initModalEscListener: function () {
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          this.closeRulesModal();
        }
      });
    },

    /* ── GAVETA MOBILE ── */
    toggleMobileSidebar: function () {
      const panel = document.querySelector('.systems-panel');
      if (panel) {
        panel.classList.toggle('open');
      }
    },

    /* ── DETECÇÃO DE ZONAS OFENSIVAS DE HANDEBOL (Quadra 40x20m, Ataque ao Gol Direito x=40, y=10) ── */
    detectZone: function (x, y) {
      const dGoal = Math.hypot(40.0 - x, 10.0 - y);

      if (dGoal <= 6.05) {
        return { name: 'Área de 6m (Área de Gol)', tag: '6m', isGoalArea: true };
      }
      if (dGoal <= 7.2) {
        return { name: 'Linha de 7m (Penalidade)', tag: '7m', isGoalArea: false };
      }
      if (dGoal <= 9.1) {
        if (y < 6.5) return { name: '9m Esquerda (Infiltração)', tag: '9m-E', isGoalArea: false };
        if (y > 13.5) return { name: '9m Direita (Infiltração)', tag: '9m-D', isGoalArea: false };
        return { name: '9m Central (Tiro Livre)', tag: '9m-C', isGoalArea: false };
      }

      if (x >= 28.0) {
        if (y < 6.0) return { name: 'Ponta Esquerda (PE)', tag: 'PE', isGoalArea: false };
        if (y > 14.0) return { name: 'Ponta Direita (PD)', tag: 'PD', isGoalArea: false };
        if (y <= 8.5) return { name: 'Meia Esquerda (ME)', tag: 'ME', isGoalArea: false };
        if (y >= 11.5) return { name: 'Meia Direita (MD)', tag: 'MD', isGoalArea: false };
        return { name: 'Armador Central (AC)', tag: 'AC', isGoalArea: false };
      }

      if (x >= 20.0) {
        return { name: 'Meio-Campo Ofensivo', tag: 'MCO', isGoalArea: false };
      }

      return { name: 'Campo Defensivo', tag: 'DEF', isGoalArea: false };
    },

    /* ── GERAÇÃO E ATUALIZAÇÃO DO LOG DE EVENTOS TÁTICOS ── */
    analyzePlay: function (drawings, players, ball) {
      if (!Array.isArray(drawings)) return;

      const actions = drawings.filter(d => 
        ['move', 'pass', 'dribble', 'shot'].includes(d.tool) && d.points && d.points.length >= 2
      );

      const events = [];
      const alerts = [];
      let passCount = 0;
      let shotCount = 0;
      let workingPlayers = JSON.parse(JSON.stringify(players || []));
      let workingBall = Object.assign({}, ball || { x: 28, y: 10 });

      // Se a bola não tiver posseiro, busca o mais próximo
      if (!workingBall.heldBy && workingPlayers.length > 0) {
        let nearestP = null, minD = 4.0;
        for (const p of workingPlayers) {
          const d = Math.hypot(p.x - workingBall.x, p.y - workingBall.y);
          if (d < minD) { minD = d; nearestP = p; }
        }
        if (nearestP) workingBall.heldBy = nearestP.id;
      }

      for (let k = 0; k < actions.length; k++) {
        const act = actions[k];
        const startPt = act.points[0];
        const endPt = act.points[act.points.length - 1];
        const timeSec = (k * 1.5).toFixed(1) + 's';
        const zoneInfo = this.detectZone(endPt.x, endPt.y);

        let isShot = act.tool === 'shot' || (endPt.x >= 37 && endPt.y >= 7 && endPt.y <= 13);

        if (isShot) {
          shotCount++;
          let shooter = workingPlayers.find(p => p.id === workingBall.heldBy);
          if (!shooter) {
            shooter = workingPlayers.reduce((prev, curr) => 
              Math.hypot(curr.x - startPt.x, curr.y - startPt.y) < Math.hypot(prev.x - startPt.x, prev.y - startPt.y) ? curr : prev, 
              workingPlayers[0]
            );
          }

          events.push({
            step: k + 1,
            time: timeSec,
            type: 'arremesso',
            tagLabel: 'Arremesso',
            title: `#${shooter.num} (${shooter.label}) ao gol`,
            detail: `Finalização em direção à meta · ${zoneInfo.name}`,
            zone: zoneInfo.name,
            drawingId: act.id,
            actionIndex: k
          });

          workingBall.x = 40.0;
          workingBall.y = endPt.y;
          workingBall.heldBy = null;
        } else if (act.tool === 'pass') {
          passCount++;
          let passer = workingPlayers.find(p => p.id === workingBall.heldBy);
          if (!passer) {
            passer = workingPlayers.reduce((prev, curr) => 
              Math.hypot(curr.x - startPt.x, curr.y - startPt.y) < Math.hypot(prev.x - startPt.x, prev.y - startPt.y) ? curr : prev, 
              workingPlayers[0]
            );
          }

          let receiver = workingPlayers.reduce((prev, curr) => 
            Math.hypot(curr.x - endPt.x, curr.y - endPt.y) < Math.hypot(prev.x - endPt.x, prev.y - endPt.y) ? curr : prev, 
            workingPlayers[0]
          );

          events.push({
            step: k + 1,
            time: timeSec,
            type: 'passe',
            tagLabel: 'Passe',
            title: `#${passer.num} (${passer.label}) → #${receiver.num} (${receiver.label})`,
            detail: `Troca de bola para ${zoneInfo.name}`,
            zone: zoneInfo.name,
            drawingId: act.id,
            actionIndex: k
          });

          workingBall.x = receiver ? receiver.x : endPt.x;
          workingBall.y = receiver ? receiver.y : endPt.y;
          workingBall.heldBy = receiver ? receiver.id : null;
        } else {
          // Movimento ou Drible
          const movingPlayer = workingPlayers.reduce((prev, curr) => 
            Math.hypot(curr.x - startPt.x, curr.y - startPt.y) < Math.hypot(prev.x - startPt.x, prev.y - startPt.y) ? curr : prev, 
            workingPlayers[0]
          );

          const isDribble = act.tool === 'dribble';
          const carriesBall = workingBall.heldBy === movingPlayer.id;

          // Regra IHF: Invasão de área de 6m
          if (zoneInfo.isGoalArea && !movingPlayer.isGK) {
            alerts.push({
              level: 'danger',
              icon: 'fas fa-ban',
              text: `Invasão da área de 6m (#${movingPlayer.num} ${movingPlayer.label}): perda de posse segundo a Regra 6 da IHF.`
            });
          }

          events.push({
            step: k + 1,
            time: timeSec,
            type: isDribble ? 'drible' : 'movimento',
            tagLabel: isDribble ? 'Drible' : 'Movimento',
            title: `#${movingPlayer.num} (${movingPlayer.label})${carriesBall ? ' com a bola' : ''}`,
            detail: `${isDribble ? 'Progressão com drible' : 'Deslocamento sem posse'} até ${zoneInfo.name}`,
            zone: zoneInfo.name,
            drawingId: act.id,
            actionIndex: k
          });

          const pInList = workingPlayers.find(p => p.id === movingPlayer.id);
          if (pInList) {
            pInList.x = endPt.x;
            pInList.y = endPt.y;
          }
          if (carriesBall) {
            workingBall.x = endPt.x;
            workingBall.y = endPt.y;
          }
        }
      }

      // Regra IHF: Jogo Passivo (5 ou mais passes sem arremesso)
      if (passCount >= 5 && shotCount === 0) {
        alerts.push({
          level: 'warning',
          icon: 'fas fa-exclamation-triangle',
          text: `${passCount} passes executados sem finalização: risco iminente de sinalização de Jogo Passivo (Regra 7.11 da IHF).`
        });
      }

      this.events = events;
      this.liveAlerts = alerts;

      // Atualiza KPIs
      const kpiPasses = document.getElementById('kpiTotalPasses');
      const kpiDuration = document.getElementById('kpiDuration');
      const kpiFinalZone = document.getElementById('kpiFinalZone');

      if (kpiPasses) kpiPasses.textContent = passCount;
      if (kpiDuration) kpiDuration.textContent = `${(actions.length * 1.5).toFixed(1)}s`;
      if (kpiFinalZone) {
        kpiFinalZone.textContent = events.length > 0 ? (events[events.length - 1].zone.split(' ')[0] || '-') : '-';
      }

      // Renderiza alertas ao vivo
      const alertContainer = document.getElementById('tacticalAlertContainer');
      if (alertContainer) {
        if (alerts.length > 0) {
          alertContainer.style.display = 'block';
          alertContainer.innerHTML = alerts.map(a => `
            <div class="tactical-live-alert ${a.level === 'danger' ? 'danger' : ''}" style="margin-bottom:6px;">
              <i class="${a.icon}" style="margin-top:2px;"></i>
              <div>${escapeHtml(a.text)}</div>
            </div>
          `).join('');
        } else {
          alertContainer.style.display = 'none';
          alertContainer.innerHTML = '';
        }
      }

      // Renderiza tabela do log de eventos
      const tbody = document.getElementById('eventLogTbody');
      if (tbody) {
        if (events.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="3" style="text-align:center;color:var(--muted);padding:24px 10px;">
                <i class="fas fa-pencil-ruler" style="font-size:1.5rem;margin-bottom:8px;display:block;opacity:0.4;"></i>
                Nenhum movimento desenhado.<br>Trace passes, movimentos ou arremessos para gerar o log tático.
              </td>
            </tr>
          `;
        } else {
          tbody.innerHTML = events.map(ev => `
            <tr class="event-log-row ${this.activeStepIndex === ev.actionIndex ? 'active' : ''}" onclick="TacticalBoard.highlightStep(${ev.actionIndex})">
              <td><span class="event-step-badge">${ev.step}</span></td>
              <td style="color:var(--muted);font-weight:500;">${ev.time}</td>
              <td>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span class="event-tag ${ev.type}">${ev.tagLabel}</span>
                  <strong style="color:var(--text);font-size:0.75rem;">${escapeHtml(ev.title)}</strong>
                </div>
                <div class="event-zone-tag">${escapeHtml(ev.detail)}</div>
              </td>
            </tr>
          `).join('');
        }
      }
    },

    /* ── HIGHLIGHT INTERATIVO DE ETAPA ── */
    highlightStep: function (actionIndex) {
      if (this.activeStepIndex === actionIndex) {
        this.activeStepIndex = null;
      } else {
        this.activeStepIndex = actionIndex;
      }

      // Atualiza visual na tabela
      const rows = document.querySelectorAll('.event-log-row');
      rows.forEach((row, i) => {
        row.classList.toggle('active', i === this.activeStepIndex);
      });

      // Solicita re-renderização do Canvas principal
      if (typeof window.render === 'function') {
        window.render();
      }
    },

    /* ── EXPORTAÇÃO DO PLAYBOOK TÁTICO (TEXTO/DOC + IMAGEM) ── */
    exportPlaybook: function () {
      if (this.events.length === 0) {
        if (typeof window.showPlayToast === 'function') {
          window.showPlayToast('Desenhe a jogada antes de exportar o playbook.', 'info', '📋', 3000);
        } else {
          alert('Desenhe a jogada antes de exportar o playbook.');
        }
        return;
      }

      let content = `====================================================\n`;
      content += `ADESP / CDHU UBERLÂNDIA — PLAYBOOK TÁTICO DIGITAL\n`;
      content += `Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n`;
      content += `====================================================\n\n`;

      content += `SEQUÊNCIA TÁTICA EXECUTADA:\n`;
      content += `----------------------------------------------------\n`;
      this.events.forEach(ev => {
        content += `#${ev.step} [${ev.time}] [${ev.tagLabel.toUpperCase()}] ${ev.title}\n`;
        content += `   Local: ${ev.zone}\n`;
        content += `   Detalhe: ${ev.detail}\n\n`;
      });

      if (this.liveAlerts.length > 0) {
        content += `----------------------------------------------------\n`;
        content += `AVALIAÇÃO DE REGRAS E RISCOS (IHF):\n`;
        this.liveAlerts.forEach(a => {
          content += `* ${a.text}\n`;
        });
        content += `\n`;
      }

      content += `====================================================\n`;
      content += `Gerado automaticamente pela Prancheta Tática ADESP/CDHU\n`;

      // Download do arquivo de texto do Playbook
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playbook_cdhu_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      // Também aciona o download da imagem do campo para compor o playbook
      if (typeof window.exportPNG === 'function') {
        window.exportPNG();
      }

      if (typeof window.showPlayToast === 'function') {
        window.showPlayToast('Playbook e diagrama de quadra exportados com sucesso!', 'goal', '📖', 4000);
      }
    },

    /* ── GESTÃO SEGURA DE PRESETS VIA CDHU_STORAGE ── */
    initPresets: function () {
      if (window.CDHU_STORAGE && window.CDHU_STORAGE.tactical) {
        const stored = window.CDHU_STORAGE.tactical.getAllPlays();
        if (Array.isArray(stored)) {
          stored.forEach(item => {
            if (item && item.name && item.data) {
              this.presets.push({
                name: item.name,
                players: item.data.players || [],
                drawings: item.data.drawings || []
              });
            }
          });
        }
      }
      this.renderPresetsList();
    },

    saveSituation: function (currentPlayers, currentDrawings, defaultName) {
      const name = prompt('Nome da situação tática:', defaultName || `Jogada ${this.presets.length + 1}`);
      if (!name || !name.trim()) return;

      const trimmedName = name.trim();
      const playData = {
        players: JSON.parse(JSON.stringify(currentPlayers || [])),
        drawings: JSON.parse(JSON.stringify(currentDrawings || []))
      };

      this.presets.push({
        name: trimmedName,
        ...playData
      });

      if (window.CDHU_STORAGE && window.CDHU_STORAGE.tactical) {
        window.CDHU_STORAGE.tactical.savePlay(trimmedName, playData);
      }

      this.renderPresetsList();

      if (typeof window.showPlayToast === 'function') {
        window.showPlayToast(`Situação "${trimmedName}" salva com sucesso!`, 'goal', '💾', 3000);
      }
    },

    renderPresetsList: function () {
      const container = document.getElementById('presetsList');
      if (!container) return;

      container.innerHTML = '';
      if (this.presets.length === 0) {
        container.innerHTML = `
          <div style="font-size:0.75rem;color:var(--muted);text-align:center;padding:12px;">
            Nenhuma situação salva no navegador.<br>Monte uma formação e clique em Salvar.
          </div>
        `;
        return;
      }

      this.presets.forEach((preset, index) => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;gap:6px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:6px 10px;margin-bottom:6px;';

        const btnLoad = document.createElement('button');
        btnLoad.style.cssText = 'flex:1;background:none;border:none;color:var(--text);font-size:0.78rem;font-family:inherit;text-align:left;cursor:pointer;display:flex;align-items:center;gap:6px;';
        btnLoad.innerHTML = `<i class="fas fa-bookmark" style="color:var(--accent);"></i> <span>${escapeHtml(preset.name)}</span>`;
        btnLoad.onclick = () => {
          if (typeof window.loadPreset === 'function') {
            window.loadPreset(index);
          }
        };

        const btnRemove = document.createElement('button');
        btnRemove.style.cssText = 'background:none;border:none;color:var(--muted);cursor:pointer;padding:4px;font-size:0.75rem;';
        btnRemove.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        btnRemove.title = 'Excluir situação';
        btnRemove.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Remover "${preset.name}"?`)) {
            TacticalBoard.presets.splice(index, 1);
            if (window.CDHU_STORAGE && window.CDHU_STORAGE.set) {
              const remaining = TacticalBoard.presets.map((p, idx) => ({
                id: 'play_' + idx,
                name: p.name,
                updatedAt: new Date().toISOString(),
                data: { players: p.players, drawings: p.drawings }
              }));
              window.CDHU_STORAGE.set('saved_plays', remaining);
            }
            TacticalBoard.renderPresetsList();
          }
        };

        item.appendChild(btnLoad);
        item.appendChild(btnRemove);
        container.appendChild(item);
      });
    }
  };

  window.TacticalBoard = TacticalBoard;

  document.addEventListener('DOMContentLoaded', () => {
    TacticalBoard.init();
  });
})(window);

