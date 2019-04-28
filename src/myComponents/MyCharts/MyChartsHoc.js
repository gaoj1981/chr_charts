import React, { Component } from 'react';

const MyChartsHoc = WrappedComponent =>
  class extends Component {
    componentDidMount() {
      const { form } = this.props;
      const { validateFields } = form;
      validateFields((err, values) => {
        console.log(values);
      });
    }

    componentWillReceiveProps() {
      console.log(3333);
    }

    render() {
      const { getAnalyze } = this.props;
      console.log(getAnalyze);
      const props = {
        ...this.props,
      };
      return <WrappedComponent {...props} />;
    }
  };

export default MyChartsHoc;
