import React from 'react';
import { RetreatVoteReveal, RetreatVoteRevealProps } from './RetreatVoteReveal';

export type ResultBannerProps = RetreatVoteRevealProps;

export const ResultBanner: React.FC<ResultBannerProps> = (props) => {
  return <RetreatVoteReveal {...props} />;
};

export default ResultBanner;

