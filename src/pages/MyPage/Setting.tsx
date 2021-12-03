import styled from 'styled-components';
import { useRef, useState } from 'react';
import { Layouts as S } from 'components/Mypage/Layouts';
import { SettingsOutline } from '@styled-icons/evaicons-outline';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { loginUserState } from 'store/loginUser';
import AvatarSelect from 'components/common/Avatar/AvatarSelect';
import { useHistory } from 'react-router';
import { updateProfile, verifyNickname } from 'api/user';
import { loginUserType } from 'types';
import { NICKNAME_LENGTH } from 'utils/config';

const Setting = () => {
  const user = useRecoilValue(loginUserState) as loginUserType;
  const setLoginUser = useSetRecoilState(loginUserState);
  const [avatarId, setAvatarId] = useState<number>(user.avatar_id);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  //TODO: Avatar만 바꿀 때, 닉네임 그대로일 때 처리

  const onAvatarIdPrev = () => setAvatarId((prev) => (prev <= 1 ? 10 - prev : prev - 1));
  const onAvatarIdNext = () => setAvatarId((prev) => (prev >= 10 ? (prev % 10) + 1 : prev + 1));

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const __value = event.target.value;
    if (!__value) {
      setErrorInfo('* 필수 입력 항목입니다.');
      return;
    }
    if (__value.length > NICKNAME_LENGTH) {
      setErrorInfo(`* ${NICKNAME_LENGTH}자 이하로 입력해주세요.`);
      return;
    }
    setErrorInfo(null);
  };

  const onCancel = () => history.push('/home');

  const onSubmit = async () => {
    const __value = inputRef?.current?.value;

    if (!__value || __value.length > NICKNAME_LENGTH) {
      window.alert(
        !__value ? `입력값을 모두 입력해 주세요` : `${NICKNAME_LENGTH}자 이하로 입력해주세요`
      );
      return;
    }

    if (user.avatar_id === avatarId && user.nickname === __value) {
      history.push('/home');
      return;
    }

    if (!(await verifyNickname(__value))) {
      setErrorInfo('* 이미 존재하는 닉네임입니다.');
      return;
    }

    const newData = { uid: user.uid, nickname: __value, avatar_id: avatarId };

    updateProfile(newData);
    setLoginUser({ ...user, ...newData });

    history.push({
      pathname: '/home',
      state: 'profileUpdated',
    });
  };

  return (
    <S.Wrapper>
      <S.Navbar isLoggedIn={true} />
      <S.Container>
        <Title>
          <SettingsOutline size='30px' />
          나의 정보 수정
        </Title>
        <Body>
          <AvatarSelect
            onClickNext={onAvatarIdNext}
            onClickPrev={onAvatarIdPrev}
            avatarId={avatarId}
            size={`80%`}
          />
          <NicknameWrapper>
            <Label>닉네임</Label>
            <InputWrapper>
              <NicknameInput
                defaultValue={user.nickname}
                onChange={onChange}
                ref={inputRef}
                isWarning={!!errorInfo}
              />
              <InputErrorInfo>{errorInfo}</InputErrorInfo>
            </InputWrapper>
          </NicknameWrapper>
          <ButtonWrapper>
            <CancleButton onClick={onCancel}>취소</CancleButton>
            <SubmitButton onClick={onSubmit} disabled={errorInfo ? true : false}>
              완료
            </SubmitButton>
            {/* <DeleteButton>회원 탈퇴</DeleteButton> */}
          </ButtonWrapper>
        </Body>
      </S.Container>
    </S.Wrapper>
  );
};

const Body = styled.div`
  width: 100%;
  margin: 40px auto;
`;

const NicknameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  line-height: 1;
  margin-top: 32px;
`;

const Title = styled(S.Title)`
  @media ${({ theme }) => theme.size.mobile} {
    justify-content: center;
  }
`;

const Label = styled.label`
  align-self: flex-start;
  font-weight: bold;
  font-size: 1.3rem;
  padding-top: 9px;

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 1.2em;
  }

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 1em;
  }
`;

interface INicknameInput {
  isWarning: boolean;
}

const InputWrapper = styled.div``;

const NicknameInput = styled.input<INicknameInput>`
  font-size: 1.5rem;
  padding: 4px 0 4px 8px;
  border: 1px solid ${({ isWarning }) => (isWarning ? '#f77' : '#ccc')};
  border-radius: 4px;

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 1.3em;
  }

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 1em;
  }
`;

const InputErrorInfo = styled.div`
  width: 100%;
  font-size: 0.8rem;
  height: 1rem;
  margin-top: 10px;
  color: #f77;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0;
`;

const CancleButton = styled(S.Button)`
  background-color: #888;
  margin-right: 8px;
`;

const SubmitButton = styled(S.Button)`
  background-color: black;
  margin-right: 8px;

  &:disabled {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
  }
`;
const DeleteButton = styled(S.Button)`
  background-color: #f77;
`;

export default Setting;
