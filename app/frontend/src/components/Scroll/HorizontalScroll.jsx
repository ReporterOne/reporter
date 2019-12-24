import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Container} from "~/components/common";


export const HorizontalScroll = ({children, contentHeight, contentWidth, updateBounds, ...props}) => {
  const teamsRef = useRef(null);
  const containerRef = useRef(null);
  const [observer, changeObserver] = useState(null);
  const [size, changeSize] = useState({width: 0, height: 0});
  const [containerSize, changeContainerSize] = useState({width: 0, height: 0});

  useEffect(() => {
    changeContainerSize(containerRef.current.getBoundingClientRect());
    const resizeObserve = new ResizeObserver(entries => {
      const size = entries[0].contentRect;
      changeSize(size);
    });
    resizeObserve.observe(teamsRef.current);
    changeObserver(resizeObserve);
  }, []);

  useEffect(() => {
    if (updateBounds) {
      updateBounds(
        {
          left: -(size.left + size.right) + containerSize.width,
          right: 0,
          top: -(size.top + size.bottom) + containerSize.height,
          bottom: 0
        }
      );
    }
  }, [size, containerSize]);

  return (
    <motion.div ref={containerRef}
                dragConstraints={{
                  left: -(size.left + size.right) + containerSize.width,
                  right: 0,
                  top: -(size.top + size.bottom) + containerSize.height,
                  bottom: 0
                }} {...props}>
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

export default HorizontalScroll;