import React, { FC, useEffect } from 'react';
// import moment from 'moment';
import {
  Modal,
  Result,
  Button,
  Form,
  Input,
  // DatePicker, Select,
} from 'antd';
import { TableListItem } from '../data.d';
// import styles from '../style.less';

interface ModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<TableListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: TableListItem) => void;
  onCancel: () => void;
}

// const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateUpdateModal: FC<ModalProps> = (props) => {
  const { done, visible, current, onDone, onCancel, onSubmit } = props;
  const [form] = Form.useForm();

  /* console.log('props: ', props);
  console.log('form: ', form); */

  useEffect(() => {
    if (form && visible) {
      if (current) {
        setTimeout(
          () =>
            form.setFieldsValue({
              ...current,
              // createdAt: current.createdAt ? moment(current.createdAt) : null,
            }),
          0,
        );
      } else {
        form.resetFields();
      }
    }
  }, [current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as TableListItem);
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: 'Save', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="Successful operation"
          subTitle="A series of information descriptions, very short, can also be punctuated."
          extra={
            <Button type="primary" onClick={onDone}>
              Got it
            </Button>
          }
          // className={styles.formResult}
        />
      );
    }
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Description"
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
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `${current ? 'Edit' : 'New'}`}
      // className={styles.standardListForm}
      width={640}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose // ={false}
      visible={visible}
      {...modalFooter}
      // getContainer={false}
      // forceRender={true}
    >
      {getModalContent()}
    </Modal>
  );
};

export default CreateUpdateModal;
