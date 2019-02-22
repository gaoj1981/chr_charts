import { Component } from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

/* eslint-disable */
export default class BasicLayout extends Component {
  render() {
    return (
      <Layout>
        <Content style={{ margin: '16px 16px 0' }}>
          <div style={{ padding: 16, background: '', minHeight: 360 }}>{this.props.children}</div>
        </Content>
      </Layout>
    );
  }
}
