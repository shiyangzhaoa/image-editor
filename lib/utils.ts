import { useEffect, useRef } from 'react';

export interface ILoc {
  x: number;
  y: number;
}

export const rgb2hex = (r: number, g: number, b: number) => {
  const str1 = r.toString(16);
  const str2 = g.toString(16);
  const str3 = b.toString(16);
  return `#${str1.length < 2 ? '0' + str1 : str1}${
    str2.length < 2 ? '0' + str2 : str2
  }${str3.length < 2 ? '0' + str3 : str3}`;
};

export const getLocInfo = (firstLoc: ILoc, lastLoc: ILoc) => {
  let x: number;
  let y: number;
  if (lastLoc.x < firstLoc.x) {
    x = lastLoc.x;
  } else {
    x = firstLoc.x;
  }

  if (lastLoc.y < firstLoc.y) {
    y = lastLoc.y;
  } else {
    y = firstLoc.y;
  }

  const w = Math.abs(lastLoc.x - firstLoc.x);
  const h = Math.abs(lastLoc.y - firstLoc.y);

  return [x, y, w, h];
};

/** 获取长宽 */
export const getWidthAndHeight = (
  image: HTMLImageElement,
  width = window.innerWidth,
  height = window.innerHeight
): [number, number] => {
  const t = image.width / image.height;
  if (height < image.height || width < image.width) {
    const ws = image.width / width;
    const hs = image.height / height;

    if (ws <= hs) {
      return [Math.floor(height * t), Math.floor(height)];
    } else {
      return [Math.floor(width), Math.floor(width / t)];
    }
  }

  return [Math.floor(image.width), Math.floor(image.height)];
};

/** 获取鼠标坐标, 相对 canvas */
export const windowToCanvas = (ele: HTMLElement, x: number, y: number) => {
  const box = ele.getBoundingClientRect();
  let curX: number;
  let curY: number;

  if (x > box.right) {
    curX = box.width;
  } else if (x < box.left) {
    curX = 0;
  } else {
    curX = x - box.left;
  }

  if (y > box.bottom) {
    curY = box.height;
  } else if (y < box.top) {
    curY = 0;
  } else {
    curY = y - box.top;
  }

  return {
    x: curX,
    y: curY
  };
};

export const realWindowToCanvas = (ele: HTMLElement, x: number, y: number) => {
  const box = ele.getBoundingClientRect();

  return {
    x: x - box.left,
    y: y - box.top
  };
};

/** imageData => 渲染, putImageData性能比较差, 头疼(暂时不需要, 但这个处理canvas的还是保留了) */
export const drawImgCanvas = (
  puzzleEle: HTMLCanvasElement,
  box: HTMLCanvasElement,
  startRow: number,
  startCol: number,
  w: number,
  h: number,
  size: number[]
) => {
  const imgContext = puzzleEle.getContext('2d') as CanvasRenderingContext2D;
  const boxImgData = (box.getContext(
    '2d'
  ) as CanvasRenderingContext2D).getImageData(0, 0, size[0], size[1]);
  puzzleEle.width = w;
  puzzleEle.height = h;

  if (w === 0 || h === 0) {
    return;
  }

  const { data } = boxImgData;
  const imgData = imgContext.getImageData(0, 0, w, h);

  let i = 0;
  for (let col = 0; col < size[1]; col++) {
    for (let row = 0; row < size[0]; row++) {
      if (
        col > startCol &&
        col <= startCol + h &&
        row > startRow &&
        row <= startRow + w
      ) {
        const index = (col * size[0] + row) * 4;
        imgData.data[i] = data[index];
        imgData.data[i + 1] = data[index + 1];
        imgData.data[i + 2] = data[index + 2];
        imgData.data[i + 3] = data[index + 3];

        i += 4;
      }
    }
  }

  imgContext.clearRect(0, 0, w, h);
  imgContext.putImageData(imgData, 0, 0, 0, 0, w, h);
};

export const handleMoveEffect = ({
  firstLoc,
  lastLoc,
  puzzleEle,
  ratioRef,
  parentEle,
  context,
  image
}: {
  firstLoc: ILoc;
  lastLoc: ILoc;
  puzzleEle: HTMLCanvasElement;
  ratioRef: React.RefObject<any>;
  parentEle: HTMLDivElement;
  context: any;
  image: HTMLImageElement;
}) => {
  const [x, y, w, h] = getLocInfo(firstLoc, lastLoc);

  puzzleEle.width = w * ratioRef.current;
  puzzleEle.height = h * ratioRef.current;
  Object.assign(puzzleEle.style, {
    width: `${w}px`,
    height: `${h}px`
  });
  Object.assign(parentEle.style, {
    top: `${y}px`,
    left: `${x}px`
  });

  const draw = () => {
    context.drawImage(
      image,
      x * ratioRef.current,
      y * ratioRef.current,
      w * ratioRef.current,
      h * ratioRef.current,
      0,
      0,
      w * ratioRef.current,
      h * ratioRef.current
    );
  };

  draw();

  return draw;
};

export const getPointByLoc = (firstLoc: ILoc, curLoc: ILoc) => {
  const { x: x1, y: y1 } = firstLoc;
  const { x: x2, y: y2 } = curLoc;

  if (x2 >= x1 && y2 >= y1) {
    return [
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x1, y: y2 },
      { x: x2, y: y2 }
    ];
  }

  if (x2 >= x1 && y2 < y1) {
    return [
      { x: x1, y: y2 },
      { x: x2, y: y2 },
      { x: x1, y: y1 },
      { x: x2, y: y1 }
    ];
  }

  if (x2 < x1 && y2 >= y1) {
    return [
      { x: x2, y: y1 },
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 }
    ];
  }

  return [
    { x: x2, y: y2 },
    { x: x1, y: y2 },
    { x: x2, y: y1 },
    { x: x1, y: y1 }
  ];
};

export const setToolsLocEffect = (
  puzzleEle: HTMLCanvasElement,
  toolsEle: HTMLDivElement,
  toolsLoc: any,
  parentH: number
) => {
  const puzzleInfo = puzzleEle.getBoundingClientRect();

  if (puzzleInfo.top >= window.innerHeight - parentH - toolsLoc.height - 16) {
    Object.assign(toolsEle.style, { bottom: '16px' });
  } else {
    Object.assign(toolsEle.style, {
      bottom: `${-16 - toolsLoc.height}px`
    });
  }

  if (puzzleInfo.left <= toolsLoc.width - puzzleInfo.width) {
    Object.assign(toolsEle.style, { left: '0px', right: 'unset' });
  } else {
    Object.assign(toolsEle.style, { right: '0px', left: 'unset' });
  }
};

export const useCombinedRefs = (...refs: any) => {
  const targetRef = useRef(null);

  useEffect(() => {
    refs.forEach((ref: any) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

export const drawHorizontalLine = (context: CanvasRenderingContext2D) => {
  context.strokeStyle = '#30ca30';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, context.canvas.height / 2 + 0.5);
  context.lineTo(context.canvas.width, context.canvas.height / 2 + 0.5);
  context.stroke();
};

export const drawVerticalLine = (context: CanvasRenderingContext2D) => {
  context.strokeStyle = '#30ca30';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(context.canvas.width / 2 + 0.5, 0);
  context.lineTo(context.canvas.width / 2, context.canvas.height);
  context.stroke();
};

export const drawLocCanvas = ({
  image,
  box,
  ele,
  loc,
  ratioRef,
  event,
  size = 10
}: {
  image: HTMLImageElement;
  box: HTMLDivElement;
  ele: HTMLCanvasElement;
  loc: ILoc;
  ratioRef: React.RefObject<any>;
  event: React.MouseEvent | MouseEvent,
  size?: number;
}) => {
  const context = ele.getContext('2d') as CanvasRenderingContext2D;
  const boxLoc = box.getBoundingClientRect();
  ele.width = size * 10;
  ele.height = size * 10;
  if (window.innerWidth - event.clientX - boxLoc.width - 16 <= 0) {
    box.style.left = `${loc.x - boxLoc.width - 16}px`;
  } else {
    box.style.left = `${loc.x + 16}px`;
  }

  if (window.innerHeight - event.clientY - boxLoc.height - 16 <= 0) {
    box.style.top = `${loc.y - boxLoc.height - 16}px`;
  } else {
    box.style.top = `${loc.y + 16}px`;
  }

  context.drawImage(
    image,
    (loc.x - size) * ratioRef.current,
    (loc.y - size) * ratioRef.current,
    size * ratioRef.current * 2,
    size * ratioRef.current * 2,
    0,
    0,
    size * 10,
    size * 10
  );
  drawHorizontalLine(context);
  drawVerticalLine(context);
};

export const drawSvg = (firstLoc: ILoc, lastLoc: ILoc, svgEle: SVGElement) => {
  const [x, y, w, h] = getLocInfo(firstLoc, lastLoc);

  svgEle.style.left = `${x}px`;
  svgEle.style.top = `${y}px`;

  return [w, h];
};

export const drawSvgOnCanvas = (
  type: 'rect' | 'circle',
  firstLoc: ILoc,
  lastLoc: ILoc,
  context: CanvasRenderingContext2D,
  ratio: number,
  info: { size: number; color: string }
) => {
  const [x, y, w, h] = getLocInfo(firstLoc, lastLoc);

  const draw = () => {
    context.beginPath();
    const linW = info.size / 2;
    if (type === 'rect') {
      context.lineJoin = 'round';
      context.rect(
        x * ratio + linW,
        y * ratio + linW,
        w * ratio - info.size,
        h * ratio - info.size
      );
    } else {
      context.ellipse(
        x * ratio + (w / 2) * ratio,
        y * ratio + (h / 2) * ratio,
        (w / 2) * ratio,
        (h / 2) * ratio,
        0,
        0,
        2 * Math.PI
      );
    }
    context.strokeStyle = info.color;
    context.lineWidth = info.size * ratio;
    context.stroke();
    context.closePath();
  };

  draw();

  return draw;
};

export const drawLine = (
  lastLoc: ILoc,
  curLoc: ILoc,
  context: CanvasRenderingContext2D,
  ratio: number,
  info: { size: number; color: string }
) => {
  context.beginPath();
  context.moveTo(lastLoc.x * ratio, lastLoc.y * ratio);
  context.lineTo(curLoc.x * ratio, curLoc.y * ratio);
  context.lineWidth = info.size * ratio;
  context.strokeStyle = info.color;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
};

export const drawMosaic = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  // 画笔宽度, 先不做这个功能
  trackSize = 0
) => {
  const pointList: { x: number; y: number, color: string}[] = [];
  const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  const w = Math.ceil(context.canvas.width / size);
  const h = Math.ceil(context.canvas.height / size);
  const startRow = Math.max(0, Math.floor((x - trackSize) / size));
  let startCol = Math.max(0, Math.floor((y - trackSize) / size));
  const endRow = Math.min(w, Math.ceil(x + trackSize) / size);
  const endCol = Math.min(h, Math.ceil(y + trackSize) / size);
  while (startCol < endCol) {
    let row = startRow;
    while (row < endRow) {
      row += 1;
      const index = startCol * w + row;
      const locX = index % w - 1;
      const locY = Math.floor(index / w);

      const dataIndex = Math.floor(locY * size) * context.canvas.width + Math.floor(locX * size);
      const r = imgData.data[dataIndex * 4];
      const g = imgData.data[dataIndex * 4 + 1];
      const b = imgData.data[dataIndex * 4 + 2];
      const color = rgb2hex(r, g, b);
      if (!pointList.find(point => point.x === locX && point.y === locY)) {
        pointList.push({ x: locX, y: locY, color });
      }
    }
    startCol += 1;
  }

  pointList.forEach(point => {
    context.fillStyle = point.color;
    context.fillRect(point.x * size, point.y * size, size, size);
  });
};
