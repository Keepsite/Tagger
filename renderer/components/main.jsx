import React from "react";
import PropTypes from "prop-types";

import { Panel, Button } from "react-bootstrap";

class Main extends React.Component {
  static propTypes = {
    command: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.command("load");
  }

  render() {
    const { command } = this.props;

    return (
      <div>
        <Panel>
          <Panel.Body>TODO</Panel.Body>
        </Panel>
        <Panel>
          <Panel.Body>
            <Button onClick={() => command("newRepo")}>New Repository</Button>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default Main;
