import React, { PureComponent } from 'react';
import { Drawer, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import MyDrawerHoc from '@/myComponents/MyDrawer/MyDrawerHoc';
import { connect } from 'dva';
import moment from 'moment';

const monthFormat = 'YYYY-MM';

@MyDrawerHoc
@connect(({ charts }) => ({
  findFail: charts.findFail,
}))
class MyDrawer extends PureComponent {
  state = {
    cv: false,
  };

  componentDidMount() {
    this.getPage();
  }

  getPage = page => {
    const { form } = this.props;
    const { validateFields } = form;
    const pageNub = page || 0;
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
      this.disPage(parm, pageNub);
    });
  };

  childrenClose = () => {
    this.setState({
      cv: false,
    });
  };

  disPage = (parm, page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'charts/reqCommon',
      service: 'findFail',
      payload: { parm, page },
    });
  };

  handlePageChange = pagination => {
    let current = pagination;
    current -= 1;
    this.getPage(current);
  };

  render() {
    const { visible, handleClose, editForm } = this.props;
    const { cv } = this.state;
    return (
      <Drawer
        title={`${formatMessage({
          id: 'fail',
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
        {editForm(this.props, this.handlePageChange) || null}
        <Drawer
          title="Two-level Drawer"
          placement="left"
          width={320}
          closable={false}
          onClose={this.childrenClose}
          visible={cv}
        >
          This is two-level drawer
        </Drawer>
      </Drawer>
    );
  }
}

export default MyDrawer;
