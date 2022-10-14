import styled, { keyframes } from 'styled-components'

function AnimLoading() {
  const Typing = keyframes`
    from {
      width: 0
    }
  `;

  const Blink = keyframes`
    50%{
      border-color: transparent
    }
  `;

  const Wrapper = styled.section`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const Content = styled.div`
    color: white;
    width: 13ch;
    animation: ${Typing} 2s steps(40) infinite, ${Blink} .5s step-end infinite alternate;
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid;
    font-family: monospace;
    font-size: 2em;
  `;

  return <>
    <Wrapper>
      <Content>
        Carregando...
      </Content>
    </Wrapper>
  </>;
}

export default AnimLoading;