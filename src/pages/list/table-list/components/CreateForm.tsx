import React from 'react';
import { Form, Input, Modal, message } from 'antd';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const [form] = Form.useForm();
  const okHandle = async () => {
    const item = await form.validateFields().then(
      (store) => {
        return (Array.isArray(store) ? store : [store]).find((i: { desc: string }) =>
          i.hasOwnProperty('desc'),
        );
      },
      (err) => {
        message.error(err);
        return null;
      },
    );
    form.resetFields();
    handleAdd({ desc: item.desc });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述"
          name="desc"
          rules={[{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
