import IIcon from './icons.type';

const Like = ({ width = '17', height = '16', color = '#5C5C5C' }: IIcon) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 17 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M5.9586 6.37793V14.2782H2.02536C1.15749 14.2782 0.591797 13.9471 0.591797 13.437V7.21921C0.591797 6.70912 1.15507 6.37793 2.02294 6.37793H5.9586Z'
      fill={color}
    />
    <path
      d='M15.8944 7.57292C15.9061 8.02726 15.8474 8.48067 15.7204 8.91704C15.5431 9.72286 15.3674 10.5351 15.1934 11.3539C15.0145 12.1879 14.9516 13.2371 14.4125 13.9647C14.1703 14.2876 13.856 14.5494 13.4945 14.729C13.1331 14.9087 12.7347 15.0013 12.3311 14.9994H7.42117C7.08088 15.0067 6.74264 14.9449 6.42692 14.8177C6.1112 14.6906 5.82457 14.5007 5.58435 14.2596C5.34412 14.0184 5.1553 13.7311 5.02932 13.4149C4.90334 13.0987 4.84281 12.7602 4.85139 12.42C4.85139 10.6987 4.85139 8.97748 4.85139 7.25623C4.84289 6.59881 5.0879 5.96335 5.53554 5.4818C6.15925 4.79281 6.77811 4.10142 7.3994 3.41243L8.67584 1.9958C9.32614 1.27055 9.62108 0.808817 10.6751 1.07716C10.9164 1.12296 11.1428 1.227 11.3348 1.38021C11.5268 1.53343 11.6784 1.73119 11.7765 1.95633C11.8747 2.18146 11.9164 2.42715 11.898 2.67207C11.8796 2.91698 11.8018 3.15371 11.6711 3.36168C11.3488 3.94187 11.0264 4.52367 10.7041 5.10709C10.4624 5.55674 10.6775 5.93146 11.1876 5.93146C12.1546 5.93146 13.1216 5.93146 14.0886 5.93146C14.4061 5.92405 14.7196 6.00314 14.9955 6.16028C15.2715 6.31742 15.4995 6.54669 15.6551 6.82351C15.7901 7.05219 15.8719 7.30832 15.8944 7.57292Z'
      fill='white'
      stroke={color}
      stroke-miterlimit='10'
    />
  </svg>
);

export default Like;
