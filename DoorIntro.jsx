// components/DoorIntro.jsx
// Fullscreen 3D double-door intro built with Three.js.
// Two hinged door panels swing open in 3D when the user clicks ENTER.
function DoorIntro({ onOpened }) {
  const { useEffect, useRef, useState } = React;
  const canvasRef = useRef(null);
  const sceneRef = useRef({});
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Lock scroll while intro is active
    document.body.style.overflow = 'hidden';

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const gold = new THREE.PointLight(0xc9a84c, 2, 20);
    gold.position.set(0, 0, 5);
    scene.add(gold);
    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(3, 3, 5);
    scene.add(rim);

    // Door material - dark metal/wood with gold trim feel via emissive edges
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d0d,
      metalness: 0.7,
      roughness: 0.4,
      emissive: 0x000000,
    });

    const doorWidth = 2.05;
    const doorHeight = 6;

    // Pivot groups so doors hinge at outer edge, not center
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-doorWidth, 0, 0);
    const leftDoorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, 0.15);
    const leftDoor = new THREE.Mesh(leftDoorGeo, doorMat.clone());
    leftDoor.position.set(doorWidth / 2, 0, 0);
    leftPivot.add(leftDoor);

    const rightPivot = new THREE.Group();
    rightPivot.position.set(doorWidth, 0, 0);
    const rightDoorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, 0.15);
    const rightDoor = new THREE.Mesh(rightDoorGeo, doorMat.clone());
    rightDoor.position.set(-doorWidth / 2, 0, 0);
    rightPivot.add(rightDoor);

    // Gold trim lines (vertical edge accents)
    const trimMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c });
    const trimGeoL = new THREE.BoxGeometry(0.02, doorHeight, 0.16);
    const trimL = new THREE.Mesh(trimGeoL, trimMat);
    trimL.position.set(doorWidth - 0.02, 0, 0);
    leftDoor.add(trimL);
    const trimR = new THREE.Mesh(trimGeoL, trimMat);
    trimR.position.set(-doorWidth + 0.02, 0, 0);
    rightDoor.add(trimR);

    // Circular ornament rings on each door
    function addOrnament(parentDoor, xOffset) {
      const group = new THREE.Group();
      [0.6, 0.4].forEach((radius, i) => {
        const ringGeo = new THREE.TorusGeometry(radius, 0.012, 8, 48);
        const ringMesh = new THREE.Mesh(ringGeo, trimMat);
        ringMesh.position.z = 0.08;
        group.add(ringMesh);
      });
      group.position.set(xOffset, 0, 0);
      parentDoor.add(group);
    }
    addOrnament(leftDoor, 0);
    addOrnament(rightDoor, 0);

    // Door handles
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.9, roughness: 0.2, emissive: 0x553c10, emissiveIntensity: 0.3 });
    const handleGeo = new THREE.BoxGeometry(0.06, 0.4, 0.08);
    const handleL = new THREE.Mesh(handleGeo, handleMat);
    handleL.position.set(doorWidth - 0.3, 0, 0.1);
    leftDoor.add(handleL);
    const handleR = new THREE.Mesh(handleGeo, handleMat);
    handleR.position.set(-doorWidth + 0.3, 0, 0.1);
    rightDoor.add(handleR);

    leftPivot.add.length; // noop to keep structure clear
    scene.add(leftPivot);
    scene.add(rightPivot);

    // Subtle ambient gold particles behind doors (visible briefly at full open)
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = -3 - Math.random() * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.03, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    sceneRef.current = { renderer, scene, camera, leftPivot, rightPivot, particles };

    let raf;
    let t = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      t += 0.01;
      particles.rotation.y = t * 0.03;
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const handleEnter = () => {
    setOpening(true);
    const { leftPivot, rightPivot } = sceneRef.current;

    // GSAP-driven 3D door swing
    gsap.to(leftPivot.rotation, {
      y: -Math.PI / 1.65,
      duration: 1.8,
      ease: 'power3.inOut',
    });
    gsap.to(rightPivot.rotation, {
      y: Math.PI / 1.65,
      duration: 1.8,
      ease: 'power3.inOut',
    });
    // Camera pushes forward through the doorway
    gsap.to(sceneRef.current.camera.position, {
      z: 2,
      duration: 1.8,
      ease: 'power2.in',
    });

    setTimeout(() => {
      document.body.style.overflow = '';
      setGone(true);
      onOpened && onOpened();
    }, 1900);
  };

  if (gone) return null;

  return (
    <div className={`door-overlay ${opening ? 'door-opening' : ''}`}>
      <canvas ref={canvasRef} className="door-canvas" />
      <div className="door-logo-wrap">
        <div className="door-brand">Élite Estates</div>
        <div className="door-sub">Luxury Homes &amp; Supercars</div>
        {/* &amp; renders as "&" — valid JSX text entity */}
        <button className="enter-btn cursor-hover" onClick={handleEnter} disabled={opening}>
          {opening ? 'Entering…' : 'Enter →'}
        </button>
      </div>
    </div>
  );
}
