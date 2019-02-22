import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { saveAs } from 'file-saver';
import { Form, Row, Col, Button, Select, Card, message, InputNumber, Icon, Tabs, Spin } from 'antd';
import moment from 'moment';
import PieChart from './charts/PieChart';
import OverPillar from './charts/OverPillar';
import GrupInput from './charts/GrupInput';

const OfflineData = React.lazy(() => import('./charts/OfflineData'));
const monthFormat = 'YYYY-MM';
const { Option } = Select;
const { TabPane } = Tabs;

@Form.create()
@connect(({ charts }) => ({
  getLingJian: charts.getLingJian,
  getAnalyze: charts.getAnalyze,
  groupResult: charts.groupResult,
  getHost: charts.getHost,
  zone: charts.zone,
}))
class Index extends Component {
  state = {
    expand: false,
    tabType: '1',
    myLoading: 0,
  };

  componentDidMount() {
    this.getHost();
  }

  getHost = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'charts/reqCommon',
      service: 'getHost',
    });
  };

  getFields() {
    const { expand, myLoading } = this.state;
    const { form } = this.props;
    const count = expand ? 6 : 3;
    const { getFieldDecorator } = form;
    const children = [];
    const titleArr = ['hosts', '零件', '日期'];
    const NameArr = ['hosts', 'lingjian', 'day'];
    titleArr.forEach((v, i) => {
      children.push(
        <Col span={i < 2 ? 4 : 10} key={v} style={{ display: i < count ? 'block' : 'none' }}>
          {i === 2 ? (
            <Form.Item>
              {getFieldDecorator(NameArr[i], {
                rules: [
                  {
                    required: i < 2,
                    message: 'required!',
                  },
                ],
              })(this.filterChild(i))}
            </Form.Item>
          ) : (
            <Form.Item>
              {getFieldDecorator(NameArr[i], {
                rules: [
                  {
                    required: i < 2,
                    message: 'required!',
                  },
                ],
              })(this.filterChild(i))}
            </Form.Item>
          )}
        </Col>
      );
    });
    children.push(
      <Col key="searchsclear" span={6} style={{ textAlign: 'center', marginTop: 5 }}>
        <Button icon="search" type="primary" htmlType="submit">
          Search
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={this.handleReset} disabled={myLoading === 1}>
          Clear
        </Button>
      </Col>
    );
    return children;
  }

  filterChild = index => {
    const { form } = this.props;
    let children = null;
    switch (index) {
      case 0:
        children = <Select onChange={this.handleHost}>{this.fileOption(0)}</Select>;
        break;
      case 1:
        children = <Select onChange={this.handleStyle}>{this.fileOption(1)}</Select>;
        break;
      case 2:
        // children= <RangePicker format="YYYY-MM-DD" />;
        children = <GrupInput form={form} />;
        break;
      case 3:
        children = <InputNumber onChane={() => this.handleStar()} style={{ width: '100%' }} />;
        break;
      case 4:
        children = <InputNumber style={{ width: '100%' }} />;
        break;
      case 5:
        children = <InputNumber style={{ width: '100%' }} />;
        break;
      default:
        break;
    }
    return children;
  };

  fileOption = types => {
    const optionData = [];
    if (types === 1) {
      const { getLingJian } = this.props;
      const set = new Set(getLingJian);
      if (set) {
        set.forEach((v, i) => {
          optionData.push(
            <Option value={i} key={v}>
              {v}
            </Option>
          );
        });
      }
    } else {
      const { getHost } = this.props;
      const set = new Set(getHost);
      if (set) {
        set.forEach((v, i) => {
          optionData.push(
            <Option value={i} key={v}>
              {v}
            </Option>
          );
        });
      }
    }
    return optionData;
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (err) return;
      this.cleanDate();
      const parm = {
        hosts: [values.hosts],
        partStyle: values.lingjian,
        start: values.days ? `${values.days[0].format('YYYY-MM-DD')} 00:00:00` : null,
        end: values.days ? `${values.days[1].format('YYYY-MM-DD')} 23:59:59` : null,
        scanScope: values.Minimum ? [Number(values.Minimum), Number(values.Maximum)] : null,
        limit: values.lastimum || null,
      };
      if (values.mayDay) {
        let { mayDay } = values;
        if (mayDay < 10) mayDay = `0${mayDay}`;
        parm.start = `${moment(values.month, monthFormat).format('YYYY-MM')}-${mayDay} 00:00:00`;
        parm.end = `${moment(values.month, monthFormat).format('YYYY-MM')}-${mayDay} 23:59:59`;
      }
      if (values.monthDay) {
        parm.start = `${values.monthDay.format('YYYY-MM-DD')} 00:00:00`;
        parm.end = `${values.monthDay.format('YYYY-MM-DD')} 23:59:59`;
      }
      this.getGroupResult(parm);
    });
  };

  handleStar = () => {
    const { form } = this.props;
    const { resetFields } = form;
    resetFields();
  };

  // 饼图数据
  getGroupResult = parm => {
    this.setState({
      myLoading: 1,
    });
    const { dispatch } = this.props;
    const groupParm = {
      hosts: parm.hosts,
      partStyle: '',
      start: parm.start,
      end: parm.end,
      scanScope: parm.scanScope,
      limit: parm.limit,
    };
    dispatch({
      type: 'charts/reqCommon',
      service: 'getGroupResult',
      payload: groupParm,
      callback: () => {
        const { groupResult } = this.props;
        if (!groupResult[0]) {
          message.warning('data not exists');
        } else {
          this.getZone(parm);
        }
      },
    });
  };

  getZone = parmZone => {
    const { dispatch } = this.props;
    dispatch({
      type: 'charts/reqCommon',
      service: 'getZone',
      payload: parmZone,
      callback: () => {
        const { zone } = this.props;
        if (!zone[0]) {
          message.warning('data not exists');
        } else {
          this.getAnalyze(parmZone);
        }
      },
    });
  };

  getAnalyze = parm => {
    const { dispatch } = this.props;
    dispatch({
      type: 'charts/reqCommon',
      service: 'getAnalyze',
      payload: parm,
      callback: () => {
        const { getAnalyze } = this.props;
        if (!getAnalyze[0]) {
          message.warning('data not exists');
        }
        this.setState({
          myLoading: 0,
        });
      },
    });
  };

  handleReset = () => {
    const { form } = this.props;
    const { resetFields } = form;
    resetFields();
    this.cleanDate();
  };

  handleHost = value => {
    this.handleReset();
    const { dispatch } = this.props;
    const hosts = { hosts: value };
    dispatch({
      type: 'charts/reqCommon',
      service: 'getLingJian',
      payload: hosts,
    });
  };

  handleStyle = () => {
    this.cleanDate();
  };

  handleCSV = () => {
    let csvArr = 'avg,3STDEV+,3STDEV-,zone_Max,zone_Min';
    const { getAnalyze, zone } = this.props;
    const thisDate = `Width_${this.getTimeFormatter()}.csv`;
    if (getAnalyze[0]) {
      getAnalyze.forEach(v => {
        csvArr += `\n${v.h},${v.H[0]},${v.H[1]},${zone[0].zones[v.z].width.maximum},${
          zone[0].zones[v.z].width.minimum
        },`;
      });
      const blob = new Blob([csvArr], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, thisDate);
    }
  };

  handleCSVHigth = () => {
    let csvArr = 'avg,3STDEV+,3STDEV-,zone_Max,zone_Min';
    const { getAnalyze, zone } = this.props;
    if (getAnalyze[0]) {
      const thisDate = `Height_${this.getTimeFormatter()}.csv`;
      getAnalyze.forEach(v => {
        csvArr += `\n${v.h},${v.H[0]},${v.H[1]},${zone[0].zones[v.z].height.maximum},${
          zone[0].zones[v.z].height.minimum
        },`;
      });
      const blob = new Blob([csvArr], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, thisDate);
    }
  };

  handleCSVV = () => {
    let csvArr = 'avg,3STDEV+,3STDEV-,zone_Max,zone_Min';
    const { getAnalyze, zone } = this.props;
    if (getAnalyze[0]) {
      const thisDate = `Volume_${this.getTimeFormatter()}.csv`;
      getAnalyze.forEach(v => {
        csvArr += `\n${v.v},${v.V[0]},${v.V[1]},${zone[0].zones[v.z].volume.maximum},${
          zone[0].zones[v.z].volume.minimum
        },`;
      });
      const blob = new Blob([csvArr], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, thisDate);
    }
  };

  handleHeGeCSV = () => {
    let csvArr = 'name,pass,fail';
    const { groupResult } = this.props;
    if (groupResult[0]) {
      const thisDate = `Pass_${this.getTimeFormatter()}.csv`;
      groupResult.forEach(v => {
        csvArr += `\n${v.partStyle},${v.Pass},${v.Fail},`;
      });
      const blob = new Blob([csvArr], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, thisDate);
    }
  };

  getTimeFormatter = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hh = now.getHours();
    const mm = now.getMinutes();
    const ss = now.getSeconds();
    let clock = `${year}`;
    if (month < 10) clock += '0';
    clock += `${month}`;
    if (day < 10) clock += '0';
    clock += `${day}`;
    if (hh < 10) clock += '0';
    clock += `${hh}`;
    if (mm < 10) clock += '0';
    clock += `${mm}`;
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
  };

  handleChangeTab = key => {
    this.setState({
      tabType: key,
    });
  };

  handleExport = () => {
    const { tabType } = this.state;
    switch (tabType) {
      case '1':
        this.handleCSV();
        break;
      case '2':
        this.handleCSVHigth();
        break;
      case '3':
        this.handleCSVV();
        break;
      case '4':
        this.handleHeGeCSV();
        break;
      default:
        break;
    }
    return null;
  };

  cleanDate() {
    const { dispatch } = this.props;
    dispatch({
      type: 'charts/cleanEditState',
      payload: {},
    });
  }

  render() {
    const { getAnalyze, zone, loading, groupResult } = this.props;
    const { tabType, myLoading } = this.state;
    const Piedata = [];
    const overPill = [];
    const carr = [];
    const carr1 = [];
    const carr2 = [];
    if (getAnalyze[0]) {
      let pass = 0;
      let all = 0;
      groupResult.forEach(v => {
        pass += v.Pass;
        all += v.Pass + v.Fail;
        overPill.push({ country: 'Pass', year: v.partStyle, value: v.Pass });
        overPill.push({ country: 'Fail', year: v.partStyle, value: v.Fail });
      });
      const passNub = pass / all;
      const Pass = (passNub * 10000).toFixed(2);
      const Fail = 10000 - Pass;
      Piedata.push({ item: 'Pass', count: Pass / 10000, nub: pass });
      Piedata.push({ item: 'Fail', count: Fail / 10000, nub: all - pass });
      getAnalyze.forEach(v => {
        const aar = {
          x: v.id,
          y1: v.w,
          y2: v.W[0],
          y3: v.W[1],
          y4: zone[0].zones[v.z].width.maximum,
          y5: zone[0].zones[v.z].width.minimum,
        };
        carr.push(aar);
        const aar1 = {
          x: v.id,
          y1: v.v,
          y2: v.V[0],
          y3: v.V[1],
          y4: zone[0].zones[v.z].volume.maximum,
          y5: zone[0].zones[v.z].volume.minimum,
        };
        carr1.push(aar1);
        const aar2 = {
          x: v.id,
          y1: v.h,
          y2: v.H[0],
          y3: v.H[1],
          y4: zone[0].zones[v.z].height.maximum,
          y5: zone[0].zones[v.z].height.minimum,
        };
        carr2.push(aar2);
      });
    }
    return (
      <Card>
        {myLoading === 1 ? (
          <div style={{ position: 'absolute', zIndex: 1000, left: '50%', top: '50%' }}>
            <Spin tip="Loading..." size="large" />
          </div>
        ) : null}
        <Form onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
        </Form>
        <Tabs
          defaultActiveKey="1"
          onChange={this.handleChangeTab}
          tabBarExtraContent={
            <Button onClick={this.handleExport}>
              <Icon type="upload" /> export
            </Button>
          }
        >
          <TabPane tab="Width" key="1">
            <Card bordered={false}>
              <Suspense fallback={null}>
                <OfflineData loading={loading} offlineChartData={tabType === '1' ? carr : []} />
              </Suspense>
            </Card>
          </TabPane>
          <TabPane tab="Height" key="2">
            <Card bordered={false}>
              <Suspense fallback={null}>
                <OfflineData loading={loading} offlineChartData={tabType === '2' ? carr2 : []} />
              </Suspense>
            </Card>
          </TabPane>
          <TabPane tab="Volume" key="3">
            <Card bordered={false}>
              <Suspense fallback={null}>
                <OfflineData loading={loading} offlineChartData={tabType === '3' ? carr1 : []} />
              </Suspense>
            </Card>
          </TabPane>
          <TabPane tab="Pass/Fail" key="4">
            <Card bordered={false}>
              <Row>
                <Col span={12} style={{ marginTop: 110 }}>
                  <PieChart data={tabType === '4' ? Piedata : []} />
                </Col>
                <Col span={12} style={{ marginTop: 110 }}>
                  {overPill[0] ? <OverPillar data={tabType === '4' ? overPill : []} /> : null}
                </Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default Index;
