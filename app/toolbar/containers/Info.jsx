// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../redux/constants/routes';
// assets
import './Info.scss';

type Props = {
  children: React.Node
};

export default class Info extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <div data-tid="container">
        <nav>
          <Link to={routes.MAIN}>Back</Link>
        </nav>
        <React.Fragment>{children}</React.Fragment>
      </div>
    );
  }
}
