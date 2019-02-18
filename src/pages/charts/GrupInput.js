import React, { PureComponent } from 'react';
import { Input, Select, DatePicker, Form, InputNumber } from 'antd';
import moment from 'moment';

const InputGroup = Input.Group;
const { Option } = Select;
const { RangePicker, MonthPicker } = DatePicker;
const monthFormat = 'YYYY/MM';
const dayFormat = 'YYYY/MM/DD';

@Form.create()
class GrupInput extends PureComponent {
  state = {
    opVal: 'date',
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

  handleOption = value => {
    this.setState({
      opVal: value,
    });
  };

  childrenFile() {
    const { form } = this.props;
    const { opVal } = this.state;
    const { getFieldDecorator } = form;
    const now = new Date();
    const year = now.getFullYear();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    let clock = `${year}-`;
    if (month < 10) clock += '0';
    clock += `${month}`;
    const children = [];
    switch (opVal) {
      case 'date':
        return (
          <InputGroup compact>
            <Select
              showSearch
              style={{ width: '30%' }}
              value={opVal}
              optionFilterProp="children"
              onChange={this.handleOption}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option key="1" value="date">
                date
              </Option>
              <Option key="2" value="scan">
                scan
              </Option>
              <Option key="3" value="last">
                last
              </Option>
              <Option key="4" value="day1">
                day1
              </Option>
              <Option key="5" value="day2">
                day2
              </Option>
            </Select>
            {getFieldDecorator('days', {
              rules: [
                {
                  required: true,
                  message: 'required!',
                },
              ],
            })(<RangePicker placeholder={['Start Time', 'End Time']} style={{ width: '70%' }} />)}
          </InputGroup>
        );
      case 'scan':
        return (
          <InputGroup compact>
            <Select
              showSearch
              style={{ width: '30%' }}
              value={opVal}
              optionFilterProp="children"
              onChange={this.handleOption}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option key="1" value="date">
                date
              </Option>
              <Option key="2" value="scan">
                scan
              </Option>
              <Option key="3" value="last">
                last
              </Option>
              <Option key="4" value="day1">
                day1
              </Option>
              <Option key="5" value="day2">
                day2
              </Option>
            </Select>
            <span style={{ width: '70%' }}>
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
                    message: 'Mast fill in!',
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
          </InputGroup>
        );
      case 'last':
        return (
          <InputGroup compact>
            <Select
              showSearch
              style={{ width: '30%' }}
              value={opVal}
              optionFilterProp="children"
              onChange={this.handleOption}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option key="1" value="date">
                date
              </Option>
              <Option key="2" value="scan">
                scan
              </Option>
              <Option key="3" value="last">
                last
              </Option>
              <Option key="4" value="day1">
                day1
              </Option>
              <Option key="5" value="day2">
                day2
              </Option>
            </Select>
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
                min={2}
                max={1000000}
                style={{ width: '50%', textAlign: 'center', borderLeft: 0 }}
                placeholder="last"
              />
            )}
          </InputGroup>
        );
      case 'day1':
        return (
          <InputGroup compact>
            <Select
              showSearch
              style={{ width: '30%' }}
              value={opVal}
              optionFilterProp="children"
              onChange={this.handleOption}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option key="1" value="date">
                date
              </Option>
              <Option key="2" value="scan">
                scan
              </Option>
              <Option key="3" value="last">
                last
              </Option>
              <Option key="4" value="day1">
                day1
              </Option>
              <Option key="5" value="day2">
                day2
              </Option>
            </Select>
            <span style={{ width: '70%' }}>
              {getFieldDecorator('month', {
                initialValue: moment(clock, monthFormat) || '',
                rules: [
                  {
                    required: true,
                    message: 'required!',
                  },
                ],
              })(<MonthPicker style={{ width: '50%' }} format={monthFormat} />)}
              {getFieldDecorator('mayDay', {
                initialValue: day || '',
                rules: [
                  {
                    required: true,
                    message: 'required!',
                  },
                ],
              })(<Select style={{ width: '50%' }}>{this.getDay()}</Select>)}
            </span>
          </InputGroup>
        );
      case 'day2':
        return (
          <InputGroup compact>
            <Select
              showSearch
              style={{ width: '30%' }}
              value={opVal}
              optionFilterProp="children"
              onChange={this.handleOption}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option key="1" value="date">
                date
              </Option>
              <Option key="2" value="scan">
                scan
              </Option>
              <Option key="3" value="last">
                last
              </Option>
              <Option key="4" value="day1">
                day1
              </Option>
              <Option key="5" value="day2">
                day2
              </Option>
            </Select>
            <span style={{ width: '70%' }}>
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
          </InputGroup>
        );
      default:
        break;
    }
    return children;
  }

  render() {
    return <Form.Item>{this.childrenFile()}</Form.Item>;
  }
}

export default GrupInput;
