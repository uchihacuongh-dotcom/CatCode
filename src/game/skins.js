// src/game/skins.js

const STORAGE_KEY = 'catcode_skins_v1';

const CAT_SKINS = [
  {
    id: 'cat_default',
    name: 'Bộ lông mặc định',
    description: 'Chú mèo gỡ lỗi chuẩn mực.',
    price: 0,
    baseColor: 0x222222,
    eyeColor: 0x00ff00,
    rarity: 'common',
  },
  {
    id: 'cat_midnight',
    name: 'Báo đêm',
    description: 'Dành cho những đêm code lặng lẽ.',
    price: 10,
    baseColor: 0x050509,
    eyeColor: 0x8be9fd,
    rarity: 'rare',
  },
  {
    id: 'cat_neon',
    name: 'Hacker Neon',
    description: 'Tỏa sáng với năng lượng của stack trace.',
    price: 10,
    baseColor: 0xbd93f9,
    eyeColor: 0xff79c6,
    rarity: 'epic',
  },
  {
    id: 'pink_princess',
    name: 'Công chúa',
    description: 'Sức mạnh của công chúa.',
    price: 10,
    baseColor: 0xFFC0CB,
    eyeColor: 0xFFFFFF,
    rarity: 'epic',
  },
];

const ARENA_SKINS = [
  {
    id: 'arena_default',
    name: 'Lưới cổ điển',
    description: 'Đơn giản nhưng đáng tin cậy.',
    price: 0,
    groundColor: 0xffffff,
    blockColor: 0x3a3a4a,
    accentColor: 0x50fa7b,
  },
  {
    id: 'arena_synthwave',
    name: 'Đêm Synthwave',
    description: 'Màu neon chuyển sắc cho những đêm cày code.',
    price: 10,
    groundColor: 0x1a1a2e,
    blockColor: 0x282a36,
    accentColor: 0xbd93f9,
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export class SkinsService {
  constructor() {
    const stored = loadState();
    if (stored) {
      this.state = stored;
    } else {
      this.state = {
        unlockedCat: ['cat_default'],
        unlockedArena: ['arena_default'],
        equippedCat: 'cat_default',
        equippedArena: 'arena_default',
      };
      saveState(this.state);
    }
  }

  // --- getters ---

  getCatSkins() {
    return CAT_SKINS;
  }

  getArenaSkins() {
    return ARENA_SKINS;
  }

  getEquippedCatSkin() {
    return CAT_SKINS.find((s) => s.id === this.state.equippedCat) || CAT_SKINS[0];
  }

  getEquippedArenaSkin() {
    return ARENA_SKINS.find((s) => s.id === this.state.equippedArena) || ARENA_SKINS[0];
  }

  isUnlockedCat(id) {
    return this.state.unlockedCat.includes(id);
  }

  isUnlockedArena(id) {
    return this.state.unlockedArena.includes(id);
  }

  // --- mutations ---

  unlockCat(id) {
    if (!this.isUnlockedCat(id)) {
      this.state.unlockedCat.push(id);
      saveState(this.state);
    }
  }

  unlockArena(id) {
    if (!this.isUnlockedArena(id)) {
      this.state.unlockedArena.push(id);
      saveState(this.state);
    }
  }

  equipCat(id) {
    if (this.isUnlockedCat(id)) {
      this.state.equippedCat = id;
      saveState(this.state);
    }
  }

  equipArena(id) {
    if (this.isUnlockedArena(id)) {
      this.state.equippedArena = id;
      saveState(this.state);
    }
  }
}
