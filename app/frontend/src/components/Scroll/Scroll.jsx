import React, {useEffect, useMemo, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import ReactResizeDetector from 'react-resize-detector';


const timers = {};
let instance = 0;
export const Scroll = ({children, contentHeight, contentWidth, updateBounds, ...props}) => {
  const [instanceID] = useState(instance++);
  const teamsRef = useRef(null);
  const containerRef = useRef(null);
  const [size, changeSize] = useState({width: 0, height: 0});
  const [containerSize, changeContainerSize] = useState({width: 0, height: 0});

  const dragBounds = useMemo(() => {
    return ({
      left: Math.min(-size.width + containerSize.width, 0),
      right: 0,
      top: Math.min(-size.height + containerSize.height, 0),
      bottom: 0,
    });
  }, [size, containerSize]);


  useEffect(() => {
    if (updateBounds) {
      updateBounds(dragBounds);
    }
  }, [dragBounds]);

  return (
    <ReactResizeDetector handleWidth handleHeight>
      {({width, height}) => {
        clearTimeout(timers[`${instanceID}_0`]);
        timers[`${instanceID}_0`] = setTimeout(() => {
          if (containerSize.width !== width || containerSize.height !== height) {
            changeContainerSize({width, height});
          }
        }, 100);
        return (
          <div style={{width, height}} className="resized_container_scroll">
            <motion.div ref={containerRef}
              dragConstraints={dragBounds} {...props}>
              <div ref={teamsRef} style={{
                display: 'inline-flex',
                height: contentHeight,
                width: contentWidth,
                minWidth: '100%',
                minHeight: '100%',
              }}>
                <ReactResizeDetector handleWidth handleHeight>
                  {({width, height}) => {
                    clearTimeout(timers[`${instanceID}_1`]);
                    timers[`${instanceID}_1`] = setTimeout(() => {
                      if (size.width !== width || size.height !== height) {
                        changeSize({width, height});
                      }
                    }, 100);
                    return (
                      <div style={{width, height}} className="resized_container_inner_scroll">
                        {children}
                      </div>
                    );
                  }}
                  {/* {children}*/}
                </ReactResizeDetector>
              </div>
            </motion.div>
          </div>
        );
      }}
    </ReactResizeDetector>
  );
};

export default Scroll;
