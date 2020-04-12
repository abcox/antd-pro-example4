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
      title="New rule"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="description"
          name="desc"
          rules={[
            {
              required: true,
              message: 'Please enter a rule description of at least five characters!',
              min: 5,
            },
          ]}
        >
          <Input placeholder="Enter description" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
