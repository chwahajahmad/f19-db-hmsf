import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import {
  Row,
  Form,
  Input,
  Button,
  Col,
  Select,
  DatePicker,
  TimePicker,
} from "antd";

export default function BookAppointment() {
  const [IDValidationStatus, setIDValidationStatus] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    doctorsDataFetch();

    return () => {
      doctorsDataFetch();
    };
  }, []);
  const doctorsDataFetch = () => {
    axios.get(`http://localhost:3001/getDoctorsData`).then(res => {
      setDoctorsList(res.data);
    });
  };
  const onFinish = values => {
    setIDValidationStatus("validating");
    axios
      .get(`http://localhost:3001/getPatientsData/${values.patientId}`)
      .then(res => {
        if (res.data.length === 0) {
          setIDValidationStatus("error");
          setErrorMsg("Patient ID does not exist");
          return;
        } else {
          if (doctorId === "") {
            setErrorMsg("Select Doctor");
            return;
          }

          if (date === "") {
            setErrorMsg("Select Date");
            return;
          }
          axios({
            method: "post",
            url: "http://localhost:3001/insertAppointmentData/",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({
              doctorId,
              patientId: values.patientId,
              appDate: date.toDate().toISOString(),
              appTime: values.timePicker.add(5, "hours").toDate().toISOString(),
            }),
          });
          setIDValidationStatus("success");
          setErrorMsg("");
        }
      });
  };

  function onChange(dateString) {
    setDate(dateString);
  }
  function handleChange(value) {
    setDoctorId(value);
  }
  const onFinishFailed = () => {
    console.log("Form can't be submitted");
  };
  return (
    <>
      <Row gutter={16} justify="center" style={{ marginTop: "20px" }}>
        <h1>Book Appointment</h1>
      </Row>

      <Form
        name="Appointment"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ marginTop: "30px" }}
      >
        <Row gutter={16} justify="center">
          <Col span={24}>
            <Form.Item
              label="PatientID"
              name="patientId"
              hasFeedback
              rules={[
                { required: true, message: "Please input your PatientID!" },
              ]}
              validateStatus={IDValidationStatus}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} justify="center">
          <Col span={24}>
            <Form.Item
              label="Doctor"
              rules={[
                { required: true, message: "Please Select your Doctor!" },
              ]}
            >
              <Select onChange={handleChange}>
                {doctorsList.map((data, index) => (
                  <Select.Option key={data.Did} value={data.Did}>
                    {data.Fname + " " + data.Lname}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} justify="center">
          <Col span={24}>
            <Form.Item label="date">
              <DatePicker onChange={onChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} justify="center">
          <Col span={24}>
            <Form.Item name="timePicker" label="Time">
              <TimePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} justify="center" align="middle">
          <Button type="primary" htmlType="submit" size="medium">
            Submit
          </Button>
        </Row>
        <Row gutter={16} justify="center" align="middle">
          <br></br>
          <br></br>
          <h4 style={{ color: "red" }}>{errorMsg}</h4>
        </Row>
      </Form>
    </>
  );
}