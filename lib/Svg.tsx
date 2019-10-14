import * as React from 'react';

interface IProps {
	type: 'rect' | 'circle';
	width: number;
	height: number;
	stroke?: string;
	strokeWidth?: number;
}

const Rect = React.forwardRef<any, IProps>(({ type, width, height, stroke, strokeWidth }, ref) => {
	return (
		<svg className="rect" width={width} height={height} xmlns="http://www.w3.org/2000/svg" ref={ref}>
			{type === 'rect' && (
				<rect width={width} height={height} stroke={stroke} fill="transparent" strokeWidth={strokeWidth} />
			)}
			{type === 'circle' && (
				<ellipse
					cx={width / 2}
					cy={height / 2}
					rx={width / 2}
					ry={height / 2}
					stroke={stroke}
					fill="transparent"
					strokeWidth={strokeWidth}
				/>
			)}
		</svg>
	);
});

Rect.defaultProps = {
	stroke: '#f1f117',
	strokeWidth: 4
};

export default Rect;
