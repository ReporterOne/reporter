import React, {useEffect, useMemo, useRef, useState} from 'react';
import {motion} from 'framer-motion';


export const Scroll = ({children, contentHeight, contentWidth, updateBounds, ...props}) => {
  const teamsRef = useRef(null);
  const containerRef = useRef(null);
  const [size, changeSize] = useState({width: 0, height: 0});
  const [containerSize, changeContainerSize] = useState({width: 0, height: 0});

  const dragBounds = useMemo(() => ({
    left: Math.min(-(size.left + size.right) + containerSize.width, 0),
    right: 0,
    top: Math.min(-(size.top + size.bottom) + containerSize.height, 0),
    bottom: 0,
  }), [size, containerSize]);

  useEffect(() => {
    changeContainerSize(containerRef.current.getBoundingClientRect());
    const resizeObserve = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = entry.contentRect;
        if (entry.target === teamsRef.current) {
          changeSize(size);
        } else if (entry.target === containerRef.current) {
          changeContainerSize(size);
        }
      }
    });
    resizeObserve.observe(teamsRef.current);
    resizeObserve.observe(containerRef.current);

    return () => {
      resizeObserve.disconnect();
    };
  }, []);

  useEffect(() => {
    if (updateBounds) {
      updateBounds(dragBounds);
    }
  }, [dragBounds]);

  return (
    <motion.div ref={containerRef}
      dragConstraints={dragBounds} {...props}>
      <div ref={teamsRef} style={{
        display: 'inline-flex',
        height: contentHeight,
        width: contentWidth,
        minWidth: '100%',
        minHeight: '100%',
      }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Scroll;
