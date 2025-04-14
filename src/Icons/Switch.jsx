import React from 'react';
import styled from 'styled-components';

const Switch = ({setSidebarHide, sidebarHide}) => {
    function side() {
        setSidebarHide(prev=> !prev)
        console.log('Tha');
        console.log(sidebarHide);
        
    }
  return (
    <StyledWrapper >
      <div className="container " >  
        <input className="label-check" id="label-check" type="checkbox" />
        <label htmlFor="label-check" className="hamburger-label ml-3" onClick={side} >
          <div className="line1" />
          <div className="line2" />
          <div className="line3" />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .label-check {
    display: none;
  }

  .hamburger-label {
    width: 40px;
    height: 32px;
    position: relative;
    display: block;
    cursor: pointer;
  }

  .hamburger-label div {
    width: 30px;
    height: 2px;
    background-color: #fff;
    position: absolute;
    left: 5px;
  }

  .line1 {
    top: 5px;
    transition: all 0.3s;
  }

  .line2 {
    top: 14px;
    transition: 0.3s;
  }

  .line3 {
    top: 23px;
    transition: 0.3s;
  }

  #label-check:checked + .hamburger-label .line1 {
    transform: rotate(35deg) scaleX(0.55) translate(20px, -4px);
    border-radius: 50px 50px 50px 0;
  }

  #label-check:checked + .hamburger-label .line3 {
    transform: rotate(-35deg) scaleX(0.55) translate(20px, 4px);
    border-radius: 0 50px 50px 50px;
  }

  #label-check:checked + .hamburger-label .line2 {
    width: 28px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
  }
`;

export default Switch;
