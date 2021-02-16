import React, { useContext, useState } from "react";

import { register } from "../../lib/user";
import { UserContext } from "../../contexts/UserContext";

import { Form, Field } from "react-final-form";
import { Input, Button } from "semantic-ui-react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

export const Register = () => {
  const history = useHistory();
  const { hydrateUser } = useContext(UserContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleRedirect = (route: string) => {
    history.push(`/${route}`);
  }

  return (
    <Container>
      <Form
        validate={(values: { username: string; email: string; password: string; confirm_password: string; }) => {
          const errors: any = {};

          if (!values.username) {
            errors.username = "Please enter a username";
          }
          if (!values.email) {
            errors.email = "Please enter a email address";
          }
          if (!values.password) {
            errors.password = "Please enter a password";
          }
          if (!values.confirm_password) {
            errors.confirm_password = "Please enter confirm your password";
          }
          if (values.password != values.confirm_password) {
            errors.confirm_password = "Passwords do not match";
          }

          return errors;
        }}
        onSubmit={async (fields: { username: string; email: string; password: string; }) => {
          try {
            setLoading(true);
            setError(undefined);
            const resp = await register(fields);

            if (resp.status >= 400) {
              throw "Register failed.";
            }

            const token = resp.data.token;
            localStorage.setItem("login-token", token);

            await hydrateUser();
            await history.replace("/");
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <LoginWrapper>
              <LoginContent>
                <h2>Register an account</h2>
                <FieldContainerWrapper>
                  <TextField type="text" name="username" label="Username" />
                  <TextField type="email" name="email" label="Email" />
                  <TextField type="password" name="password" label="Password" />
                  <TextField type="password" name="confirm_password" label="Confirm Password" />
                </FieldContainerWrapper>
                <Button color="blue" type="submit" disabled={loading} loading={loading}>Submit</Button>
                <Button color="green" type="button" onClick={() => handleRedirect("login")}>Login</Button>
                {error && <p className="validate-error">{error}</p>}
              </LoginContent>
            </LoginWrapper>
          </form>
        )}
      />
    </Container>
  )
};

type TextFieldProps = {
  type: string;
  name: string;
  label: string;
}

const TextField: React.FC<TextFieldProps> = ({ type, name, label }) => (
  <Field
    type={type}
    name={name}
    render={({ meta, input }) => (
      <FieldContainer>
        <label>{label}</label>
        <Input {...input} placeholder={label} fluid />
        {meta.error && meta.touched ? <span className="validate-error">{meta.error}</span> : <></>}
      </FieldContainer>
    )}
  />
)

const Container = styled.div`
  max-height: 100vh;
  height: 100vh;
  background-color: #121212;

  .validate-error {
    color: #ff2b2b;
    font-size: 10px;
  }
`;

const LoginWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
`;

const LoginContent = styled.div`
  padding: 20px;
  background-color: #1f1f1f;
  h2 {
    color: #fafafa;
  }
`;

const FieldContainerWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-bottom: 15px;
`;

const FieldContainer = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr 10px;
  label {
    color: #d4d4d4;
  }
  &&&&& input {
    margin-top: 5px;
    margin-bottom: 5px;
  }
`;