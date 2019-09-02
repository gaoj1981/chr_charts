import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, Card, Collapse } from 'antd';
import { formatMessage } from 'umi/locale';
import OfflineData from '@/pages/charts/OfflineData';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const myWidth = formatMessage({ id: 'Width' });
// const myHeight = formatMessage({ id: 'Height' });
// const myVolume = formatMessage({ id: 'Volume' });
const noData = formatMessage({ id: 'NoData' });

@connect(({ charts }) => ({
  contrastAnalyze: charts.getContrastAnalyze,
  contrastZone: charts.contrastZone,
}))
class MyChartsMerge extends PureComponent {
  state = {
    tabType: '1',
    startDay: '',
    endDay: '',
    showArr: [],
  };

  componentWillMount() {
    const { isVisbale, typeNub } = this.props;
    if (isVisbale) {
      for (let i = 0; i < typeNub; i += 1) {
        this.getParm(i);
      }
    }
  }

  componentDidMount() {
    const { isVisbaleChange } = this.props;
    isVisbaleChange(false);
  }

  handleChangeTab = val => {
    this.setState({ tabType: val });
  };

  getParm = type => {
    const { form, compareType } = this.props;
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
      };
      this.getZone(parm, type);
    });
  };

  getZone = (parmZone, type) => {
    const { dispatch, setmyLoading } = this.props;
    setmyLoading(1);
    dispatch({
      type: 'charts/reqCommon',
      service: 'getContrastZone',
      payload: parmZone,
      callback: () => {
        const { contrastZone } = this.props;
        this.setState({
          startDay: parmZone.start,
          endDay: parmZone.end,
        });
        if (!contrastZone[type]) {
          setmyLoading(0);
        } else {
          this.getAnalyze(parmZone);
          const { showArr } = this.state;
          showArr.push(type.toString());
          this.setState({ showArr });
        }
      },
    });
  };

  getAnalyze = parm => {
    const { dispatch, isVisbaleChange, setmyLoading } = this.props;
    dispatch({
      type: 'charts/reqCommon',
      service: 'getContrastAnalyze',
      payload: parm,
      callback: () => {
        isVisbaleChange(false);
        setmyLoading(0);
      },
    });
  };

  render() {
    const { contrastAnalyze, type } = this.props;
    const { tabType, startDay, endDay, showArr } = this.state;
    const carr = [];
    if (contrastAnalyze[0]) {
      contrastAnalyze.forEach(val => {
        val.forEach(v => {
          const aar = {
            x: v.id,
            y1: v.w,
            y2: v.W[0],
            y3: v.W[1],
          };
          carr.push(aar);
        });
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
          </Tabs>
        </Panel>
      </Collapse>
    );
  }
}

// {carr[0]?<OfflineData type="mm" zl="my" offlineChartData={carr} />:null}

export default MyChartsMerge;
