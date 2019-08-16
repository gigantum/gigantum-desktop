// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
// config
import FaqConfig from './FaqConfig';
// assets
import './Faq.scss';

type Props = {
  currentState: ''
};

export default class Faq extends Component<Props> {
  props: Props;

  state = {
    selectedQuestion: null
  };

  /**
    @param {Number} selectedQuestion
    handles question click
  */
  handleSelectQuestion = selectedQuestion => {
    const { state } = this;
    if (state.selectedQuestion === selectedQuestion) {
      this.setState({ selectedQuestion: null });
    } else {
      this.setState({ selectedQuestion });
    }
  };

  render() {
    const { props, state } = this;
    const questions = FaqConfig[props.currentState];
    return (
      <div className="Layout__Faq">
        {questions.map(({ question, answer }, index) => {
          const isSelected = index === state.selectedQuestion;
          const questionCSS = classNames({
            Faq__Question: true,
            'Faq__Question--first': index === 0,
            'Faq__Question--middle': index === 1,
            'Faq__Question--last': index === 2,
            'Faq__Question--selected': isSelected,
            'Faq__Question--notSelected':
              state.selectedQuestion !== null && !isSelected
          });
          return (
            <div>
              <div
                className={questionCSS}
                key={question}
                onClick={() => this.handleSelectQuestion(index)}
                onKeyDown={() => this.handleSelectQuestion(index)}
                tabIndex={index}
                role="button"
              >
                {question}
              </div>
              {isSelected && <div className="Faq__Answer">{answer}</div>}
            </div>
          );
        })}
      </div>
    );
  }
}
