import * as React from 'react';
import { forwardRef, useRef, useEffect, useState } from 'react';

import { useCombinedRefs, windowToCanvas, drawSvg, drawSvgOnCanvas } from './utils';
import Svg from './Svg';
import Tools from './tools';

interface IProps {
  isFinished: boolean;
  isSelected: boolean;
  toolsRef: React.RefObject<HTMLDivElement>;
  ratio: number;
  handleMouseDown: any;
  handleSelect: any;
  handleClose: any;
  lastDraw: () => void;
}

const Canvas = forwardRef<any, IProps>(
  (
    {
      isFinished,
      isSelected,
      toolsRef,
      ratio,
      handleMouseDown,
      handleSelect,
      handleClose,
      lastDraw
    },
    ref
  ) => {
    const [type, setType] = useState('');
    const [size, setSize] = useState<[number, number]>([0, 0]);
    const [isEdit, setEdit] = useState(false);
    const [info, setInfo] = useState<{ size: number, color: string }>({size: 4, color: '#f1f117'});
    const canvasRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, canvasRef) as any;
    const actionsRef = useRef<any[]>([]);
    const rectRef = useRef<SVGElement>(null);
    const infoRef = useRef<{ size: number, color: string }>({size: 4, color: '#f1f117'});
    const handleChange = (type: string) => {
      handleSelect(true);
      setType(type);

      if (type === 'rect' || type === 'circle') {
        const canvasEle = combinedRef.current as HTMLCanvasElement;
        canvasEle.onmousedown = event => {
          const firstLoc = windowToCanvas(
            canvasEle,
            event.clientX,
            event.clientY
          );

          canvasEle.onmousemove = moveEvent => {
            setEdit(true);
            const canvasEle = combinedRef.current as HTMLCanvasElement;
            const rectEle = rectRef.current as SVGElement;
            const curLoc = windowToCanvas(
              canvasEle,
              moveEvent.clientX,
              moveEvent.clientY
            );

            const [w, h] = drawSvg(firstLoc, curLoc, rectEle);
            setSize([w, h]);
          };

          document.onmouseup = upEvent => {
            setEdit(false);
            const canvasEle = combinedRef.current as HTMLCanvasElement;
            const curLoc = windowToCanvas(
              canvasEle,
              upEvent.clientX,
              upEvent.clientY
            );
            const context = canvasEle.getContext(
              '2d'
            ) as CanvasRenderingContext2D;

            actionsRef.current = [
              ...actionsRef.current,
              drawSvgOnCanvas(type, firstLoc, curLoc, context, ratio, infoRef.current)
            ];
            canvasEle.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    };
    const handleToolsClose = () => {
      handleClose();
      setType('');
      setSize([0, 0]);
      setEdit(false);
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      canvasEle.onmousedown = null;
      canvasEle.onmousemove = null;
      document.onmouseup = null;
    };

    useEffect(() => {
      infoRef.current = info;
    }, [info]);

    useEffect(() => {
      actionsRef.current = [lastDraw];
    }, [lastDraw]);

    return (
      <div className="drag-border">
        <canvas
          className="canvas"
          ref={combinedRef}
          width="0"
          height="0"
        />
        {(type === 'rect' || type === 'circle') && isEdit && (
          <Svg ref={rectRef} type={type} width={size[0]} height={size[1]} stroke={info.color} strokeWidth={info.size} />
        )}
        {isFinished && !isSelected && (
          <>
            <div
              className="left-top point"
              onMouseDown={() => handleMouseDown(3)}
            ></div>
            <div
              className="center-top point"
              onMouseDown={() => handleMouseDown(3, 'vertical')}
            ></div>
            <div
              className="right-top point"
              onMouseDown={() => handleMouseDown(2)}
            ></div>
            <div
              className="left-center point"
              onMouseDown={() => handleMouseDown(1, 'horizontal')}
            ></div>
            <div
              className="right-center point"
              onMouseDown={() => handleMouseDown(0, 'horizontal')}
            ></div>
            <div
              className="left-bottom point"
              onMouseDown={() => handleMouseDown(1)}
            ></div>
            <div
              className="center-bottom point"
              onMouseDown={() => handleMouseDown(0, 'vertical')}
            ></div>
            <div
              className="right-bottom point"
              onMouseDown={() => handleMouseDown(0)}
            ></div>
          </>
        )}
        {isFinished && (
          <Tools
            ref={toolsRef}
            type={type}
            info={info}
            onChange={handleChange}
            setInfo={setInfo}
            onClose={handleToolsClose}
          />
        )}
      </div>
    );
  }
);

export default Canvas;
