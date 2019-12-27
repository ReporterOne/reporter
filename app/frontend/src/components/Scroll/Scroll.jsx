import React, {useEffect, useMemo, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Container} from "~/components/common";


export const Scroll = ({children, contentHeight, contentWidth, updateBounds, ...props}) => {
  const teamsRef = useRef(null);
  const containerRef = useRef(null);
  const [observer, changeObserver] = useState(null);
  const [size, changeSize] = useState({width: 0, height: 0});
  const [containerSize, changeContainerSize] = useState({width: 0, height: 0});
  const dragBounds = useMemo(() => ({
    left: Math.min(-(size.left + size.right) + containerSize.width, 0),
    right: 0,
    top: Math.min(-(size.top + size.bottom) + containerSize.height, 0),
    bottom: 0
  }), [size, containerSize])
  useEffect(() => {
    changeContainerSize(containerRef.current.getBoundingClientRect());
    const resizeObserve = new ResizeObserver(entries => {
      const size = entries[0].contentRect;
      changeSize(size);
    });
    resizeObserve.observe(teamsRef.current);
    changeObserver(resizeObserve);

    return () => {
      resizeObserve.disconnect()
    }
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
        width: contentWidth
      }}>
        {children}
      </div>
    </motion.div>
  )
};

export default Scroll;