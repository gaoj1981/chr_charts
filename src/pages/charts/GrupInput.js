import React, { PureComponent, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Input, Select, DatePicker, Form, InputNumber, Cascader } from 'antd';
import moment from 'moment';

const InputGroup = Input.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY/MM';
const dayFormat = 'YYYY/MM/DD';

@Form.create()
class GrupInput extends PureComponent {
  state = {
    opVal: ['Day'],
  };

  // 获取月份中的日期1
  getDay() {
    const { form } = this.props;
    const { getFieldValue } = form;
    const month = getFieldValue('month');
    const thisDays = moment(month, monthFormat).daysInMonth();
    const day = [];
    for (let i = 1; i <= thisDays; i += 1) {
      day.push(i);
    }
    const children = [];
    day.forEach(v => {
      children.push(<Option key={v}>{v}</Option>);
    });
    return children;
  }

  handleOption = (value, selectedOptions) => {
    console.log(selectedOptions);
    this.setState({
      opVal: value,
    });
    if (selectedOptions[1]) {
      const { setCompareType } = this.props;
      const { value: val } = selectedOptions[1];
      setCompareType(val);
    }
    const { setMyChartCz, isDuibiChange } = this.props;
    setMyChartCz();
    if (value[0] === 'duibi') {
      isDuibiChange(true);
    } else {
      isDuibiChange(false);
    }
  };

  changeDibi = () => {
    const { setMyChartCz } = this.props;
    setMyChartCz();
  };

  childrenFile() {
    const { form } = this.props;
    const { opVal } = this.state;
    const { getFieldDecorator } = form;
    const now = new Date();
    const children = [];
    switch (opVal[0]) {
      case 'Date':
        return (
          <Fragment>
            {getFieldDecorator('days', {
              rules: [
                {
                  required: true,
                  message: 'required!',
                },
              ],
            })(
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['Start Time', 'End Time']}
                style={{ width: '65%' }}
              />
            )}
          </Fragment>
        );
      case 'Scan':
        return (
          <span style={{ width: '65%' }}>
            {getFieldDecorator('Minimum', {
              rules: [
                {
                  required: true,
                  message: 'required!',
                },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: 'please enter a number',
                },
              ],
            })(
              <InputNumber
                style={{ width: '50%', textAlign: 'center', borderLeft: 0 }}
                placeholder="Minimum"
              />
            )}
            {getFieldDecorator('Maximum', {
              rules: [
                {
                  required: true,
                  message: 'required!',
                },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: 'please enter a number',
                },
              ],
            })(
              <InputNumber
                style={{ width: '50%', textAlign: 'center', borderLeft: 0 }}
                placeholder="Maximum"
              />
            )}
          </span>
        );
      case 'Last':
        return (
          <Fragment>
            {getFieldDecorator('lastimum', {
              rules: [
                {
                  required: true,
                  message: 'required!',
                },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: 'please enter a number',
                },
              ],
            })(
              <InputNumber
                min={1}
                max={1000000}
                style={{ width: '50%', textAlign: 'center', borderLeft: 0 }}
                placeholder="last"
              />
            )}
          </Fragment>
        );
      case 'Day':
        return (
          <span style={{ width: '65%' }}>
            {getFieldDecorator('monthDay', {
              initialValue: moment(now, dayFormat) || '',
              rules: [
                {
                  required: true,
                  message: 'required!',
                },
              ],
            })(<DatePicker />)}
          </span>
        );
      case 'duibi':
        return (
          <span style={{ width: '65%' }}>
            {getFieldDecorator('ridui', {
              rules: [
                {
                  required: true,
                  message: 'required!',
                },
              ],
            })(<InputNumber min={1} onChange={this.changeDibi} max={30} />)}
          </span>
        );
      default:
        break;
    }
    return children;
  }

  render() {
    const { opVal } = this.state;
    const mDay = formatMessage({ id: 'Date' });
    const range = formatMessage({ id: 'Date Range' });
    const Scan = formatMessage({ id: 'Scan No.' });
    const Last = formatMessage({ id: 'Last' });
    const compare = formatMessage({ id: 'compare' });
    const dayCompare = formatMessage({ id: 'day' });
    const weekCompare = formatMessage({ id: 'week' });
    const monthCompare = formatMessage({ id: 'month' });
    const options = [
      {
        value: 'Day',
        label: mDay,
      },
      {
        value: 'Date',
        label: range,
      },
      {
        value: 'Scan',
        label: Scan,
      },
      {
        value: 'Last',
        label: Last,
      },
      {
        value: 'duibi',
        label: compare,
        children: [
          {
            value: 'dayDb',
            label: dayCompare,
          },
          {
            value: 'weekDb',
            label: weekCompare,
          },
          {
            value: 'monthDb',
            label: monthCompare,
          },
        ],
      },
    ];
    return (
      <Form.Item>
        <InputGroup compact>
          <Cascader
            style={{ width: '35%' }}
            options={options}
            placeholder="Please select"
            onChange={this.handleOption}
            value={opVal}
          />
          {this.childrenFile()}
        </InputGroup>
      </Form.Item>
    );
  }
}

export default GrupInput;
