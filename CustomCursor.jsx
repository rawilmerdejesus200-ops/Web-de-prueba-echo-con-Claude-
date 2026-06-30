// components/CustomCursor.jsx
// Gold dot cursor + lagging ring (lerp follow). Disabled on touch devices.
function CustomCursor() {
  const { useEffect, useRef } = React;
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, ringX: 0, ringY: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    document.body.style.cursor = 'none';

    const handleMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };

    let raf;
    const animate = () => {
      pos.current.ringX += (pos.current.x - pos.current.ringX) * 0.12;
      pos.current.ringY += (pos.current.y - pos.current.ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.ringX + 'px';
        ringRef.current.style.top = pos.current.ringY + 'px';
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    const interactiveEls = () => document.querySelectorAll('a, button, .cursor-hover');
    const onEnter = () => {
      if (dotRef.current) { dotRef.current.style.width = '24px'; dotRef.current.style.height = '24px'; }
      if (ringRef.current) { ringRef.current.style.width = '60px'; ringRef.current.style.height = '60px'; ringRef.current.style.borderColor = 'rgba(201,168,76,0.8)'; }
    };
    const onLeave = () => {
      if (dotRef.current) { dotRef.current.style.width = '12px'; dotRef.current.style.height = '12px'; }
      if (ringRef.current) { ringRef.current.style.width = '40px'; ringRef.current.style.height = '40px'; ringRef.current.style.borderColor = 'rgba(201,168,76,0.5)'; }
    };

    // MutationObserver to attach listeners to dynamically added els too
    const attach = () => {
      interactiveEls().forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
