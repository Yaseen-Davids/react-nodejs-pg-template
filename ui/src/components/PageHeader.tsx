import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Modal, Dropdown } from "semantic-ui-react";
import { LoginContext } from "../contexts/LoginContext";
import { UserContext } from "../contexts/UserContext";
import { logout } from "../lib/user";
import { useHistory } from "react-router-dom";

type PageHeaderProps = {};

export const PageHeader: React.FC<PageHeaderProps> = ({ }) => {
  const { loggedIn } = useContext(LoginContext);
  const { loading: userLoading } = useContext(UserContext);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    setIsLoggedIn(loggedIn);
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.setItem("login-token", "");
    logout();
    history.go(0); // refresh page
  }

  const handleLoginRedirect = () => {
    history.push(`/login`);
  }

  return (
    <>
      <Header>
        <a href="/"><h2>Notepad</h2></a>
        <div style={{ minWidth: "200px", textAlign: "right" }}>
          <DropdownSelect
            button
            floating
            icon="setting"
            direction="left"
            className="icon"
          >
            <Dropdown.Menu>
              {!userLoading.loading && userLoading.loaded ? (
                !isLoggedIn ? (
                  <DropdownItem icon="arrow right" text="Login" onClick={handleLoginRedirect} />
                ) : (
                    <DropdownItem icon="arrow left" text="Logout" onClick={handleLogout} />
                  )) : (
                  <DropdownItem icon="arrow right" text="Login" onClick={handleLoginRedirect} />
                )}
            </Dropdown.Menu>
          </DropdownSelect>
        </div>
      </Header>
    </>
  )
}

const Header = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #222;
  height: 50px;
  h2 {
    color: #fff;
  }
`;

const DropdownSelect = styled(Dropdown)`
  &&&& {
    color: #cecece;
    background-color: #1f1f1f;
    @media (max-width: 850px) and (min-width: 1px) {
      font-size: 11px;
    }
    div.text {
      color: #cecece;
    }
    a {
      background-color: #2a2a2a;
      color: #cecece;
    }
    .menu.transition {
      background-color: #1f1f1f;
      border: 1px solid #333;
      div {
        border-top: 1px solid #333;
        font-size: 12px;
        @media (max-width: 850px) and (min-width: 1px) {
          font-size: 11px;
        }
      }
      span {
        color: #cecece;
      }
      i {
        color: #cecece;
      }
    }
  }
`;

const DropdownItem = styled(Dropdown.Item)`
  &&&& {
    width: 150px;
  }
`;