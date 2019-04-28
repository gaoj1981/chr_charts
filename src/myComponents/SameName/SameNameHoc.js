import React, { Component } from 'react';

const SameNameHoc = WrappedComponent =>
  class extends Component {
    componentWillMount() {}

    handleClose = () => {
      const { visibleChange } = this.props;
      visibleChange(false);
    };

    handlePageChange = pagination => {
      let current = pagination;
      current -= 1;
      console.log(current);
    };

    render() {
      const props = {
        ...this.props,
        handleClose: this.handleClose,
        handlePageChange: this.handlePageChange,
      };
      return <WrappedComponent {...props} />;
    }
  };
export default SameNameHoc;
