# Performance Baseline & Resource SLA

## 1. Frame Timing & Rendering Performance

| Target Platform | Target FPS | Minimum Acceptable FPS | Frame Timing Budget |
| :--- | :--- | :--- | :--- |
| **Desktop (1280×720, 1440×900, 1152×648)** | 60 FPS | 30 FPS | ≤ 16.6 ms (avg) |
| **Mobile (390×844, 360×800)** | 30–60 FPS | 24 FPS | ≤ 33.3 ms (avg) |

### Stress Scene Profiling
- **Test Condition:** Full customer queue (4 active customers) + full grill (4 sizzling chops at varied cook stages) + incident modal overlay active.
- **Measured Average FPS:** ~45–60 FPS (Desktop), ~30–45 FPS (Mobile), ≥ 25 FPS (Headless CI virtualization).
- **Max Frame Time Spike:** < 350 ms during initial modal mounting.

---

## 2. Memory & DOM Node Ceilings

| Metric | Baseline Target | Soak Ceiling (5+ Days) | Status |
| :--- | :--- | :--- | :--- |
| **JS Heap Used** | 35 MB – 65 MB | < 250 MB | PASS |
| **DOM Node Count** | ~350 nodes | < 500 nodes (Delta < 150) | PASS |
| **Detached DOM Leaks** | 0 | 0 | PASS |
| **Phaser Textures** | Bounded to loaded bundle | Bounded to loaded bundle | PASS |

---

## 3. Audio System Resource Bounds

- **Mixer Buses:** 5 dedicated buses (`master`, `music`, `ambience`, `sfx`, `ui`) managed through singular `AudioMixer`.
- **Music Stream:** Exactly 1 active background music loop playing at any given time.
- **Grill Loop:** Exactly 1 single dynamic intensity loop (`GrillAudioController`), scaling gain from 0.0 (idle/empty) to 1.0 (4+ meats) without spawning multiple concurrent audio instances.
- **Visibility Suspension:** Audio automatically mutes/suspends on `document.visibilitychange === 'hidden'`.

---

## 4. Soak Longevity Verification

- **Harness:** `tests/e2e/soak.spec.ts`
- **Execution:** 5+ consecutive accelerated days traversing opening, service, customer churn, day summary, and morning reset.
- **Queue Cleanup:** 100% verified — queue length and plate assembly cleanly reset between phases.
- **Overlay State:** 100% verified — 0 lingering `.overlay-backdrop` elements left in DOM after day cycles.
