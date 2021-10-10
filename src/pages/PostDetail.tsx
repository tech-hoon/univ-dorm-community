import Footer from 'components/common/Footer';
import Navbar from 'components/common/Navbar';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Avatar from 'components/common/ProfileBox/Avatar';
import PostSkeleton from 'components/common/Skeletons/PostSkeleton';
import CountBox from 'components/common/CountBox';
import CommentBox from 'components/PostDetail/CommentBox';
import { useGetPostDetail } from 'hooks/useGetPosts';
import { loginUserState } from 'store/loginUser';
import { useRecoilValue } from 'recoil';
import { deletePost } from 'api/post';

interface Props {}

const PostDetail = (props: Props) => {
  const location = useLocation();
  const history = useHistory();
  const id = location.pathname.split('/')[2];

  const loginUser = useRecoilValue(loginUserState);

  const { post } = useGetPostDetail(id);
  const [isCreator, setIsCreator] = useState<boolean>();
  const [contentMarkup, setContentMarkup] = useState({ __html: '' });

  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    ok && deletePost(id) && history.push('/');
  };

  const onUpdateClick = () => {
    history.push({ pathname: '/update', state: id });
  };

  useEffect(() => {
    if (post) {
      !!loginUser && !!post.creator && setIsCreator(loginUser.uid === post.creator.uid);

      setContentMarkup({ __html: post.content });
    }
  }, [post]);

  return (
    <Wrapper>
      <Navbar isLoggedIn={true} />
      {!!post ? (
        <PostContainer>
          <BackButton onClick={() => history.goBack()}>&#xE000;</BackButton>
          <Title>{post.title}</Title>
          <ROW_1>
            <ProfileBox>
              <Avatar />
              <Creator>{post.creator?.displayName}</Creator>
            </ProfileBox>
            <CreatedAt>{new Date(post.created_at).toLocaleDateString()}</CreatedAt>
          </ROW_1>
          <ROW_2>
            카테고리 <Category>{post.category}</Category>
            {isCreator && (
              <EditBox>
                <UpdateBtn onClick={onUpdateClick}>수정하기</UpdateBtn>
                <DeleteBtn onClick={onDeleteClick}>삭제하기</DeleteBtn>
              </EditBox>
            )}
          </ROW_2>
          <HR />
          <Content dangerouslySetInnerHTML={contentMarkup} />
          <CountBox
            size='20px'
            viewCount={post.view_count!!}
            likeCount={post.like_count!!}
            commentCount={post.comment_list?.length!!}
          />
          <CommentBox />
        </PostContainer>
      ) : (
        <PostSkeleton />
      )}
      <Footer />
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const PostContainer = styled.section`
  width: 70vw;
  margin: 8% auto;
`;

const BackButton = styled.span`
  font-family: 'Spoqa Bold';
  font-size: 2em;
  cursor: pointer;
`;

const Title = styled.h1`
  font-family: 'Spoqa Bold';
  font-size: 2.5em;
  text-transform: uppercase;
  margin-top: 24px;
`;

const ROW_1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 0;
`;

const ROW_2 = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Spoqa Medium';
  font-size: 1.3em;
`;

const Category = styled.span`
  border: 0.1px solid #dedede;
  background-color: orange;
  color: #eeeeee;
  border-radius: 20px;
  padding: 4px 12px;
`;

const HR = styled.hr`
  height: 3px;
  background-color: #dcdcdc;
  border: none;
  margin: 40px 0;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Creator = styled.span`
  font-family: 'Spoqa Medium';
  font-size: 1.5em;
  color: #999999;
`;

const EditBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const Btn = styled.button``;

const UpdateBtn = styled(Btn)``;

const DeleteBtn = styled(Btn)``;

const CreatedAt = styled.span`
  font-family: 'Spoqa Medium';
  font-size: 1.5em;
  color: #999;
`;

const Content = styled.section`
  margin: 40px 0;
  font-size: 20px;
  line-height: 200%;
`;

export default PostDetail;
