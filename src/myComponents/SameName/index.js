import React, { PureComponent } from 'react';
import { Drawer, Button, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import SameNameHoc from './SameNameHoc';

const monthFormat = 'YYYY-MM';
const myId = formatMessage({ id: 'ScanN' });
const myDate = formatMessage({ id: 'Date' });

@SameNameHoc
@connect(({ charts }) => ({
  sameName: charts.sameName,
}))
class SameName extends PureComponent {
  state = {
    cv: false,
    items: [],
    eid: null,
  };

  componentDidMount() {
    this.getPage();
  }

  getPage = () => {
    const { dispatch, form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (err) return;
      const parm = {
        hosts: [values.hosts],
        partStyle: values.lingjian,
        start: values.days ? `${values.days[0].format('YYYY-MM-DD HH:mm')}:00` : null,
        end: values.days ? `${values.days[1].format('YYYY-MM-DD HH:mm')}:59` : null,
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
      dispatch({
        type: 'charts/reqCommon',
        service: 'sameName',
        payload: parm,
      });
    });
  };

  childrenClose = () => {
    this.setState({
      cv: false,
    });
  };

  childrenVisible = (flag, nub) => {
    const { sameName } = this.props;
    if (sameName[0]) {
      sameName.forEach(v => {
        const { _id: eid } = v;
        if (eid === nub) {
          const { items } = v;
          this.setState({
            items,
            eid,
          });
        }
      });
    }
    this.setState({
      cv: !!flag,
    });
  };

  childrenForm = items => {
    const columns = [
      {
        title: `${myId}`,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: `${myDate}`,
        dataIndex: 'date',
        key: 'date',
        align: 'center',
      },
    ];
    const dataSource = [];
    const { eid } = this.state;
    if (items[0]) {
      items.forEach((v, k) => {
        const { date } = v;
        const add = {
          id: `${eid}_${k + 1}`,
          date,
        };
        dataSource.push(add);
      });
    }
    return <Table dataSource={dataSource} columns={columns} align="center" />;
  };

  render() {
    const { visible, handleClose, sameForm } = this.props;
    const { cv, items } = this.state;
    return (
      <Drawer
        title={`${formatMessage({
          id: 'Same',
        })}`}
        placement="left"
        closable={false}
        onClose={handleClose}
        visible={visible}
        width={900}
      >
        <div
          style={{
            position: 'absolute',
            top: '45%',
            right: -15,
            display: visible ? 'block' : 'none',
          }}
        >
          <Button
            icon="double-left"
            type="default"
            style={{ height: 50, width: 18, padding: 0, border: 0, color: '#40a9ff' }}
            onClick={() => handleClose()}
          />
        </div>
        {sameForm(this.props, this.childrenVisible) || null}
        <Drawer
          title={`${formatMessage({
            id: 'Same',
          })}`}
          placement="left"
          width={500}
          closable={false}
          onClose={this.childrenClose}
          visible={cv}
        >
          <div
            style={{
              position: 'absolute',
              top: '45%',
              right: -15,
              display: visible ? 'block' : 'none',
            }}
          >
            <Button
              icon="double-left"
              type="default"
              style={{ height: 50, width: 18, padding: 0, border: 0, color: '#40a9ff' }}
              onClick={this.childrenClose}
            />
          </div>
          {cv ? this.childrenForm(items) : null}
        </Drawer>
      </Drawer>
    );
  }
}

export default SameName;
