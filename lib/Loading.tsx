import * as React from 'react';

interface IProps {
  width: number | string;
  height: number | string;
}

const Loading: React.FC<IProps> = (size) => (
  <svg className="image-editor-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" style={{...size}}>
    <filter id="b">
      <feGaussianBlur stdDeviation="12" />
    </filter>
    <path fill="#817c70" d="M0 0h2000v2000H0z" />
    <g
      filter="url(#b)"
      transform="translate(4 4) scale(7.8125)"
      fillOpacity=".5"
    >
      <ellipse
        fill="#000210"
        rx="1"
        ry="1"
        transform="matrix(50.41098 -3.7951 11.14787 148.07886 107 194.6)"
      />
      <ellipse
        fill="#eee3bb"
        rx="1"
        ry="1"
        transform="matrix(-56.38179 17.684 -24.48514 -78.06584 205 110.1)"
      />
      <ellipse
        fill="#fff4bd"
        rx="1"
        ry="1"
        transform="matrix(35.40604 -5.49219 14.85017 95.73337 16.4 123.6)"
      />
      <ellipse fill="#79c7db" cx="21" cy="39" rx="65" ry="65" />
      <ellipse fill="#0c1320" cx="117" cy="38" rx="34" ry="47" />
      <ellipse
        fill="#5cb0cd"
        rx="1"
        ry="1"
        transform="matrix(-39.46201 77.24476 -54.56092 -27.87353 219.2 7.9)"
      />
      <path fill="#e57339" d="M271 159l-123-16 43 128z" />
      <ellipse fill="#47332f" cx="214" cy="237" rx="242" ry="19" />
    </g>
  </svg>
);

export default Loading;
