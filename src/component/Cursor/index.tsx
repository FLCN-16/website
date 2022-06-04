import React from 'react';
import gsap from 'gsap';


const CursorComponent = () => {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const cursorPointerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (cursorRef.current) {
      let cursorWidth = cursorRef.current.clientWidth;
      let cursorHeight = cursorRef.current.clientHeight;

      let cursorX = event.clientX - (cursorWidth / 2) - 1;
      let cursorY = event.clientY - (cursorHeight / 2) - 1;
      let cursorScale = 1;
      let backgroundColor = 'transparent';
      let isIntractable =
        event?.target instanceof Element &&
        ['A', 'BUTTON'].indexOf(event?.target?.nodeName as string) > -1;

      if (isIntractable) {
        cursorScale = 2;
        backgroundColor = 'rgba(255, 255, 255, 0.5)';
      }

      gsap.to(cursorRef.current, {
        x: cursorX,
        y: cursorY,
        duration: 0.75,
        ease: 'power6.out',
        opacity: 1,
        scale: cursorScale,
        backgroundColor
      });

      if (cursorPointerRef.current) {
        let cursorPointerWidth = cursorPointerRef.current.clientWidth;
        let cursorPointerHeight = cursorPointerRef.current.clientHeight;
        let cursorScale = 1;

        if (isIntractable) {
          cursorScale = 0;
        }

        gsap.to(cursorPointerRef.current, {
          x: event.clientX - (cursorPointerWidth / 2),
          y: event.clientY - (cursorPointerHeight / 2),
          duration: 0.15,
          ease: 'power4.out',
          opacity: 1,
        });

        gsap.to(cursorPointerRef.current, {
          duration: 0.5,
          scale: cursorScale,
        });
      }
    }
  }

  const attachEvents = () => {
    document.addEventListener('mousemove', handleMouseMove);

  }

  const detachEvents = () => {
    document.removeEventListener('mousemove', handleMouseMove);
  }

  React.useEffect(() => {
    attachEvents();

    return detachEvents;
  }, []);

  return (
    <div
      className="cursor-wrapper fixed h-screen w-screen pointer-events-none"
      style={{ zIndex: 1000 }}
    >
      <span
        ref={cursorRef}
        className="cursor absolute inline-block h-6 w-6 rounded-full border border-gray-200"
      />
      <span
        ref={cursorPointerRef}
        className="cursor-inner absolute inline-block h-2 w-2 rounded-full bg-gray-600"
      />
    </div>
  );
}

export default CursorComponent;