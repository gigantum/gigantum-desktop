// @flow
// vendor
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// css
import './CircularProgress.scss';

type Props = {
  progress: number,
  text: string
};

const styles = buildStyles({
  strokeLinecap: 'butt',
  textSize: '24px',
  textColor: '#9b9c9e',
  trailColor: '#e3e4e5',
  pathColor: '#386e80'
});

const CircularProgress = ({ progress, text }: Props) => (
  <div className="Layout__Status CircularProgress">
    <div className="CircularProgress__body">
      <CircularProgressbar
        value={progress}
        text={`${Math.floor(progress)}%`}
        styles={styles}
      />
      <div className="CircularProgress__message">{text}</div>
    </div>
  </div>
);

export default CircularProgress;
