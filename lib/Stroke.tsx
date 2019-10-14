import * as React from 'react';
import cx from 'classnames';

interface IProps {
	info: { size: number; color: string };
	onChange: ({ size, color }: { size?: number; color?: string }) => void;
}

const Stroke: React.FC<IProps> = ({ info, onChange }) => {
	return (
		<div className="image-editor-pop">
			<div
				className="size-item"
				onClick={() => onChange({ size: 4 })}
			>
				<div className={cx('stroke-small', { 'tools-size-selected': info.size === 4 })} />
			</div>
			<div className="size-item" onClick={() => onChange({ size: 8 })}>
				<div className={cx('stroke-default', { 'tools-size-selected': info.size === 8 })} />
			</div>
			<div className="size-item" onClick={() => onChange({ size: 16 })}>
				<div className={cx('stroke-large', { 'tools-size-selected': info.size === 16 })} />
			</div>
			<div className={cx('color-item color-yellow', { 'tools-color-selected': info.color === '#f1f117' })} onClick={() => onChange({ color: '#f1f117' })} />
			<div className={cx('color-item color-red', { 'tools-color-selected': info.color === '#f71f1f' })} onClick={() => onChange({ color: '#f71f1f' })} />
			<div className={cx('color-item color-green', { 'tools-color-selected': info.color === '#30ca30' })} onClick={() => onChange({ color: '#30ca30' })} />
			<div className={cx('color-item color-blue', { 'tools-color-selected': info.color === '#31e9f9' })} onClick={() => onChange({ color: '#31e9f9' })} />
		</div>
	);
};

export default Stroke;
