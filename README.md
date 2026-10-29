# 3D Animations with Three.js

Three 3D animations built in the browser with JavaScript and [Three.js](https://threejs.org/):

1. **Bouncing ball**
2. **Car moving to and fro**
3. **Moon orbiting the Earth**

**Live demo:** [add your GitHub Pages link here]

**Author:** [Your name] · [Course code]

---

## Features

- Three separate 3D scenes, switched with buttons at the top
- Drag the mouse (or your finger) to rotate the camera around each scene
- Shadows, lighting and smooth animation at about 60 frames per second
- Works on desktop and mobile
- No installs or build tools needed

## Project structure

```
3d-animations/
├── index.html   # page layout and styling
├── script.js    # all the animation code
└── README.md    # this file
```

## How to run it

1. Download or clone this repository.
2. Open the folder in **VS Code**.
3. Right-click `index.html` and choose **Open with Live Server**
   (or just double-click `index.html` to open it in your browser).

> An internet connection is needed because Three.js is loaded from a CDN.

## How it works

Every animation uses the same three parts:

| Part | What it does |
| --- | --- |
| **Scene** | The 3D world that holds the objects and the lights |
| **Camera** | The viewpoint. Dragging the mouse rotates it |
| **Animation loop** | Runs about 60 times per second: update positions using time, then draw the frame |

### 1. Bouncing ball

The height follows the absolute value of a sine wave, so the ball rises and falls without ever going below the ground. Near the ground it is squashed slightly to look like an impact.

```js
const h = Math.abs(Math.sin(t * 2.5));
ball.position.y = 1 + 5 * h;
```

### 2. Car to and fro

The x position follows a sine wave, so the car moves right, then left, repeatedly. When the direction flips, the car turns 180 degrees smoothly. The wheels spin by distance divided by radius, so they match the car's speed.

```js
const x = Math.sin(t * 0.8) * 8;
car.rotation.y += (target - yaw) * 0.12;
wheel.rotation.z -= distance / radius;
```

### 3. Moon orbiting Earth

This is circular motion. The angle grows with time, and `cos` and `sin` turn it into x and z positions. A small `sin` on the y axis tilts the orbit. The Earth also spins on its own axis.

```js
const angle = t * 0.7;
moon.position.set(Math.cos(angle) * 6, Math.sin(angle) * 0.9, Math.sin(angle) * 6);
```

## Publish with GitHub Pages

1. Create a new repository on GitHub and upload `index.html`, `script.js` and `README.md`.
2. Go to **Settings → Pages**.
3. Under **Branch**, choose `main` and `/ (root)`, then click **Save**.
4. After a minute, your live link appears at the top of the Pages settings.

## Built with

- HTML, CSS and JavaScript
- [Three.js](https://threejs.org/) (r128)

## Presentation outline

1. Introduction: what the project is
2. Live demo of the three animations
3. How the code works: scene, camera, loop
4. The math behind each animation
5. How it was built and published (VS Code and GitHub)
6. Questions
