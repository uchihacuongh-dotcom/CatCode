// src/levels/cameraShakeDemo.js
// Example level demonstrating camera shake, pulseExposure, and flashBackground effects

import { createGround, createArrayBlocks, getBlockUnderCat } from '../game/levelUtils.js';

export const meta = {
  id: 'demo-camera-shake',
  title: 'Thử hiệu ứng camera',
  difficulty: 'easy',
  tags: ['demo', 'effects', 'camera'],
  mode: 'platform',
  description: 'Nhảy lên và xem camera rung! Chạm vào các khối để kích hoạt hiệu ứng.'
};

export function createLevel() {
  let ground = null;
  let blocks = [];
  let triggerBlocks = [];

  return {
    id: meta.id,
    title: meta.title,

    build(engine, services) {
      const { cat, editor, hud, cameraRig } = services || {};

      // Set up world
      ground = createGround(engine.scene);
      
      // Create array blocks with different colors for triggers
      blocks = createArrayBlocks(
        engine.scene,
        [1, 2, 3, 4, 5],
        { z: 0, y: 0.5 }
      );

      // Place cat at start
      if (cat) {
        cat.position.set(-10, 1, 0);
        cat.velocity.set(0, 0, 0);
        cat.mesh.position.copy(cat.position);
      }

      // HUD + Editor setup
      if (hud) hud.setLevelTitle(meta.title);
      if (editor) {
        editor.clearOutput();
        editor.printOutput('🎮 Hãy nhảy và di chuyển để kích hoạt hiệu ứng!', 'system');
        editor.printOutput('Đứng lên từng khối để xem các hiệu ứng khác nhau.', 'hint');
      }

      // Store trigger state
      triggerBlocks = [false, false, false, false, false];
    },

    update(dt, engine, services) {
      const { cat, editor, cameraRig } = services || {};
      if (!cat || !editor || !cameraRig) return;

      // Check which block cat is on
      const hit = getBlockUnderCat(cat, blocks);
      if (hit) {
        const idx = hit.block.index;

        // Trigger effects based on block index
        if (!triggerBlocks[idx]) {
          triggerBlocks[idx] = true; // Prevent repeated triggers

          // Different effects per block
          switch (idx) {
            case 0:
              // Gentle camera shake
              editor.printOutput('📷 Rung nhẹ!', 'info');
              cameraRig.shake(0.15, 0.25);
              engine.pulseExposure(0.2, 0.3);
              break;

            case 1:
              // Stronger shake
              editor.printOutput('💥 Rung mạnh!', 'info');
              cameraRig.shake(0.4, 0.5);
              engine.pulseExposure(0.35, 0.5);
              break;

            case 2:
              // Shake + flash
              editor.printOutput('⚡ Rung + Chớp sáng!', 'info');
              cameraRig.shake(0.3, 0.4);
              engine.flashBackground(0xffff00, 0.3); // Yellow flash
              break;

            case 3:
              // Intense effect combo
              editor.printOutput('🌪️ Combo dữ dội!', 'info');
              cameraRig.shake(0.5, 0.6);
              engine.flashBackground(0xff6600, 0.4); // Orange flash
              engine.pulseExposure(0.5, 0.6);
              break;

            case 4:
              // Ultimate effect
              editor.printOutput('🎆 HIỆU ỨNG TỐI THƯỢNG! Bạn đã đến cuối!', 'success');
              cameraRig.shake(0.6, 0.8);
              engine.flashBackground(0x50fa7b, 0.5); // Green flash
              engine.pulseExposure(0.6, 0.8);
              // Fog effect
              engine.setFogDensity(0.08);
              break;
          }
        }
      } else {
        // Reset triggers when leaving
        triggerBlocks = [false, false, false, false, false];
      }
    },

    hint(editor) {
      if (!editor) return;
      editor.printOutput('💡 Gợi ý: Nhảy lên từng khối theo thứ tự để xem các hiệu ứng camera khác nhau!', 'hint');
    },

    explain(editor) {
      if (!editor) return;
      editor.printOutput(
        '📚 Giải thích: Màn này minh họa:\n' +
        '  • Camera Rig: camera bám theo mượt mà, có thể chỉnh khoảng cách\n' +
        '  • Camera Shake (rung): cameraRig.shake(intensity, duration)\n' +
        '  • Pulse Exposure (nhấp nháy độ sáng): engine.pulseExposure(amount, duration)\n' +
        '  • Flash Background (chớp nền): engine.flashBackground(color, duration)\n' +
        '  • Fog Density (độ dày sương mù): engine.setFogDensity(value)',
        'system'
      );
    },

    destroy(engine) {
      if (ground) {
        engine.scene.remove(ground);
        ground = null;
      }
      if (blocks && blocks.length) {
        for (const b of blocks) engine.scene.remove(b.mesh);
        blocks = [];
      }
      // Reset fog density
      engine.setFogDensity(0.025);
    }
  };
}
