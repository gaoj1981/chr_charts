import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { saveAs } from 'file-saver';
import { Form, Row, Col, Button, Select, Card, message, InputNumber } from 'antd';
import PieChart from './charts/PieChart';
import OverPillar from './charts/OverPillar';
import GrupInput from './charts/GrupInput';

const OfflineData = React.lazy(() => import('./charts/OfflineData'));

const { Option } = Select;
@Form.create()
@connect(({ charts, loading }) => ({
  getLingJian: charts.getLingJian,
  getAnalyze: charts.getAnalyze,
  groupResult: charts.groupResult,
  getHost: charts.getHost,
  zone: charts.zone,
  loading: loading.effects['charts/reqCommon'],
}))
class Index extends Component {
  state = {
    expand: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'charts/reqCommon',
      service: 'getLingJian',
    });
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
    const { expand } = this.state;
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
                    message: '必须填!',
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
                    message: '必须填!',
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
        <Button style={{ marginLeft: 10 }} onClick={this.handleReset}>
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
        children = <Select>{this.fileOption(0)}</Select>;
        break;
      case 1:
        children = <Select>{this.fileOption(1)}</Select>;
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
        set.forEach(v => {
          optionData.push(<Option key={v}>{v}</Option>);
        });
      }
    } else {
      const { getHost } = this.props;
      const set = new Set(getHost);
      if (set) {
        set.forEach(v => {
          optionData.push(<Option key={v}>{v}</Option>);
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
      const { dispatch } = this.props;
      dispatch({
        type: 'charts/cleanEditState',
        payload: {},
      });

      const parm = {
        hosts: [values.hosts],
        partStyle: values.lingjian,
        start: values.days ? values.days[0].format('YYYY-MM-DD HH:mm:ss') : null,
        end: values.days ? values.days[1].format('YYYY-MM-DD HH:mm:ss') : null,
        scanScope: values.Minimum ? [Number(values.Minimum), Number(values.Maximum)] : null,
        limit: values.lastimum || null,
      };
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
          message.warning('数据不存在');
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
          message.warning('数据不存在');
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
          message.warning('数据不存在');
        }
      },
    });
  };

  handleReset = () => {
    const { form } = this.props;
    const { resetFields } = form;
    resetFields();
  };

  handleCSV = () => {
    let csvArr = 'avg,3STDEV+,3STDEV-,zone_Max,zone_Min';
    const { getAnalyze, zone } = this.props;
    const thisDate = `宽度${this.getTimeFormatter()}.csv`;
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
      const thisDate = `高度${this.getTimeFormatter()}.csv`;
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
      const thisDate = `高度${this.getTimeFormatter()}.csv`;
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
      const thisDate = `合格率${this.getTimeFormatter()}.csv`;
      groupResult.forEach(v => {
        console.log(v);
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
    let clock = `${year}-`;
    if (month < 10) clock += '0';
    clock += `${month}-`;
    if (day < 10) clock += '0';
    clock += `${day} `;
    if (hh < 10) clock += '0';
    clock += `${hh}：`;
    if (mm < 10) clock += '0';
    clock += `${mm}：`;
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
  };

  render() {
    const { getAnalyze, zone, loading, groupResult } = this.props;
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
      const Pass = Math.floor(passNub * 10000);
      const Fail = 10000 - Pass;
      Piedata.push({ item: 'Pass', count: Pass / 10000 });
      Piedata.push({ item: 'Fail', count: Fail / 10000 });
      console.log(Piedata);
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
        <Form onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
        </Form>
        <Card
          title="宽度"
          bordered={false}
          extra={<Button onClick={() => this.handleCSV()}>导出</Button>}
        >
          <Suspense fallback={null}>
            <OfflineData loading={loading} offlineChartData={carr} />
          </Suspense>
        </Card>
        <Card
          title="高度"
          bordered={false}
          extra={<Button onClick={() => this.handleCSVHigth()}>导出</Button>}
        >
          <Suspense fallback={null}>
            <OfflineData loading={loading} offlineChartData={carr2} />
          </Suspense>
        </Card>
        <Card
          title="体积"
          bordered={false}
          extra={<Button onClick={() => this.handleCSVV()}>导出</Button>}
        >
          <Suspense fallback={null}>
            <OfflineData loading={loading} offlineChartData={carr1} />
          </Suspense>
        </Card>
        <Card
          title="合格率"
          bordered={false}
          extra={<Button onClick={() => this.handleHeGeCSV()}>导出</Button>}
        >
          <Row>
            <Col span={12}>
              <PieChart data={Piedata} />
            </Col>
            <Col span={12}>
              <OverPillar data={overPill} />
            </Col>
          </Row>
        </Card>
      </Card>
    );
  }
}

export default Index;
