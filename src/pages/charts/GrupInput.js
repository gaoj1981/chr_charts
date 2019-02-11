import React, { PureComponent } from 'react';
import { Input, Select, DatePicker, Form } from 'antd';

const InputGroup = Input.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
@Form.create()
class GrupInput extends PureComponent {
  state = {
    opVal: 'date',
  };

  handleOption = value => {
    this.setState({
      opVal: value,
    });
  };

  childrenFile() {
    const { form } = this.props;
    const { opVal } = this.state;
    const { getFieldDecorator } = form;
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
              <Option key="2" value="region">
                region
              </Option>
              <Option key="3" value="last">
                last
              </Option>
            </Select>
            {getFieldDecorator('days', {
              rules: [
                {
                  required: true,
                  message: '必须填!',
                },
              ],
            })(<RangePicker style={{ width: '70%' }} />)}
          </InputGroup>
        );
      case 'region':
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
              <Option key="2" value="region">
                region
              </Option>
              <Option key="3" value="last">
                last
              </Option>
            </Select>
            <span style={{ width: '70%' }}>
              {getFieldDecorator('Minimum', {
                rules: [
                  {
                    required: true,
                    message: '必须填!',
                  },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输数字',
                  },
                ],
              })(
                <Input
                  style={{ width: '50%', textAlign: 'center', borderLeft: 0 }}
                  placeholder="Minimum"
                />
              )}
              {getFieldDecorator('Maximum', {
                rules: [
                  {
                    required: true,
                    message: '必须填!',
                  },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输数字',
                  },
                ],
              })(
                <Input
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
              <Option key="2" value="region">
                region
              </Option>
              <Option key="3" value="last">
                last
              </Option>
            </Select>
            {getFieldDecorator('lastimum', {
              rules: [
                {
                  required: true,
                  message: '必须填!',
                },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输数字',
                },
              ],
            })(
              <Input
                style={{ width: '70%', textAlign: 'center', borderLeft: 0 }}
                placeholder="last"
              />
            )}
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
