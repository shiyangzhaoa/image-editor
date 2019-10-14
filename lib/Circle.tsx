import * as React from 'react';

interface IProps {
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
}

const CirCle = React.forwardRef<any, IProps>(({ width, height, stroke, strokeWidth }, ref) => {
	return (
		<svg className="rect" width={width} height={height} xmlns="http://www.w3.org/2000/svg" ref={ref}>
      <circle cx={width} cy={height} r={width} stroke={stroke} fill="transparent" strokeWidth={strokeWidth} />
		</svg>
	);
});

CirCle.defaultProps = {
  stroke: 'yellow',
  strokeWidth: 4
}

export default CirCle;
