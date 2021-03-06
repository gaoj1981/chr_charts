import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, Card, Collapse } from 'antd';
import { formatMessage } from 'umi/locale';
import OfflineData from '@/pages/charts/OfflineData';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const myWidth = formatMessage({ id: 'Width' });
const myHeight = formatMessage({ id: 'Height' });
const myVolume = formatMessage({ id: 'Volume' });
const noData = formatMessage({ id: 'NoData' });

@connect(({ charts }) => ({
  contrastAnalyze: charts.getContrastAnalyze,
  contrastZone: charts.contrastZone,
}))
class MyCharts extends PureComponent {
  state = {
    tabType: '1',
    startDay: '',
    endDay: '',
    showArr: [],
  };

  componentWillMount() {
    const { isVisbale } = this.props;
    if (isVisbale) {
      this.getParm();
    }
  }

  componentDidMount() {
    const { isVisbaleChange } = this.props;
    isVisbaleChange(false);
  }

  handleChangeTab = val => {
    this.setState({ tabType: val });
  };

  getParm = () => {
    const { form, type, compareType } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      const thisDay = `${moment().format('YYYY-MM-DD')}`;
      const allTime = [];
      if (compareType === 'dayDb') {
        const st = `${moment(thisDay)
          .subtract(type, 'days')
          .format('YYYY-MM-DD')} 00:00:00`;
        const et = `${moment(thisDay)
          .subtract(type, 'days')
          .format('YYYY-MM-DD')} 23:59:59`;
        allTime.push(st, et);
      } else if (compareType === 'weekDb') {
        if (type === 0) {
          const weekDay = moment().weekday();
          const st = `${moment(thisDay)
            .subtract(weekDay, 'days')
            .format('YYYY-MM-DD')} 00:00:00`;
          const et = `${moment(thisDay).format('YYYY-MM-DD')} 23:59:59`;
          allTime.push(st, et);
        } else {
          const weekDay = moment().weekday();
          const typeNub = type * 7;
          const edType = type - 1;
          const md = weekDay + typeNub;
          const ed = edType * 7 + weekDay + 1;
          const st = `${moment(thisDay)
            .subtract(md, 'days')
            .format('YYYY-MM-DD')} 00:00:00`;
          const et = `${moment(thisDay)
            .subtract(ed, 'days')
            .format('YYYY-MM-DD')} 23:59:59`;
          allTime.push(st, et);
        }
      } else if (compareType === 'monthDb') {
        if (type === 0) {
          const getDay = moment().get('date') - 1;
          const st = `${moment(thisDay)
            .subtract(getDay, 'days')
            .format('YYYY-MM-DD')} 00:00:00`;
          const et = `${moment(thisDay).format('YYYY-MM-DD')} 23:59:59`;
          allTime.push(st, et);
        } else {
          const mDay = moment(thisDay).subtract(type, 'months');
          const getDay = moment(mDay).daysInMonth();
          const st = `${moment(thisDay)
            .subtract(type, 'months')
            .format('YYYY-MM')}-01 00:00:00`;
          const et = `${moment(thisDay)
            .subtract(type, 'months')
            .format('YYYY-MM')}-${getDay} 23:59:59`;
          allTime.push(st, et);
        }
      }
      const parm = {
        hosts: [values.hosts],
        partStyle: values.lingjian,
        start: allTime[0],
        end: allTime[1],
        scanScope: values.Minimum ? [Number(values.Minimum), Number(values.Maximum)] : null,
        limit: values.lastimum || null,
        type,
      };
      this.getZone(parm);
      this.getAnalyze(parm);
    });
  };

  getZone = parmZone => {
    const { dispatch, type, setmyLoading, all } = this.props;
    setmyLoading(1);
    dispatch({
      type: 'charts/myZonCommon',
      service: 'getContrastZone',
      payload: parmZone,
      callback: () => {
        const { contrastZone } = this.props;
        this.setState({
          startDay: parmZone.start,
          endDay: parmZone.end,
        });
        if (!contrastZone[type]) {
          const indexNub = all - 1;
          if (indexNub === type) {
            setmyLoading(0);
          }
        } else {
          // const { showArr } = this.state;
          // showArr.push(type.toString());
          // this.setState({ showArr });
        }
      },
    });
  };

  getAnalyze = parm => {
    const { dispatch, isVisbaleChange, setmyLoading, all, type } = this.props;
    dispatch({
      type: 'charts/myCommon',
      service: 'getContrastAnalyze',
      payload: parm,
      callback: () => {
        isVisbaleChange(false);
        const indexNub = all - 1;
        if (indexNub === type) {
          setmyLoading(0);
        }
      },
    });
  };

  render() {
    const { contrastZone, contrastAnalyze, type } = this.props;
    const analyze = [];
    let count = 0;

    if (contrastZone.length > 0) {
      contrastZone.forEach((v, k) => {
        if (v.data[0]) {
          if (contrastAnalyze[count]) {
            analyze.push({
              type: contrastZone[k].type,
              datas: contrastAnalyze[count],
              zone: contrastZone[k].data,
            });
            count += 1;
            const { showArr } = this.state;
            showArr.push(contrastZone[k].type.toString());
            this.setState({ showArr });
          }
        } else {
          analyze.push([]);
        }
      });
    }
    const { tabType, startDay, endDay, showArr } = this.state;
    const carr = [];
    const carr1 = [];
    const carr2 = [];
    if (contrastAnalyze[0]) {
      analyze.forEach((val, key) => {
        if (analyze[key].type === type) {
          val.datas.forEach(v => {
            console.log(33333);
            console.log(val.zone[0]);
            console.log(v);
            const aar = {
              x: v.id,
              y1: v.w,
              y2: v.W[0],
              y3: v.W[1],
              y4: val.zone[0].zones[v.z] === undefined ? 0 : val.zone[0].zones[v.z].width.maximum,
              y5: val.zone[0].zones[v.z] === undefined ? 0 : val.zone[0].zones[v.z].width.minimum,
              y6: v.wc,
            };
            carr.push(aar);
            const aar1 = {
              x: v.id,
              y1: v.v,
              y2: v.V[0],
              y3: v.V[1],
              y4: val.zone[0].zones[v.z] === undefined ? 0 : val.zone[0].zones[v.z].volume.maximum,
              y5: val.zone[0].zones[v.z] === undefined ? 0 : val.zone[0].zones[v.z].volume.minimum,
              y6: v.vc,
            };
            carr1.push(aar1);
            const aar2 = {
              x: v.id,
              y1: v.h,
              y2: v.H[0],
              y3: v.H[1],
              y4: val.zone[0].zones[v.z] === undefined ? 0 : val.zone[0].zones[v.z].height.maximum,
              y5: val.zone[0].zones[v.z] === undefined ? 0 : val.zone[0].zones[v.z].height.minimum,
              y6: v.hc,
            };
            carr2.push(aar2);
          });
        }
      });
    }
    return (
      <Collapse defaultActiveKey={showArr}>
        <Panel
          header={`${startDay}-${endDay}${showArr.indexOf(type.toString()) ? `(${noData})` : ''}`}
          key={type}
        >
          <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
            <TabPane tab={myWidth} key="1">
              <Card bordered={false}>
                <Suspense fallback={null}>
                  {tabType === '1' ? (
                    <OfflineData type="mm" zl="my" offlineChartData={carr} />
                  ) : null}
                </Suspense>
              </Card>
            </TabPane>
            <TabPane tab={myHeight} key="2">
              <Card bordered={false}>
                <Suspense fallback={null}>
                  {tabType === '2' ? (
                    <OfflineData type="mm" zl="my" offlineChartData={carr2} />
                  ) : null}
                </Suspense>
              </Card>
            </TabPane>
            <TabPane tab={myVolume} key="3">
              <Card bordered={false}>
                <Suspense fallback={null}>
                  {tabType === '3' ? (
                    <OfflineData type="mm³" zl="my" offlineChartData={carr1} />
                  ) : null}
                </Suspense>
              </Card>
            </TabPane>
          </Tabs>
        </Panel>
      </Collapse>
    );
  }
}

// {carr[0]?<OfflineData type="mm" zl="my" offlineChartData={carr} />:null}

export default MyCharts;
