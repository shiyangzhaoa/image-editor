import * as React from 'react';
import { forwardRef, useRef, useEffect, useState } from 'react';

import {
  useCombinedRefs,
  windowToCanvas,
  realWindowToCanvas,
  drawSvg,
  drawSvgOnCanvas,
  ILoc,
  drawLine,
  drawMosaic
} from './utils';
import Svg from './Svg';
import Tools from './Tools';

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
    const [info, setInfo] = useState<{ size: number; color: string }>({
      size: 4,
      color: '#f1f117'
    });
    const canvasRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, canvasRef) as any;
    const actionsRef = useRef<any[]>([]);
    const svgRef = useRef<SVGElement>(null);
    const infoRef = useRef<{ size: number; color: string }>({
      size: 4,
      color: '#f1f117'
    });
    const downLoc = useRef<ILoc>({ x: 0, y: 0 });
    const curInfo = useRef<{ size: number; color: string }>({
      size: 4,
      color: '#f1f117'
    });

    const handleMove = (moveEvent: MouseEvent) => {
      const svgEle = svgRef.current as SVGElement;
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      const curLoc = windowToCanvas(
        canvasEle,
        moveEvent.clientX,
        moveEvent.clientY
      );

      const [w, h] = drawSvg(downLoc.current, curLoc, svgEle);
      setSize([w, h]);
    };

    const handleRemove = (upEvent: MouseEvent, curType: 'rect' | 'circle') => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      const curLoc = windowToCanvas(
        canvasEle,
        upEvent.clientX,
        upEvent.clientY
      );
      const context = canvasEle.getContext('2d') as CanvasRenderingContext2D;

      actionsRef.current = [
        ...actionsRef.current,
        drawSvgOnCanvas(
          curType,
          downLoc.current,
          curLoc,
          context,
          ratio,
          infoRef.current
        )
      ];
      canvasEle.onmousemove = null;
      document.onmouseup = null;
    };

    const handleChange = (curType: string) => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      handleSelect(true);
      setType(curType);

      if (curType === 'rect' || curType === 'circle') {
        const svgEle = svgRef.current as SVGElement;
        canvasEle.onmousedown = event => {
          setEdit(true);
          downLoc.current = windowToCanvas(
            canvasEle,
            event.clientX,
            event.clientY
          );

          canvasEle.onmousemove = handleMove;

          document.onmouseup = upEvent => {
            setEdit(false);
            handleRemove(upEvent, curType);
            if (svgEle) svgEle.onmousemove = null;
          };
        };

        return;
      }

      if (curType === 'line') {
        let lastLoc: ILoc;
        canvasEle.onmousedown = event => {
          lastLoc = windowToCanvas(canvasEle, event.clientX, event.clientY);
          canvasEle.onmousemove = moveEvent => {
            const curLoc = realWindowToCanvas(
              canvasEle,
              moveEvent.clientX,
              moveEvent.clientY
            );
            const context = canvasEle.getContext(
              '2d'
            ) as CanvasRenderingContext2D;
            // 原生事件
            drawLine(lastLoc, curLoc, context, ratio, curInfo.current);
            lastLoc = curLoc;
          };

          document.onmouseup = () => {
            canvasEle.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }

      if (curType === 'mosaic') {
        canvasEle.onmousedown = () => {
          setEdit(true);

          canvasEle.onmousemove = event => {
            const curLoc = realWindowToCanvas(canvasEle, event.clientX, event.clientY);
            drawMosaic(
              canvasEle.getContext('2d'),
              curLoc.x * ratio,
              curLoc.y * ratio,
              infoRef.current.size * ratio
            );
          };

          document.onmouseup = () => {
            setEdit(false);
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

    useEffect(() => {
      if ((type === 'rect' || type === 'circle') && isEdit) {
        const svgEle = svgRef.current as SVGElement;
        svgEle.onmousemove = handleMove;

        return () => {
          svgEle.onmousemove = null;
        };
      }
    }, [type, isEdit, handleMove]);

    useEffect(() => {
      curInfo.current = info;
    }, [info]);

    return (
      <div className="drag-border">
        <canvas className="canvas" ref={combinedRef} width="0" height="0" />
        {(type === 'rect' || type === 'circle') && isEdit && (
          <Svg
            ref={svgRef}
            type={type}
            width={size[0]}
            height={size[1]}
            stroke={info.color}
            strokeWidth={info.size}
          />
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
