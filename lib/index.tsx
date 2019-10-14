import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

import {
  ILoc,
  getWidthAndHeight,
  windowToCanvas,
  handleMoveEffect,
  getPointByLoc,
  setToolsLocEffect,
  drawLocCanvas
} from './utils';
import './index.less';
import Canvas from './canvas';

interface IProps {
  /** 如果只是图片 */
  src: string;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 改变窗口时改变大小 */
  shouldResetAfterResize?: boolean;
}

const image = new Image();

const ImageTools: React.FC<IProps> = ({
  src,
  width,
  height,
  shouldResetAfterResize
}) => {
  const [size, setSize] = useState<[number, number]>([0, 0]);
  const [isFinished, setFinished] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const [lastDraw, setLastDraw] = useState<() => void>(() => () => {});
  const cutRef = useRef<HTMLDivElement>(null);
  const puzzleRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLCanvasElement>(null);
  const locationBoxRef = useRef<HTMLDivElement>(null);
  const ratioRef = useRef<number>(1);
  const firstLocRef = useRef<ILoc>({ x: 0, y: 0 });
  const secondLocRef = useRef<ILoc>({ x: 0, y: 0 });
  const thirdLocRef = useRef<ILoc>({ x: 0, y: 0 });
  const lastLocRef = useRef<ILoc>({ x: 0, y: 0 });
  const locRef = useRef<ILoc>({ x: 0, y: 0 });
  const directionRef = useRef<string | null>('');

  const init = () => {
    const parentEle = parentRef.current as HTMLDivElement;
    setFinished(false);
    setSelected(false);
    parentEle.style.left = '-999999px';
  };

  const handleLocMove = (event: React.MouseEvent) => {
    const cutEle = cutRef.current as HTMLDivElement;
    const curLoc = windowToCanvas(cutEle, event.clientX, event.clientY);
    const ele = locationRef.current as HTMLCanvasElement;
    drawLocCanvas({
      image,
      box: locationBoxRef.current as HTMLDivElement,
      ele,
      loc: curLoc,
      ratioRef
    });
  };

  const handleClose = () => {
    setFinished(false);
    setSelected(false);
    const puzzleEle = puzzleRef.current as HTMLCanvasElement;
    const cutEle = cutRef.current as HTMLDivElement;
    Object.assign(puzzleEle.style, {
      width: '0px',
      height: '0px'
    });
    cutEle.onmousemove = handleLocMove as any;
  };

  useEffect(() => {
    const drawImg = () => {
      const curSize = getWidthAndHeight(image, width, height);
      setSize(curSize);
      ratioRef.current = image.width / curSize[0];
    };
    window.onresize = () => {
      if (!shouldResetAfterResize) return;

      drawImg();
      init();
    };

    image.onload = drawImg;

    return () => {
      window.onresize = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    image.src = src;
  }, [src]);

  useEffect(() => {
    const cutEle = cutRef.current as HTMLDivElement;
    const puzzleEle = puzzleRef.current as HTMLCanvasElement;
    const parentEle = parentRef.current as HTMLDivElement;
    const context = puzzleEle.getContext('2d') as CanvasRenderingContext2D;
    const cancel = () => {
      cutEle.onmousemove = null;
      parentEle.onmousemove = null;
      document.onmouseup = null;
    };

    if (isSelected) {
      cutEle.style.cursor = 'unset';
      puzzleEle.style.cursor = 'unset';

      return;
    }

    cutEle.style.cursor = 'crosshair';
    cutEle.onmousemove = handleLocMove as any;

    cutEle.onmousedown = event => {
      setFinished(false);
      const firstLoc = windowToCanvas(cutEle, event.clientX, event.clientY);

      const handleMove = (event: MouseEvent) => {
        const lastLoc = windowToCanvas(cutEle, event.clientX, event.clientY);
        const curDraw = handleMoveEffect({
          firstLoc,
          lastLoc,
          puzzleEle,
          ratioRef,
          parentEle,
          context,
          image
        });

        const ele = locationRef.current as HTMLCanvasElement;
        drawLocCanvas({
          image,
          box: locationBoxRef.current as HTMLDivElement,
          ele,
          loc: lastLoc,
          ratioRef
        });

        return curDraw;
      };

      cutEle.onmousemove = handleMove;

      parentEle.onmousemove = handleMove;

      document.onmouseup = event => {
        setLastDraw(() => handleMove(event));
        const curLoc = windowToCanvas(cutEle, event.clientX, event.clientY);
        const [one, two, three, four] = getPointByLoc(firstLoc, curLoc);

        firstLocRef.current = one;
        secondLocRef.current = two;
        thirdLocRef.current = three;
        lastLocRef.current = four;
        setFinished(true);
        cancel();
      };
    };

    return () => {
      cancel();
      cutEle.onmousedown = null;
    };
  }, [size, isSelected]);

  useEffect(() => {
    const puzzleEle = puzzleRef.current as HTMLCanvasElement;

    if (!puzzleEle) return;

    const removeMouse = () => {
      puzzleEle.onmousemove = null;
    };

    if (isFinished) {
      const cutEle = cutRef.current as HTMLDivElement;
      const parentEle = parentRef.current as HTMLDivElement;
      const toolsEle = toolsRef.current as HTMLDivElement;
      const toolsLoc = (toolsRef.current as HTMLDivElement).getBoundingClientRect();
      const context = puzzleEle.getContext('2d') as CanvasRenderingContext2D;
      const { height: parentH } = parentEle.getBoundingClientRect();

      puzzleEle.style.cursor = 'move';

      setToolsLocEffect(puzzleEle, toolsEle, toolsLoc, parentH);

      const handleMove = (moveEvent: MouseEvent) => {
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        const puzzleInfo = puzzleEle.getBoundingClientRect();
        const { x, y } = locRef.current;
        const curLoc = windowToCanvas(
          cutEle,
          moveEvent.clientX,
          moveEvent.clientY
        );
        const disX = curLoc.x - x;
        const disY = curLoc.y - y;
        const {
          width: parentW,
          height: parentH
        } = parentEle.getBoundingClientRect();
        const left = parseFloat(parentEle.style.left || '0');
        const top = parseFloat(parentEle.style.top || '0');

        let L = left + disX;
        let T = top + disY;
        if (left + disX <= 0) {
          L = 0;
        } else if (left + disX >= size[0] - parentW) {
          L = size[0] - parentW;
        }

        if (top + disY <= 0) {
          T = 0;
        } else if (top + disY >= size[1] - parentH) {
          T = size[1] - parentH;
        }

        setToolsLocEffect(puzzleEle, toolsEle, toolsLoc, parentH);

        parentEle.style.left = `${L}px`;
        parentEle.style.top = `${T}px`;
        locRef.current = curLoc;

        const moveDraw = () =>
          context.drawImage(
            image,
            L * ratioRef.current,
            T * ratioRef.current,
            puzzleInfo.width * ratioRef.current,
            puzzleInfo.height * ratioRef.current,
            0,
            0,
            puzzleInfo.width * ratioRef.current,
            puzzleInfo.height * ratioRef.current
          );

        moveDraw();

        return moveDraw;
      };

      puzzleEle.onmousedown = event => {
        const firstLoc = windowToCanvas(cutEle, event.clientX, event.clientY);
        locRef.current = firstLoc;

        puzzleEle.onmousemove = handleMove;

        document.onmouseup = upEvent => {
          setLastDraw(() => handleMove(upEvent));
          const parentLoc = parentEle.getBoundingClientRect();
          const firstPoint = windowToCanvas(
            cutEle,
            parentLoc.left,
            parentLoc.top
          );
          const lastPoint = windowToCanvas(
            cutEle,
            parentLoc.right,
            parentLoc.bottom
          );
          const [one, two, three, four] = getPointByLoc(firstPoint, lastPoint);

          firstLocRef.current = one;
          secondLocRef.current = two;
          thirdLocRef.current = three;
          lastLocRef.current = four;
          removeMouse();
          document.onmouseup = null;
        };
      };

      return removeMouse;
    }

    if (puzzleEle) puzzleEle.style.cursor = '';

    return removeMouse;
  }, [isFinished, size, height]);

  const handlePointDown = (
    type: 0 | 1 | 2 | 3,
    direction?: 'horizontal' | 'vertical'
  ) => {
    const cutEle = cutRef.current as HTMLDivElement;
    const puzzleEle = puzzleRef.current as HTMLCanvasElement;
    const parentEle = parentRef.current as HTMLDivElement;
    const context = puzzleEle.getContext('2d') as CanvasRenderingContext2D;
    const toolsEle = toolsRef.current as HTMLDivElement;
    const toolsLoc = (toolsRef.current as HTMLDivElement).getBoundingClientRect();
    directionRef.current = direction;
    const firstLoc = [
      firstLocRef.current,
      secondLocRef.current,
      thirdLocRef.current,
      lastLocRef.current
    ][type];
    const t = [
      firstLocRef.current,
      secondLocRef.current,
      thirdLocRef.current,
      lastLocRef.current
    ][3 - type];

    const handleMove = (event: MouseEvent) => {
      const { height: parentH } = parentEle.getBoundingClientRect();
      // 不知道为啥有时候会触发互联网小球图标的拖动, 有点问题, 干掉
      event.preventDefault();
      event.stopPropagation();
      const curLoc = windowToCanvas(cutEle, event.clientX, event.clientY);
      setToolsLocEffect(puzzleEle, toolsEle, toolsLoc, parentH);
      if (direction) {
        if (direction === 'vertical') {
          const disY = curLoc.y - t.y;
          const lastLoc = {
            x: t.x,
            y: t.y + disY
          };

          return handleMoveEffect({
            firstLoc,
            lastLoc,
            puzzleEle,
            ratioRef,
            parentEle,
            context,
            image
          });
        } else {
          const disX = curLoc.x - t.x;
          const lastLoc = {
            x: t.x + disX,
            y: t.y
          };

          return handleMoveEffect({
            firstLoc,
            lastLoc,
            puzzleEle,
            ratioRef,
            parentEle,
            context,
            image
          });
        }
      }

      return handleMoveEffect({
        firstLoc,
        lastLoc: curLoc,
        puzzleEle,
        ratioRef,
        parentEle,
        context,
        image
      });
    };

    cutEle.onmousemove = handleMove;

    parentEle.onmousemove = handleMove;

    document.onmouseup = event => {
      setLastDraw(() => handleMove(event));
      let curLoc;
      if (directionRef.current === 'vertical') {
        curLoc = {
          x: t.x,
          y: windowToCanvas(cutEle, event.clientX, event.clientY).y
        };
      } else if (directionRef.current === 'horizontal') {
        curLoc = {
          x: windowToCanvas(cutEle, event.clientX, event.clientY).x,
          y: t.y
        };
      } else {
        curLoc = windowToCanvas(cutEle, event.clientX, event.clientY);
      }
      locRef.current = curLoc;
      const [one, two, three, four] = getPointByLoc(firstLoc, curLoc);

      firstLocRef.current = one;
      secondLocRef.current = two;
      thirdLocRef.current = three;
      lastLocRef.current = four;
      setFinished(true);
      cutEle.onmousemove = null;
      parentEle.onmousemove = null;
      document.onmouseup = null;
      directionRef.current = null;
    };
  };

  return (
    <div
      className="image-editor"
      style={{ height: height || '100vh', width: width || '100vw' }}
    >
      {src ? (
        <div className="img-box">
          <img src={src} width={size[0]} height={size[1]} alt="加载失败" />
          <div className="drag-box" ref={cutRef} />
          <div className="drag-parent" ref={parentRef}>
            <Canvas
              isFinished={isFinished}
              isSelected={isSelected}
              ref={puzzleRef}
              toolsRef={toolsRef}
              ratio={ratioRef.current}
              handleMouseDown={handlePointDown}
              handleSelect={setSelected}
              handleClose={handleClose}
              lastDraw={lastDraw}
            />
          </div>
          {!isFinished && (
            <div
              className="location"
              ref={locationBoxRef}
              onMouseMove={handleLocMove}
            >
              <canvas ref={locationRef} width="0" height="0" />
            </div>
          )}
        </div>
      ) : (
        <div className="hold">无图片</div>
      )}
    </div>
  );
};

ImageTools.defaultProps = {
  shouldResetAfterResize: true
};

export default ImageTools;
