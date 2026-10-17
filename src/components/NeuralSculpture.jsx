import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import useMotionPreference from "../motion/useMotionPreference";

export default function NeuralSculpture({ onReady, pointer }) {
  const holder = useRef(null);
  const reduced = useMotionPreference();
  useEffect(() => {
    let disposed = false,
      cleanup = () => {};
    const resources = [];
    const own = (resource) => {
      resources.push(resource);
      return resource;
    };
    const host = holder.current;
    delete host.dataset.ready;
    delete host.dataset.fallback;
    const start = async () => {
      try {
        const THREE = await import("three");
        if (disposed) return;
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        cleanup = () => {
          resources.forEach((resource) => resource.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
        camera.position.z = 8.8;
        // A small matcap supplies studio reflections without generating an
        // expensive environment map on the main thread during startup.
        const textureCanvas = document.createElement("canvas");
        textureCanvas.width = textureCanvas.height = 256;
        const paint = textureCanvas.getContext("2d");
        const gradient = paint.createRadialGradient(90, 75, 4, 128, 128, 150);
        [
          [0, "#ffffff"],
          [0.18, "#edf1f8"],
          [0.3, "#657084"],
          [0.39, "#f8fbff"],
          [0.55, "#aab7ce"],
          [0.69, "#35415b"],
          [0.83, "#d6e0f4"],
          [1, "#111c35"],
        ].forEach(([stop, color]) => gradient.addColorStop(stop, color));
        paint.fillStyle = gradient;
        paint.fillRect(0, 0, 256, 256);
        const matcap = own(new THREE.CanvasTexture(textureCanvas));
        matcap.colorSpace = THREE.SRGBColorSpace;
        const group = new THREE.Group();
        group.rotation.set(0.16, -0.32, -0.08);
        scene.add(group);
        const neuronMaterial = own(
          new THREE.MeshMatcapMaterial({
            color: 0xdceaff,
            matcap,
          }),
        );
        const outputMaterial = own(
          new THREE.MeshMatcapMaterial({ color: 0xf4e7aa, matcap }),
        );
        const signalMaterial = own(
          new THREE.MeshBasicMaterial({ color: 0xf4f1cc }),
        );
        const sheetMaterial = own(
          new THREE.MeshBasicMaterial({
            color: 0x99c7ff,
            transparent: true,
            opacity: 0.045,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        const edgeMaterial = own(
          new THREE.LineBasicMaterial({
            color: 0xc7dfff,
            transparent: true,
            opacity: 0.26,
          }),
        );
        const connectionMaterial = own(
          new THREE.LineBasicMaterial({
            color: 0xc9dcff,
            transparent: true,
            opacity: 0.19,
            depthWrite: false,
          }),
        );
        const nodeGeometry = own(new THREE.SphereGeometry(0.085, 20, 14));
        const signalGeometry = own(new THREE.SphereGeometry(0.026, 8, 6));
        const sheetGeometry = own(new THREE.PlaneGeometry(1.65, 2.75));
        const edgeGeometry = own(new THREE.EdgesGeometry(sheetGeometry));
        const layers = [-1.8, -0.6, 0.6, 1.8].map((x, layerIndex) => {
          const sheet = new THREE.Mesh(sheetGeometry, sheetMaterial);
          sheet.rotation.y = Math.PI / 2;
          sheet.position.x = x;
          group.add(sheet);
          const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
          edges.rotation.copy(sheet.rotation);
          edges.position.copy(sheet.position);
          group.add(edges);
          const nodes = [];
          const rows = layerIndex === 3 ? 2 : 3;
          for (let row = 0; row < rows; row++) {
            for (let column = 0; column < 2; column++) {
              const node = new THREE.Mesh(
                nodeGeometry,
                layerIndex === 3 ? outputMaterial : neuronMaterial,
              );
              node.position.set(
                x,
                (row - (rows - 1) / 2) * 0.8,
                (column - 0.5) * 0.95,
              );
              group.add(node);
              nodes.push(node);
            }
          }
          return nodes;
        });
        const segments = [];
        const signals = [];
        layers.slice(0, -1).forEach((nodes, layerIndex) => {
          nodes.forEach((node, index) => {
            const next = layers[layerIndex + 1];
            [
              index % next.length,
              (index + 2 + layerIndex) % next.length,
            ].forEach((targetIndex, branch) => {
              const target = next[targetIndex];
              segments.push(
                ...node.position.toArray(),
                ...target.position.toArray(),
              );
              if (branch === 0) {
                const signal = new THREE.Mesh(signalGeometry, signalMaterial);
                signal.position.copy(node.position);
                group.add(signal);
                signals.push({
                  mesh: signal,
                  from: node.position,
                  to: target.position,
                  layer: layerIndex,
                  offset: index * 0.07,
                });
              }
            });
          });
        });
        const connectionGeometry = own(new THREE.BufferGeometry());
        connectionGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(segments, 3),
        );
        group.add(
          new THREE.LineSegments(connectionGeometry, connectionMaterial),
        );
        host.appendChild(renderer.domElement);
        let visible = false,
          running = false,
          last = 0,
          elapsed = 0,
          samples = 0,
          slowFrames = 0,
          renderScale = Math.min(window.devicePixelRatio, 1.5);
        const resize = () => {
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          // Keep the full architecture inside narrow mobile canvases.
          camera.position.z = Math.max(8.4, 8.1 / camera.aspect);
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(host);
        resize();
        const tick = (time) => {
          const frameTime = last ? time - last : 1 / 60;
          const dt = Math.min(frameTime, 0.04);
          last = time;
          // Only lower resolution after sustained slow visible frames. This
          // avoids quality oscillation and ignores pauses in background tabs.
          samples++;
          if (frameTime > 0.025) slowFrames++;
          if (samples === 120) {
            if (slowFrames > 45 && renderScale > 0.85) {
              renderScale = renderScale > 1 ? 1 : 0.85;
              renderer.setPixelRatio(renderScale);
              resize();
            }
            samples = slowFrames = 0;
          }
          elapsed += dt;
          const input = pointer.current;
          const damping = 1 - Math.exp(-5 * dt);
          group.rotation.y +=
            (-0.32 +
              input.x * 0.24 +
              Math.sin(elapsed * 0.3) * 0.06 -
              group.rotation.y) *
            damping;
          group.rotation.x +=
            (0.16 + input.y * 0.16 - group.rotation.x) * damping;
          group.position.y = Math.sin(elapsed * 0.7) * 0.055;
          const cycle = (elapsed * 0.28) % 1;
          signals.forEach(({ mesh, from, to, layer, offset }) => {
            const progress = (cycle * 3 - layer - offset + 3) % 3;
            mesh.visible = progress <= 1;
            mesh.position.lerpVectors(from, to, Math.min(progress, 1));
          });
          layers.forEach((nodes, layer) => {
            const activation = Math.max(0, 1 - Math.abs(cycle * 4 - layer) * 2);
            nodes.forEach((node) => node.scale.setScalar(1 + activation * 0.3));
          });
          renderer.render(scene, camera);
        };
        const sync = () => {
          const next = visible && !document.hidden && !reduced;
          if (next === running) return;
          running = next;
          last = samples = slowFrames = 0;
          if (running) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        });
        observer.observe(host);
        document.addEventListener("visibilitychange", sync);
        host.dataset.ready = "true";
        onReady();
        const disposeScene = cleanup;
        cleanup = () => {
          gsap.ticker.remove(tick);
          ro.disconnect();
          observer.disconnect();
          document.removeEventListener("visibilitychange", sync);
          disposeScene();
        };
      } catch {
        cleanup();
        cleanup = () => {};
        if (!disposed) {
          host.dataset.fallback = "true";
          onReady();
        }
      }
    };
    start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [onReady, reduced, pointer]);
  return (
    <div
      className="neural-sculpture"
      ref={holder}
      role="img"
      aria-label="A layered neural network with signals flowing from input data through learning layers to predictions."
    >
      <div className="network-heading" aria-hidden="true">
        <span>01 / NEURAL ARCHITECTURE</span>
        <span className="network-symbol">✳</span>
      </div>
      <svg
        className="sculpture-fallback"
        viewBox="0 0 480 300"
        aria-hidden="true"
      >
        {[70, 185, 300, 415].map((x, layer) => (
          <g key={x}>
            <rect
              x={x - 25}
              y="35"
              width="50"
              height="230"
              rx="6"
              fill="#c7dfff"
              fillOpacity="0.05"
              stroke="#c7dfff"
              strokeOpacity="0.3"
            />
            {[85, 150, 215].map((y) => (
              <g key={y}>
                {layer < 3 &&
                  [85, 150, 215].map((target) => (
                    <line
                      key={target}
                      x1={x}
                      y1={y}
                      x2={x + 115}
                      y2={target}
                      stroke="#c7dfff"
                      strokeOpacity="0.2"
                    />
                  ))}
                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill={layer === 3 ? "#f4e7aa" : "#dceaff"}
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
      <div className="network-legend" aria-hidden="true">
        <span>
          01 <b>DATA</b>
        </span>
        <i />
        <span>
          02 <b>LEARNING</b>
        </span>
        <i />
        <span>
          03 <b>PREDICTION</b>
        </span>
      </div>
    </div>
  );
}
