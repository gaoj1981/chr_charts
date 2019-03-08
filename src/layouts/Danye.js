import { Component } from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

/* eslint-disable */
export default class BasicLayout extends Component {
  render() {
    return (
      <Content>
        <div style={{ padding: 16, background: '', minHeight: 360 }}>{this.props.children}</div>
      </Content>
    );
  }
}
