// @flow
// vendor
import React, { Component } from 'react';
import { clipboard } from 'electron';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
// css
import './Row.scss';

type Props = {
  server: {
    base_url: string,
    name: string
  }
};

const truncate = (text, length) => {
  if (text === undefined) {
    return '';
  }

  if (text.length > length) {
    const slicedText = text.slice(0, length);
    text = `${slicedText}...`;
  }

  return text;
};

class Row extends Component<Props> {
  state = {
    copied: false,
    isButtonHidden: true
  };

  componentDidUpdate() {
    const { isButtonHidden } = this.state;
    if (!isButtonHidden) {
      ReactTooltip.hide(this.tooltipRef);
      ReactTooltip.show(this.tooltipRef);
      ReactTooltip.rebuild();
    }
  }

  uuid = uuidv4();

  /**
   * method copies text to clipboard
   * @param {string} text
   */
  copyLink = text => {
    if (text && text.length > 0) {
      clipboard.writeText(text);

      this.setState({ copied: true });

      setTimeout(() => {
        this.setState({ copied: false });
      }, 3000);
    }
  };

  /**
   * method hides button on mouse over
   * sets state of isButtonHidden
   */
  hideButton = () => {
    this.setState({
      isButtonHidden: true,
      copied: false
    });
    ReactTooltip.hide(this.tooltipRef);
  };

  /**
   * method shows button on mouse over
   * sets state of isButtonHidden
   */
  showButton = () => {
    this.setState({
      isButtonHidden: false
    });
    ReactTooltip.show(this.tooltipRef);
  };

  render() {
    const { copied, isButtonHidden } = this.state;
    const { server } = this.props;
    const { name } = server;
    const baseUrl = server.base_url;
    const tooltipText = copied ? 'Copied!' : baseUrl;
    // declare css here
    const buttonCSS = classNames({
      'Btn Row__button': true,
      hidden: isButtonHidden,
      'Row__button--copied': copied
    });
    const tooltipCSS = classNames({
      'Tooltip Row__tooltip': true,
      'Row__tooltip--copied': copied
    });
    return (
      <tr className="Row">
        <td>{name}</td>
        <td
          className="flex justify--space-between align-items--center relative"
          onMouseOver={this.showButton}
          onMouseOut={this.hideButton}
          onFocus={() => {}}
          onBlur={() => {}}
          role="presentation"
        >
          <p
            className="relative"
            ref={ref => {
              this.tooltipRef = ref;
            }}
            data-for={this.uuid}
            data-tip={tooltipText}
            onClick={() => this.copyLink(baseUrl)}
            role="presentation"
          >
            {truncate(baseUrl, 24)}
          </p>
          <div className="Row__container flex justify--center">
            <ReactTooltip
              className={tooltipCSS}
              effect="solid"
              getContent={() => tooltipText}
              id={this.uuid}
              multiline={false}
              place="top"
              delayUpdate={100}
            />
          </div>
          <button
            className={buttonCSS}
            type="button"
            onClick={() => this.copyLink(baseUrl)}
          />
        </td>
      </tr>
    );
  }
}

export default Row;
