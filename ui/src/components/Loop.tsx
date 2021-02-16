import React, { useContext } from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { MediaPlayerContext } from "../contexts/MediaPlayerContext";
import { useSnackbar } from "react-simple-snackbar";

export const Loop = () => {
  const { loop, setLoop } = useContext(MediaPlayerContext);
  const [openSnackbar] = useSnackbar();

  const handleLoopStateChange = () => {
    openSnackbar(`Loop turned ${loop ? "off" : "on"}`);
    setLoop(!loop);
  }

  return (
    <LoopCheckboxWrapper>
      <LoopIcon name="retweet" active={loop ? "#d4d4d4" : "grey"} onClick={handleLoopStateChange} />
    </LoopCheckboxWrapper>
  )
}

const LoopCheckboxWrapper = styled.div`
  &&&&&& {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 50px;
    justify-content: space-between;
    min-height: 31px;
    @media (max-width: 850px) and (min-width: 1px) {
      width: 40px;
    }
  }
`;

const LoopIcon = styled(Icon)`
  &&&& {
    margin: 0 auto;
    cursor: pointer;
    font-size: 22px;
    color: ${(props: { active: string }) => props.active};
    margin-top: -2px;
    @media (max-width: 850px) and (min-width: 1px) {
      font-size: 16px;
    }
  }
`;