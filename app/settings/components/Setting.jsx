// @flow
import React, { PureComponent } from 'react';

type Props = {
  css: '',
  listAction: () => void,
  itemAction: () => void,
  visible: boolean,
  currentText: string,
  options: array,
  settingsText: string
};

export default class Setting extends PureComponent<Props> {
  props: Props;

  render() {
    const { props } = this;
    const {
      css,
      listAction,
      itemAction,
      visible,
      currentText,
      options,
      settingsText
    } = props;

    return (
      <div className="Preferences__setting">
        <div className="Preferences__text">{settingsText}</div>
        <div
          className={css}
          onClick={listAction}
          onKeyDown={listAction}
          role="button"
          tabIndex="0"
        >
          {currentText}
          <ul className="Dropdown__menu">
            {visible &&
              options.map(item => (
                <li
                  className="Dropdown__item"
                  key={item}
                  role="menuitem"
                  onClick={() => itemAction(item)}
                  onKeyDown={() => itemAction(item)}
                >
                  {item}
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
