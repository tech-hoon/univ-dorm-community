import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  *  {
    box-sizing: border-box;
    font-size:62.5%;
  }
  a {
    text-decoration-line:none;
    color:#2883f3;
  }
  ul {
    list-style:none;
  }
  button{
    border:none;
    outline:none;
    background: none;
    cursor: pointer;
  }
  body{
    background-color: #f8f9fa;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    height:100vh;

    /* ios vh issue fix */
    @supports (-webkit-touch-callout: none) {
      height: -webkit-fill-available;
    }

    touch-action: pan-y;
  }

  input{
    border:none;
    outline:none;
    background:none;
  }

  textarea{
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  }

  /* ios select style reset */
  select {
    -webkit-appearance: none;
    -moz-appearance: none; 
    appearance: none;
  }

  svg > path{
    pointer-events:none;
  }
`;

export default GlobalStyle;
