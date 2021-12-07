import Footer from 'components/common/Footer';
import Navbar from 'components/common/Navbar';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Avatar from 'components/common/Avatar';
import PostSkeleton from 'components/common/Skeletons/PostSkeleton';
import CommentBox from 'components/PostDetail/Comment/CommentBox';
import { useGetPostDetail } from 'hooks/post/useGetPosts';
import { loginUserState } from 'store/loginUser';
import { useRecoilValue } from 'recoil';
import { deletePost, postLike, postUnlike, viewCountUp } from 'api/post';
import { CommentType, LoginUserType } from 'types';
import { addComment, getComments } from 'api/comment';
import { categoryColor } from 'utils/categoryColor';
import { likeOrUnlike } from 'utils/likeOrUnlike';
import { debounce } from 'lodash';
import { storageService } from 'service/firebase';
import { PhotoLibrary } from '@styled-icons/material-outlined';
import CommentCount from 'components/common/Count/CommentCount';
import ViewCount from 'components/common/Count/ViewCount';
import LikeCount from 'components/common/Count/LikeCount';
import useModal from 'hooks/common/useModal';
import AlertModalButton from 'components/common/Portal/AlertModalButton';
import PortalContainer from 'components/common/Portal/PortalContainer';
import { parseUrl } from 'utils/regex';

const PostDetail = () => {
  const location = useLocation();
  const history = useHistory();
  const id = location.pathname.split('/')[2];
  const loginUser = useRecoilValue(loginUserState) as LoginUserType;

  const { post, fetchPostDetail } = useGetPostDetail();
  const [isCreator, setIsCreator] = useState<boolean>();
  const [contentMarkup, setContentMarkup] = useState({ __html: '' });
  const [comments, setComments] = useState<CommentType[]>([]);
  const commentRef = useRef<any>(null);
  const isSecret = post?.category === '비밀';

  const { modalOpened, onOpenModal, onCloseModal } = useModal();

  const onDeletePost = async (id: string) => {
    await deletePost(id);
    post?.attachment_url!! && (await storageService.refFromURL(post?.attachment_url!!).delete());
    history.push({ pathname: '/home', state: 'isDeleted' });
  };

  const onViewCountUp = async () => {
    if (post && !post?.visitor_list.includes(loginUser.uid)) {
      await viewCountUp(post.id, loginUser.uid);
    }
  };

  const onUpdateClick = () => {
    post &&
      history.push({
        pathname: '/upload',
        state: { mode: 'update', initialPost: post },
      });
  };

  const onSubmitComment: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (commentRef.current.value) {
      addComment({ post_id: id, uid: loginUser.uid, content: commentRef.current.value });
      commentRef.current.value = '';
      fetchComments();
    }
  };

  const onLikePost = async (liker_list: string[], loginUserUid: string) => {
    likeOrUnlike(liker_list, loginUserUid) === 'unlike'
      ? await postUnlike(id, loginUserUid)
      : await postLike(id, loginUserUid);
    fetchPostDetail(id);
  };

  const fetchComments = async () => {
    const __comments: any = await getComments(id);
    setComments(__comments);
  };

  useEffect(() => {
    if (post) {
      !!loginUser && !!post.creator && setIsCreator(loginUser.uid === post.creator.uid);
      setContentMarkup({ __html: parseUrl(post.content) });
    }
  }, [post]);

  useEffect(() => {
    fetchPostDetail(id);
    fetchComments();
  }, []);

  useEffect(() => {
    onViewCountUp();
  }, [post]);

  return (
    <Wrapper>
      <Navbar isLoggedIn={true} />
      {post ? (
        <PostContainer>
          <BackButton
            onClick={() =>
              history.push({
                pathname: '/home',
                state: history.location.state,
              })
            }
          >
            &#xE000;
          </BackButton>
          <ROW_1>
            <Title>{post.title}</Title>
            {!!post.attachment_url && <ImageIcon size='30px' />}
            <Category color={categoryColor(post.category)}>{post.category}</Category>
          </ROW_1>
          <ROW_2>
            <ProfileBox>
              <Avatar avatarId={isSecret ? -1 : post.creator.avatar_id} />
              <Creator isSecret={isSecret}>{isSecret ? '익명' : post.creator.nickname}</Creator>
            </ProfileBox>
            <IsEdited>{post.is_edited && `수정됨 `}</IsEdited>
            <CreatedAt>{new Date(post.created_at).toLocaleDateString()}</CreatedAt>
          </ROW_2>
          <ROW_3>
            {isCreator && (
              <EditBox>
                <UpdateBtn onClick={onUpdateClick}>수정하기</UpdateBtn>
                <DeleteBtn onClick={onOpenModal}>삭제하기</DeleteBtn>
              </EditBox>
            )}
          </ROW_3>
          {/* <HR /> */}
          <ContentWrapper>
            <Content dangerouslySetInnerHTML={contentMarkup} />
            {post.attachment_url?.length ? <Images src={post.attachment_url} alt='' /> : <></>}
          </ContentWrapper>
          <CountBox>
            <ViewCount size='16px' count={post.visitor_list?.length} />
            <CommentCount size='16px' count={post.comment_count} />
            <LikeCount
              size='16px'
              count={post.liker_list?.length}
              flag={likeOrUnlike(post.liker_list, loginUser.uid)}
              onClick={debounce(() => onLikePost(post.liker_list, loginUser.uid!!), 800)}
            />
          </CountBox>

          <CommentWriteWrapper>
            <CommentWrite ref={commentRef} placeholder='댓글을 입력해주세요.' />
            <SubmitBtn onClick={onSubmitComment} type='submit'>
              등록하기
            </SubmitBtn>
          </CommentWriteWrapper>

          <CommentBox
            postId={id}
            commentList={comments}
            fetchComments={fetchComments}
            category={post.category}
          />
        </PostContainer>
      ) : (
        <PostSkeleton />
      )}
      <Footer />
      {modalOpened && (
        <PortalContainer onClose={onCloseModal}>
          <AlertModalButton
            title='글을 삭제하시겠습니까?'
            twoButton={true}
            callback={() => onDeletePost(id)}
            onCloseModal={onCloseModal}
          />
        </PortalContainer>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow-y: hidden;
`;

const PostContainer = styled.section`
  max-width: 1120px;
  padding: 0 60px;
  margin: 3% auto;

  @media ${({ theme }) => theme.size.mobile} {
    width: 90%;
    padding: 0 20px;
  }
`;

const BackButton = styled.span`
  font-weight: 700;
  font-size: 2em;
  cursor: pointer;
`;

const ROW_1 = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 24px;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 2rem;
  line-height: 1;
  flex: 8;
  word-break: break-all;

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 1.6rem;
  }
`;

const Category = styled.div`
  max-width: 80px;
  text-align: center;
  background-color: ${(props) => props.color};
  color: #eeeeee;
  border-radius: 20px;
  padding: 4px 16px;
  font-size: 1rem;
  line-height: 1;
  flex: 1;

  @media ${({ theme }) => theme.size.mobile} {
    flex: 2;
  }
`;

const ImageIcon = styled(PhotoLibrary)`
  flex: 1;
  color: #333;
`;

const ROW_2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 0;
  gap: 12px;

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 0.8em;
  }
`;

const ROW_3 = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.3em;
  margin: 4px 0;

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 1em;
  }
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

interface ICreator {
  isSecret: boolean;
}

const Creator = styled.span<ICreator>`
  font-weight: 500;
  font-size: 1.2em;
  color: ${({ theme, isSecret }) => (isSecret ? 'gray' : theme.color.MAIN)};
`;

const CountBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Btn = styled.button`
  font-size: 1em;
  font-weight: 500;
  color: #999;
`;

const EditBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  font-size: 0.8rem;
`;

const UpdateBtn = styled(Btn)``;

const DeleteBtn = styled(Btn)``;

const CreatedAt = styled.span`
  font-weight: 500;
  font-size: 1.1rem;
  color: #999;

  @media ${({ theme }) => theme.size.mobile} {
    font-size: 0.9rem;
  }
`;

const IsEdited = styled(CreatedAt)`
  line-height: 1.5;
  font-size: 0.9rem;
`;

const ContentWrapper = styled.section`
  min-height: 100px;
  margin: 20px 2px 40px;
`;

const Content = styled.div`
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const Images = styled.img`
  max-width: 500px;
  margin-bottom: 24px;

  @media ${({ theme }) => theme.size.mobile} {
    max-width: 300px;
  }
`;

const Button = styled.button`
  font-weight: 500;
  font-size: 1rem;
  padding: 4px 0px;
  border-radius: 4px;
`;

const CommentWriteWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 20px 0 30px;
  gap: 4px;
  border: 0.3px solid #666;
  border-radius: 4px;
  padding: 0px;
`;

const CommentWrite = styled.input`
  font-weight: 400;
  font-size: 1rem;
  padding: 10px 0px 10px 8px;
  width: 100%;
  flex: 1;
`;

const SubmitBtn = styled(Button)`
  width: 100px;
  color: #666;
`;

export default PostDetail;
