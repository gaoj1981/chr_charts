import React, { Component } from 'react';

const MyDrawerHoc = WrappedComponent =>
  class extends Component {
    componentWillMount() {}

    handleClose = () => {
      const { visibleChange } = this.props;
      visibleChange(false);
    };

    render() {
      const props = {
        ...this.props,
        handleClose: this.handleClose,
      };
      return <WrappedComponent {...props} />;
    }
  };
export default MyDrawerHoc;
