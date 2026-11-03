# SLAM: Subsurface Lunar Atlas Mission

A scrollytelling pitch for SLAM, a tethered rover that gets lowered through lunar skylights and maps lava tubes with LiDAR + visual SLAM.

Live at https://slamlunar.xyz

The story covers the new US–China race back to the Moon, why lava tubes matter (radiation, temperature, impacts), the descent, the device itself, and what the resulting 3D map is used for.

- `index.html`: the page fragment (the canvas scenes are procedural; the only assets are the 3D rover, the link-preview image and the icons)
- `rover.glb`: the hero model, built from the CAD export by `tools/web-model.mjs`
- `build.sh`: writes `docs/`, the standalone build GitHub Pages serves (custom domain in `CNAME`); run it before every push

Values shown in the scenes (cave dimensions, tether readouts) are illustrative.
