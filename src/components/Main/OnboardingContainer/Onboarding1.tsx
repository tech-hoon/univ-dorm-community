import { Layouts as S, IProps } from './Layouts';

const DetailContainer1 = ({ onClick, screenHeight }: IProps) => {
  return (
    <S.Wrapper backgroundColor='pink'>
      <S.Container>
        <S.Contents>상세 페이지 1(준비중)</S.Contents>
        <S.ButtonWrapper screenHeight={screenHeight}>
          <S.ScrollDownButton onClick={onClick} data-page-id={2} />
        </S.ButtonWrapper>
      </S.Container>
    </S.Wrapper>
  );
};

export default DetailContainer1;
