# Food Perspective & Semantic Plating Reference

## 1. Geometric & Perspective Standard
- **Camera Perspective:** 30-degree cabinet / top-down perspective with consistent soft light source from the top-left (10 o'clock).
- **Plate Geometry:** Circular shallow melamine diner plate, 256×256 pixels texture space with slight outer rim bevel.
- **Drop Shadows:** Soft 4px offset downward-right with 25% opacity Gaussian blur to ground layered toppings.

---

## 2. Plating Coordinate System (Origin: Plate Center (128, 128))

```
                    [ 0, 0 ] Top Edge
                         .
            +-------------------------+
            |        [Chả Trứng]      |
            |     (90, 75)            |
            |                         |
 [Bì Heo]   |      [CƠM TẤM]          |   [SƯỜN NƯỚNG]
(65, 125)   |      Center (128, 128)  |   (165, 105)
            |                         |
            |   [Đồ Chua]  [Dưa Leo]  |
            |   (90, 185)  (145, 195) |
            +-------------------------+
                         .
                  [Mỡ Hành Drizzle]
                   Over meat & rice
```

### Layer Stacking Order (Z-Index from Bottom to Top):
1. **Z = 0:** `plate_base` (Clean ceramic/melamine plate).
2. **Z = 1:** `food_broken_rice` (Base mound of steamy broken rice).
3. **Z = 2:** `food_pork_chop` (Large grilled pork cutlet, draped across upper right).
4. **Z = 3:** `food_egg_meatloaf` (Steamed chả trứng slice at top left).
5. **Z = 4:** `food_shredded_pork_skin` (Fluffy bì pork skin at mid left).
6. **Z = 5:** `food_fried_egg` (Sunny-side-up trứng ốp la resting partially over the rice).
7. **Z = 6:** `food_pickled_vegetables` & `food_cucumber` (Fresh daikon/carrot and cucumber slices at bottom).
8. **Z = 7:** `food_scallion_oil` (Glossy green scallion oil and crispy pork crackling drizzle across pork chop and rice).
9. **Z = 8:** Side dipping bowl with `food_fish_sauce` placed alongside plate.

---

## 3. Cooking State Visual Rules (Grill Meat)

| State | Visual Appearance | Color Range |
|---|---|---|
| **Raw (`raw`)** | Translucent pale pink, visibly wet marinade, fresh garlic/lemongrass bits | `#e09f8d` to `#cc6b58` |
| **Cooking (`cooking`)** | Light golden brown, edges beginning to sizzle, white smoke puffs | `#b8860b` to `#cd853f` |
| **Cooked (`cooked`)** | Rich mahogany-caramel glaze, dark brown grill marks, sizzling glossy surface | `#8b4513` to `#d2691e` |
| **Burnt (`burnt`)** | Blackened edges, charred crust, grey acrid smoke wisp, shriveled texture | `#221814` to `#4a3528` |
