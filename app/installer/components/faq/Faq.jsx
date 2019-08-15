// @flow
import React, { Component } from 'react';
// config
import FaqConfig from './FaqConfig';
// assets
import './Faq.scss';

type Props = {
  currentState: ''
};

export default class Faq extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    const questions = FaqConfig[props.currentState];
    return (
      <div className="Layout__Faq">
        {questions.map(({ question }) => (
          <div className="Faq__Question" key={question}>
            {question}
          </div>
        ))}
      </div>
    );
  }
}
