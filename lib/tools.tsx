import * as React from 'react';
import { forwardRef, useState } from 'react';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import cx from 'classnames';

import { useCombinedRefs } from './utils';
import Stroke from './Stroke';
import Confirm from './confirm.svg';

interface IProps {
	type: string;
	info: { size: number; color: string };
	onChange: (type: string, options?: { color?: string; size?: number }) => void;
	onClose: () => void;
	setInfo: any;
}

const Tools = forwardRef<HTMLDivElement, IProps>(({ info, onChange, onClose, type, setInfo }, ref) => {
	const [ selected, setSelected ] = useState('');
	const [ position, setPosition ] = useState<any>('bottom');
	const toolsRef = React.useRef(null);
	const combinedRef = useCombinedRefs(ref, toolsRef) as any;
	const handleClick = (type: string) => {
		const pos = (combinedRef.current as HTMLDivElement).getBoundingClientRect();
		if (pos.bottom >= window.innerHeight - pos.height - 5) {
			setPosition('top');
		} else {
			setPosition('bottom');
		}
		onChange(type);
		setSelected(type);
	};
	const handleClose = () => {
		onClose();
		setSelected('');
	};

	return (
		<div className="tools" ref={combinedRef}>
			<Popover
				position={position}
				align="start"
				isOpen={selected === 'rect'}
				content={({ position, targetRect, popoverRect }) => (
					<ArrowContainer
						position={position}
						targetRect={targetRect}
						popoverRect={popoverRect}
						arrowColor={'#272323'}
						arrowSize={5}
					>
						<Stroke
							info={info}
							onChange={(options) =>
								setInfo((opt: { size?: number; color?: string }) => ({ ...opt, ...options }))}
						/>
					</ArrowContainer>
				)}
			>
				<div
					className={cx('tools-item tools-rect', { 'tool-selected': type === 'rect' })}
					onClick={() => handleClick('rect')}
				/>
			</Popover>
			<Popover
				position={position}
				align="start"
				isOpen={selected === 'circle'}
				content={({ position, targetRect, popoverRect }) => (
					<ArrowContainer
						position={position}
						targetRect={targetRect}
						popoverRect={popoverRect}
						arrowColor={'#272323'}
						arrowSize={5}
					>
						<Stroke
							info={info}
							onChange={(options) =>
								setInfo((opt: { size?: number; color?: string }) => ({ ...opt, ...options }))}
						/>
					</ArrowContainer>
				)}
			>
				<div
					className={cx('tools-item tools-circle', { 'tool-selected': type === 'circle' })}
					onClick={() => handleClick('circle')}
				/>
			</Popover>
      <Popover
				position={position}
				align="start"
				isOpen={selected === 'line'}
				content={({ position, targetRect, popoverRect }) => (
					<ArrowContainer
						position={position}
						targetRect={targetRect}
						popoverRect={popoverRect}
						arrowColor={'#272323'}
						arrowSize={5}
					>
						<Stroke
							info={info}
							onChange={(options) =>
								setInfo((opt: { size?: number; color?: string }) => ({ ...opt, ...options }))}
						/>
					</ArrowContainer>
				)}
			>
        <div
          className={cx('tools-item tools-text', { 'tool-selected': type === 'line' })}
          onClick={() => handleClick('line')}
        >L</div>
			</Popover>
			<div className="tools-item tools-text">M</div>
			<div className="hold" />
			<div className="tools-item tools-text">C</div>
			<div className="tools-item tools-text">D</div>
			<div className="tools-item close" onClick={handleClose}>
				X
			</div>
			<Confirm className="tools-item" />
		</div>
	);
});

export default Tools;
